import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { mockDb } from '@/lib/supabase/mockDb';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { logAuditEvent } from '@/lib/security/auditLogger';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenant_id');

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing required parameter: tenant_id' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(name, price, duration)')
        .eq('tenant_id', tenantId)
        .order('datetime', { ascending: true });

      if (!error && data) {
        return NextResponse.json({ bookings: data });
      }
    } catch (err) {
      console.warn('Supabase bookings query error, using mockDb:', err);
    }
  }

  const bookings = mockDb.getBookings(tenantId);
  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Persistent Rate Limiting (20 bookings/min per IP)
  const rateLimit = await checkRateLimit(`booking:${clientIp}`, 20, 60);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before submitting another booking.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { tenant_id, service_id, customer_name, customer_email, customer_phone, datetime, notes } = body;

    if (!tenant_id || !service_id || !customer_name || !customer_email || !datetime) {
      return NextResponse.json(
        { error: 'Missing required fields: tenant_id, service_id, customer_name, customer_email, datetime' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            tenant_id,
            service_id,
            customer_name,
            customer_email,
            customer_phone: customer_phone || null,
            datetime,
            status: 'confirmed',
            notes: notes || '',
          })
          .select()
          .single();

        if (!error && data) {
          await logAuditEvent({
            tenantId: tenant_id,
            actorId: 'web_form',
            action: 'booking.created',
            resource: `bookings:${data.id}`,
            details: { customer: customer_name, email: customer_email, service_id },
            ipAddress: clientIp,
            status: 'success',
          });

          return NextResponse.json({ booking: data, success: true });
        }
      } catch (err) {
        console.warn('Supabase booking create error, falling back to mockDb:', err);
      }
    }

    // Mock DB Fallback
    const newBooking = mockDb.createBooking({
      tenant_id,
      service_id,
      customer_name,
      customer_email,
      customer_phone,
      datetime,
      status: 'confirmed',
      notes,
    });

    return NextResponse.json({ booking: newBooking, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
