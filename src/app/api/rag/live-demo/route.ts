import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { validateUserInput, buildGroundedSystemPrompt, sanitizeOutput } from '@/lib/rag/guardrails';
import { callLlm } from '@/lib/llm/adapter';

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // Rate limit live demo to prevent spamming
  const rateLimit = await checkRateLimit(`livedemo:${clientIp}`, 15, 60);
  if (!rateLimit.success) {
    return NextResponse.json({ error: 'Demo limit reached. Please wait 1 minute.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { documentTitle = 'Visitor Document', documentContent, question } = body;

    if (!documentContent || !question) {
      return NextResponse.json(
        { error: 'Both documentContent and question are required' },
        { status: 400 }
      );
    }

    // 1. Guardrail validation on question
    const guard = validateUserInput(question);
    if (!guard.isSafe) {
      return NextResponse.json({
        response: 'Disallowed question format or injection signature detected.',
        flagged: true,
      });
    }

    // 2. Wrap custom visitor doc as context
    const contextChunks = [
      {
        title: documentTitle.slice(0, 80),
        content: documentContent.slice(0, 3000), // cap at 3000 chars
      },
    ];

    // 3. Construct prompt
    const systemPrompt = buildGroundedSystemPrompt('Visitor Custom Live Demo', contextChunks, []);

    // 4. Query LLM
    const llmResult = await callLlm({
      systemPrompt,
      userMessage: guard.sanitizedMessage,
      temperature: 0.1,
    });

    return NextResponse.json({
      success: true,
      response: sanitizeOutput(llmResult.content),
      sources: contextChunks,
      provider: llmResult.providerUsed,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
