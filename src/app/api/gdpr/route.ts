import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/supabase/mockDb';
import { logAuditEvent } from '@/lib/security/auditLogger';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenant_id');

  if (!tenantId) {
    return NextResponse.json({ error: 'tenant_id is required' }, { status: 400 });
  }

  const exportData = mockDb.exportTenantData(tenantId);
  return NextResponse.json(exportData);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant_id, reason = 'GDPR Article 17 Right to Erasure' } = body;

    if (!tenant_id) {
      return NextResponse.json({ error: 'tenant_id is required' }, { status: 400 });
    }

    await logAuditEvent({
      tenantId: tenant_id,
      actorId: 'admin_gdpr',
      action: 'gdpr.deletion_requested',
      resource: `tenant:${tenant_id}`,
      details: { reason, scheduled_action: 'purged_within_24h' },
      status: 'success',
    });

    return NextResponse.json({
      success: true,
      message: 'GDPR deletion request registered. In production, tenant data will be scrubbed within 24 hours.',
      compliance: 'GDPR Article 17 (Right to Erasure)',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
