import { NextRequest, NextResponse } from 'next/server';
import { fetchAuditLogs, logAuditEvent } from '@/lib/security/auditLogger';
import { mockDb } from '@/lib/supabase/mockDb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenant_id');

  if (!tenantId) {
    return NextResponse.json({ error: 'tenant_id is required' }, { status: 400 });
  }

  const logs = await fetchAuditLogs(tenantId);
  return NextResponse.json({ logs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant_id } = body;

    if (!tenant_id) {
      return NextResponse.json({ error: 'tenant_id is required' }, { status: 400 });
    }

    // Run active data isolation test
    const verification = mockDb.verifyDataIsolation(tenant_id);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tenantId: tenant_id,
      isolationStatus: verification.passed ? 'SECURE_ISOLATED' : 'LEAK_DETECTED',
      crossTenantLeakage: verification.crossTenantLeakage,
      tests: verification.tests,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
