import { NextRequest, NextResponse } from 'next/server';
import { getAllTenants } from '@/lib/config/tenants';
import { mockDb } from '@/lib/supabase/mockDb';
import { logAuditEvent } from '@/lib/security/auditLogger';

export async function GET(request: NextRequest) {
  return handleCronDigest(request);
}

export async function POST(request: NextRequest) {
  return handleCronDigest(request);
}

async function handleCronDigest(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET || 'bizos_super_secure_cron_token_change_in_prod';

  // Authorization check (Bearer header or query token for external free cron pingers like cron-job.org)
  const authHeader = request.headers.get('authorization');
  const queryToken = new URL(request.url).searchParams.get('token');
  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` ||
    queryToken === cronSecret ||
    request.headers.get('user-agent')?.includes('vercel-cron');

  if (!isAuthorized && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
  }

  const tenants = getAllTenants();
  const digests = [];

  for (const tenant of tenants) {
    const bookings = mockDb.getBookings(tenant.id);
    const services = mockDb.getServices(tenant.id);

    const totalRevenue = bookings.reduce((sum, b) => {
      const s = services.find((srv) => srv.id === b.service_id);
      return sum + (s?.price || 0);
    }, 0);

    digests.push({
      tenantName: tenant.name,
      vertical: tenant.verticalType,
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter((b) => b.status === 'confirmed').length,
      estimatedRevenue: `${tenant.branding.currency}${totalRevenue.toFixed(2)}`,
    });

    await logAuditEvent({
      tenantId: tenant.id,
      actorId: 'cron_worker',
      action: 'cron.weekly_digest_generated',
      resource: 'scheduled_digest',
      details: { totalBookings: bookings.length, revenue: totalRevenue },
      status: 'success',
    });
  }

  return NextResponse.json({
    success: true,
    triggeredAt: new Date().toISOString(),
    frequency: 'Weekly (Every Monday at 00:00 UTC)',
    vercelHobbyCompatible: true,
    externalPingerCompatible: true,
    digests,
  });
}
