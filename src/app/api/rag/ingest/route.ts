import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { mockDb } from '@/lib/supabase/mockDb';
import { chunkText } from '@/lib/rag/chunker';
import { generateEmbedding } from '@/lib/rag/embeddings';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { logAuditEvent } from '@/lib/security/auditLogger';

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // Rate limit doc ingestion
  const rateLimit = await checkRateLimit(`ingest:${clientIp}`, 10, 60);
  if (!rateLimit.success) {
    return NextResponse.json({ error: 'Ingestion rate limit exceeded' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { tenant_id, title, content, metadata = {} } = body;

    if (!tenant_id || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: tenant_id, title, content' },
        { status: 400 }
      );
    }

    // 1. Chunk document
    const chunks = chunkText(content, 800, 100);
    const supabase = getServerSupabase();
    const insertedRecords = [];

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.content);

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('documents')
            .insert({
              tenant_id,
              title: `${title} (Part ${chunk.chunkIndex + 1})`,
              content: chunk.content,
              metadata: { ...metadata, chunkIndex: chunk.chunkIndex },
              embedding,
            })
            .select('id, title')
            .single();

          if (!error && data) {
            insertedRecords.push(data);
          }
        } catch (err) {
          console.warn('Supabase doc insert error, falling back to mockDb:', err);
        }
      }

      if (insertedRecords.length === 0) {
        const mockDoc = mockDb.addDocument({
          tenant_id,
          title: `${title} (Part ${chunk.chunkIndex + 1})`,
          content: chunk.content,
          metadata: { ...metadata, chunkIndex: chunk.chunkIndex },
          embedding,
        });
        insertedRecords.push(mockDoc);
      }
    }

    await logAuditEvent({
      tenantId: tenant_id,
      actorId: 'admin_uploader',
      action: 'document.ingested',
      resource: `documents:${title}`,
      details: { chunksCount: chunks.length, totalLength: content.length },
      ipAddress: clientIp,
      status: 'success',
    });

    return NextResponse.json({
      success: true,
      chunksCreated: chunks.length,
      documents: insertedRecords,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
