import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { mockDb } from '@/lib/supabase/mockDb';
import { getTenantById } from '@/lib/config/tenants';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { validateUserInput, buildGroundedSystemPrompt, sanitizeOutput } from '@/lib/rag/guardrails';
import { BOOKING_TOOL, executeAgentTool } from '@/lib/rag/tools';
import { callLlm } from '@/lib/llm/adapter';
import { generateEmbedding } from '@/lib/rag/embeddings';
import { logAuditEvent } from '@/lib/security/auditLogger';

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Persistent Rate Limiter (30 chat requests/min)
  const rateLimit = await checkRateLimit(`chat:${clientIp}`, 30, 60);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded for chat messages. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { tenant_id, message, session_id = 'sess-' + Math.random().toString(36).substring(2, 7) } = body;

    if (!tenant_id || !message) {
      return NextResponse.json({ error: 'tenant_id and message are required' }, { status: 400 });
    }

    const tenant = getTenantById(tenant_id);
    const brandName = tenant?.branding.brandName || 'BizOS';

    // 2. Input Sanitization & Prompt Injection Guardrails
    const guardrail = validateUserInput(message);
    if (!guardrail.isSafe) {
      await logAuditEvent({
        tenantId: tenant_id,
        actorId: 'anon_client',
        action: 'security.prompt_injection_flagged',
        resource: 'rag_chat',
        details: { reason: guardrail.flagReason, inputSnippet: message.slice(0, 100) },
        ipAddress: clientIp,
        status: 'denied',
      });

      return NextResponse.json({
        response:
          'Security Notice: Your query contained disallowed control patterns or instructions. Please ask a direct question regarding our services or policies.',
        flagged: true,
        sources: [],
      });
    }

    // 3. Retrieve Context via pgvector / Mock Search
    let contextChunks: { title: string; content: string }[] = [];
    const supabase = getServerSupabase();

    if (supabase) {
      try {
        const queryVector = await generateEmbedding(guardrail.sanitizedMessage);
        const { data, error } = await supabase.rpc('match_tenant_documents', {
          query_embedding: queryVector,
          match_threshold: 0.35,
          match_count: 3,
          filter_tenant_id: tenant_id,
        });

        if (!error && data && data.length > 0) {
          contextChunks = data.map((d: any) => ({
            title: d.title,
            content: d.content,
          }));
        }
      } catch (err) {
        console.warn('Supabase match_tenant_documents RPC error, using mockDb:', err);
      }
    }

    if (contextChunks.length === 0) {
      const searchResults = mockDb.searchDocuments(tenant_id, guardrail.sanitizedMessage, 3);
      contextChunks = searchResults.map((r) => ({
        title: r.doc.title,
        content: r.doc.content,
      }));
    }

    // 4. Retrieve Active Services for tool calling / grounding
    let availableServices: { name: string; price: number; duration: number }[] = [];
    if (supabase) {
      try {
        const { data } = await supabase
          .from('services')
          .select('name, price, duration')
          .eq('tenant_id', tenant_id)
          .eq('is_active', true);
        if (data) availableServices = data;
      } catch (err) {
        console.warn('Supabase service query error:', err);
      }
    }
    if (availableServices.length === 0) {
      availableServices = mockDb.getServices(tenant_id).map((s) => ({
        name: s.name,
        price: s.price,
        duration: s.duration,
      }));
    }

    // 5. Construct Grounded System Prompt
    const systemPrompt = buildGroundedSystemPrompt(brandName, contextChunks, availableServices);

    // 6. Call LLM Adapter
    const llmResult = await callLlm({
      systemPrompt,
      userMessage: guardrail.sanitizedMessage,
      tools: [BOOKING_TOOL],
      temperature: 0.2,
    });

    let actionTaken: any = null;
    let finalContent = llmResult.content;

    // 7. Agent Action Layer (Tool Calling Execution)
    if (llmResult.toolCalls && llmResult.toolCalls.length > 0) {
      const toolCall = llmResult.toolCalls[0];
      const execResult = await executeAgentTool(tenant_id, toolCall.name, toolCall.arguments);
      actionTaken = execResult;

      if (execResult.success) {
        finalContent = `${finalContent ? finalContent + '\n\n' : ''}✅ **${execResult.message}**`;
      }
    }

    // 8. Output Sanitization
    const sanitizedOutputText = sanitizeOutput(finalContent);

    // 9. Store Chat Log
    if (supabase) {
      try {
        await supabase.from('chat_logs').insert({
          tenant_id,
          session_id,
          message: guardrail.sanitizedMessage,
          response: sanitizedOutputText,
          sources: contextChunks,
          action_taken: actionTaken,
        });
      } catch (err) {
        console.warn('Supabase chat_log insert error:', err);
      }
    }

    // Log general RAG query in audit log
    await logAuditEvent({
      tenantId: tenant_id,
      actorId: 'customer_chat',
      action: 'rag.query_processed',
      resource: 'rag_engine',
      details: {
        sourcesCount: contextChunks.length,
        provider: llmResult.providerUsed,
        actionExecuted: Boolean(actionTaken),
      },
      ipAddress: clientIp,
      status: 'success',
    });

    return NextResponse.json({
      response: sanitizedOutputText,
      sources: contextChunks,
      actionTaken,
      provider: llmResult.providerUsed,
      sessionId: session_id,
    });
  } catch (err: any) {
    console.error('RAG Chat endpoint error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
