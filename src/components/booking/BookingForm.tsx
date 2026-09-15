'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Sparkles, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { DbService } from '@/lib/supabase/mockDb';

interface Props {
  tenantId: string;
  selectedService: DbService | null;
  onBookingSuccess?: () => void;
}

interface Slot {
  time: string;
  datetime: string;
  available: boolean;
}

export default function BookingForm({ tenantId, selectedService, onBookingSuccess }: Props) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ success: boolean; message: string; bookingId?: string } | null>(null);

  // Fetch slots on date change
  useEffect(() => {
    async function fetchAvailability() {
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const res = await fetch(`/api/bookings/availability?tenant_id=${tenantId}&date=${selectedDate}`);
        const data = await res.json();
        if (data.slots) {
          setSlots(data.slots);
          const firstAvail = data.slots.find((s: Slot) => s.available);
          if (firstAvail) setSelectedSlot(firstAvail);
        }
      } catch (err) {
        console.error('Error fetching availability:', err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchAvailability();
  }, [tenantId, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot) return;

    setSubmitting(true);
    setBookingResult(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          service_id: selectedService.id,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          datetime: selectedSlot.datetime,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBookingResult({
          success: true,
          message: `Appointment confirmed for ${name}!`,
          bookingId: data.booking?.id,
        });
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
        if (onBookingSuccess) onBookingSuccess();
      } else {
        setBookingResult({
          success: false,
          message: data.error || 'Failed to submit booking. Please try again.',
        });
      }
    } catch (err: any) {
      setBookingResult({ success: false, message: err.message || 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel-glow" style={{ padding: '32px', borderRadius: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span className="badge badge-tenant" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>
          CONFIRM RESERVATION
        </span>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Schedule Appointment</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {selectedService ? (
            <span>
              Selected: <strong style={{ color: '#ffffff' }}>{selectedService.name}</strong> (${selectedService.price})
            </span>
          ) : (
            'Please select a treatment from the menu.'
          )}
        </p>
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: '22px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}
        >
          <Calendar size={15} color="var(--primary)" /> 1. Select Appointment Date
        </label>
        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field"
          style={{ width: '100%', maxWidth: '240px' }}
        />
      </div>

      {/* Slot Selection */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            <Clock size={15} color="var(--primary)" /> 2. Pick an Available Time
          </label>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Real-time conflict check
          </span>
        </div>

        {loadingSlots ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Checking slot availability...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: '8px' }}>
            {slots.map((s) => {
              const isSelected = selectedSlot?.time === s.time;
              return (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setSelectedSlot(s)}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: isSelected
                      ? '1px solid var(--primary)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: isSelected
                      ? 'var(--primary)'
                      : s.available
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(255, 255, 255, 0.01)',
                    color: isSelected
                      ? '#ffffff'
                      : s.available
                      ? '#ffffff'
                      : 'var(--text-dim)',
                    cursor: s.available ? 'pointer' : 'not-allowed',
                    textDecoration: s.available ? 'none' : 'line-through',
                    opacity: s.available ? 1 : 0.35,
                    boxShadow: isSelected ? '0 0 16px var(--primary-glow)' : 'none',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {s.time}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Full Name *
          </label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Jessica Sterling"
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="name@example.com"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+1-555-0199"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Special Stylist Notes / Preferences
          </label>
          <div style={{ position: 'relative' }}>
            <MessageSquare size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              placeholder="e.g. Quiet session, organic shampoo only..."
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedService || !selectedSlot || submitting}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px', padding: '14px', borderRadius: '12px', fontSize: '0.98rem' }}
        >
          {submitting ? 'Confirming Appointment...' : 'Confirm Appointment Now'}
        </button>
      </form>

      {/* Confirmation feedback */}
      {bookingResult && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: bookingResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${bookingResult.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {bookingResult.success ? (
            <CheckCircle size={22} color="#34d399" />
          ) : (
            <AlertCircle size={22} color="#f87171" />
          )}
          <div>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
              {bookingResult.message}
            </p>
            {bookingResult.bookingId && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Ref ID: <code style={{ color: 'var(--primary)' }}>{bookingResult.bookingId}</code> • Synced to PostgreSQL RLS
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
