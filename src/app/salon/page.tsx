'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, Star, Scissors, Heart, ShieldCheck, Award, Check } from 'lucide-react';
import { DEMO_TENANTS } from '@/lib/config/tenants';
import { mockDb, DbService } from '@/lib/supabase/mockDb';
import ServiceCard from '@/components/booking/ServiceCard';
import BookingForm from '@/components/booking/BookingForm';
import BizChatWidget from '@/components/chat/BizChatWidget';

export default function SalonDemoPage() {
  const tenant = DEMO_TENANTS.salon;
  const services = mockDb.getServices(tenant.id);
  const [selectedService, setSelectedService] = useState<DbService | null>(services[0] || null);

  return (
    <div data-tenant="salon" style={{ minHeight: 'calc(100vh - 72px)', paddingBottom: '120px' }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '70px 20px 45px',
          textAlign: 'center',
          maxWidth: '1020px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="badge badge-tenant" style={{ fontSize: '0.76rem', padding: '6px 14px' }}>
            DEMO VERTICAL A: SALON & SPA
          </span>
          <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
            Booking Module Front & Center
          </span>
        </div>

        <h1
          style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            marginBottom: '18px',
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
          }}
        >
          Bespoke Color & <span className="tenant-gradient-text">Luxury Hair Rituals</span>
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 32px',
            lineHeight: '1.65',
          }}
        >
          Master balayage artists and restorative scalp therapies. Select a signature service below or use our AI Concierge in the bottom right to reserve your appointment.
        </p>

        {/* Social proof pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            color: 'var(--text-dim)',
            fontSize: '0.88rem',
            fontWeight: 600,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fda4af' }}>
            <Star size={16} color="#fbbf24" fill="#fbbf24" /> 4.98 Rating (340+ Reviews)
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="var(--primary)" /> Top Colorist Studio 2025
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#34d399" /> 24-Hour Free Cancellation
          </span>
        </div>
      </section>

      {/* Main Booking Area */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {/* Left Column: Service Menu */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Signature Service Menu</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Click any treatment to load live appointment slots
                </p>
              </div>
              <span className="badge badge-tenant">{services.length} Treatments</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {services.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  isSelected={selectedService?.id === srv.id}
                  onSelect={(s) => setSelectedService(s)}
                  currency={tenant.branding.currency}
                />
              ))}
            </div>

            {/* Salon Policy Accordion */}
            <div className="glass-panel" style={{ marginTop: '24px', padding: '24px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>
                  Grounded Salon Policies & Cancellation Rules
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Appointments cancelled at least 24 hours in advance receive a 100% full refund. A 15-minute grace period applies to all clients. You can test asking the AI assistant in the bottom right corner—it is strictly grounded to these documents with zero hallucinations.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Slot Booking Form */}
          <div>
            <BookingForm tenantId={tenant.id} selectedService={selectedService} />
          </div>
        </div>
      </div>

      {/* Embeddable Chat Widget specifically loaded for Tenant Salon */}
      <BizChatWidget
        tenantSlug="salon"
        presetQuestions={[
          'What is your cancellation policy?',
          'Book a Signature Haircut for tomorrow',
          'How do I care for my Keratin treatment?',
          'Do I need to wash my hair before color?',
        ]}
      />
    </div>
  );
}
