'use client';

import React from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { DbBooking } from '@/lib/supabase/mockDb';

interface Props {
  bookings: DbBooking[];
  currency?: string;
}

export default function BookingsCalendar({ bookings, currency = '$' }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <CalendarIcon size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
        <h4 style={{ color: 'var(--text-muted)' }}>No bookings found for this tenant</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          New appointments booked via storefront or AI agent will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Upcoming Schedule & Bookings</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Scoped strictly by Row Level Security (RLS) for this tenant
          </p>
        </div>
        <span className="badge badge-tenant">{bookings.length} Total Bookings</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {bookings.map((b) => {
          const dateObj = new Date(b.datetime);
          const dateFormatted = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
          const timeFormatted = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const statusColor =
            b.status === 'confirmed' ? '#34d399' : b.status === 'completed' ? '#60a5fa' : '#f87171';

          return (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  <span>{dateObj.toLocaleDateString([], { month: 'short' })}</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--primary)' }}>{dateObj.getDate()}</span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{b.customer_name}</span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: `${statusColor}22`,
                        color: statusColor,
                        textTransform: 'capitalize',
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>{b.customer_email}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {timeFormatted}
                    </span>
                  </div>
                  {b.notes && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', fontStyle: 'italic' }}>
                      &ldquo;{b.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {b.id.slice(0, 10)}...
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
