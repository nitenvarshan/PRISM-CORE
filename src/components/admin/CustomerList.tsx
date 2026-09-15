'use client';

import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';
import { DbBooking, DbService } from '@/lib/supabase/mockDb';

interface Props {
  bookings: DbBooking[];
  services: DbService[];
  currency?: string;
}

export default function CustomerList({ bookings, services, currency = '$' }: Props) {
  const [search, setSearch] = useState('');

  // Aggregate unique customers
  const customerMap = new Map<
    string,
    { name: string; email: string; phone?: string; bookingsCount: number; totalSpent: number; lastBooking: string }
  >();

  bookings.forEach((b) => {
    const srv = services.find((s) => s.id === b.service_id);
    const cost = srv?.price || 0;
    const existing = customerMap.get(b.customer_email);

    if (!existing) {
      customerMap.set(b.customer_email, {
        name: b.customer_name,
        email: b.customer_email,
        phone: b.customer_phone,
        bookingsCount: 1,
        totalSpent: cost,
        lastBooking: b.datetime,
      });
    } else {
      existing.bookingsCount += 1;
      existing.totalSpent += cost;
      if (new Date(b.datetime) > new Date(existing.lastBooking)) {
        existing.lastBooking = b.datetime;
      }
    }
  });

  const customers = Array.from(customerMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Customer Directory</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Aggregated customer accounts and booking histories
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {customers.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '30px' }}>
          No customer records match your filter.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {customers.map((c) => (
            <div
              key={c.email}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(var(--primary-rgb), 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>{c.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> {c.email}
                    </span>
                    {c.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> {c.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                  {currency}{c.totalSpent.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {c.bookingsCount} {c.bookingsCount === 1 ? 'booking' : 'bookings'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
