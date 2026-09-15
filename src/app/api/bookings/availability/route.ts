import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/supabase/mockDb';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenant_id');
  const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

  if (!tenantId) {
    return NextResponse.json({ error: 'tenant_id is required' }, { status: 400 });
  }

  // Standard business hours: 09:00 to 18:00
  const candidateTimes = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:30',
    '14:30',
    '15:30',
    '16:30',
    '17:30',
  ];

  let existingBookings: any[] = [];
  const supabase = getServerSupabase();

  if (supabase) {
    try {
      const startOfDay = `${dateStr}T00:00:00.000Z`;
      const endOfDay = `${dateStr}T23:59:59.999Z`;

      const { data } = await supabase
        .from('bookings')
        .select('datetime, status')
        .eq('tenant_id', tenantId)
        .gte('datetime', startOfDay)
        .lte('datetime', endOfDay)
        .neq('status', 'cancelled');

      if (data) existingBookings = data;
    } catch (err) {
      console.warn('Supabase availability fetch error, falling back to mockDb:', err);
    }
  }

  if (existingBookings.length === 0) {
    existingBookings = mockDb
      .getBookings(tenantId)
      .filter((b) => b.datetime.startsWith(dateStr) && b.status !== 'cancelled');
  }

  const bookedHours = existingBookings.map((b) => {
    const d = new Date(b.datetime);
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  });

  const slots = candidateTimes.map((time) => {
    const isBooked = bookedHours.some((bh) => bh === time);
    return {
      time,
      datetime: `${dateStr}T${time}:00.000Z`,
      available: !isBooked,
    };
  });

  return NextResponse.json({ date: dateStr, slots });
}
