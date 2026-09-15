'use client';

import React, { useState } from 'react';
import { ShoppingBag, Truck, ShieldCheck, Cpu, Headphones, Mic, CheckCircle2, Star, Zap } from 'lucide-react';
import { DEMO_TENANTS } from '@/lib/config/tenants';
import { mockDb } from '@/lib/supabase/mockDb';
import BizChatWidget from '@/components/chat/BizChatWidget';

export default function StoreDemoPage() {
  const tenant = DEMO_TENANTS.store;
  const products = mockDb.getServices(tenant.id);
  const [orderModal, setOrderModal] = useState<string | null>(null);

  const productSpecs: Record<string, string[]> = {
    'UltraMech Pro Mechanical Keyboard': ['Hot-Swap MX 5-Pin', 'CNC Anodized Aluminum', 'Gasket Mount Damping'],
    'Quantum ANC Studio Headset': ['40mm Planar Magnetic', 'Hybrid Active Noise Cancelling', '50h Battery Life'],
    'Apex Studio Cardioid Microphone': ['192kHz/24bit Broadcast', 'Integrated Shock Mount', 'Internal Hardware DSP'],
    'Hardware Customization Consultation': ['1-on-1 Virtual Session', 'Custom Sound Signature', 'Switch Lubing Guide'],
  };

  return (
    <div data-tenant="store" style={{ minHeight: 'calc(100vh - 72px)', paddingBottom: '120px' }}>
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
            DEMO VERTICAL B: E-COMMERCE
          </span>
          <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
            RAG Shopping Assistant Front & Center
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
          Precision Engineering. <br />
          <span className="tenant-gradient-text">Studio-Grade Audio & Desk Peripherals</span>
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 36px',
            lineHeight: '1.65',
          }}
        >
          Acoustically dampened mechanical keyboards and planar magnetic studio monitoring gear. Ask our AI shopping assistant in the bottom right corner about switch types, shipping, or warranty terms.
        </p>

        {/* 3 Core Guarantees */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            marginTop: '36px',
          }}
        >
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Free Express Shipping</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                On domestic orders over $99 (2-4 business days)
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>30-Day Money Back</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                100% full refund in original packaging
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>2-Year Comprehensive Warranty</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Covers switches, drivers & battery degradation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <div style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Flagship Hardware & Custom Gear</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Ask the shopping assistant in the bottom right corner for switch comparisons or warranty terms!
            </p>
          </div>
          <span className="badge badge-tenant">4 Flagships Available</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
          {products.map((item) => {
            const specs = productSpecs[item.name] || ['Flagship Spec', '2-Year Warranty'];
            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '18px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.name.includes('Keyboard') ? <Cpu size={24} /> : item.name.includes('Headset') ? <Headphones size={24} /> : <Mic size={24} />}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>
                      <Star size={13} fill="#fbbf24" /> 4.9 (120+ reviews)
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '18px' }}>
                    {item.description}
                  </p>

                  {/* Spec Sheet Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {specs.map((spec, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          color: '#cbd5e1',
                          fontWeight: 500,
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      IN STOCK • READY TO SHIP
                    </span>
                  </div>

                  <button
                    onClick={() => setOrderModal(item.name)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '0.9rem', borderRadius: '10px' }}
                  >
                    <ShoppingBag size={16} />
                    <span>{item.duration > 1 ? 'Book Consultation' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Confirmation Toast */}
      {orderModal && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 80,
            padding: '16px 24px',
            borderRadius: '14px',
            backgroundColor: '#0c1424',
            border: '1px solid #10b981',
            boxShadow: '0 15px 40px -5px rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            color: '#ffffff',
            fontSize: '0.92rem',
          }}
        >
          <CheckCircle2 size={22} color="#34d399" />
          <span>
            Added <strong>{orderModal}</strong> to cart. Ask the AI assistant in the bottom right to review return policies!
          </span>
          <button
            onClick={() => setOrderModal(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', marginLeft: '8px', fontSize: '1.1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Chat Widget tailored for Apex Gear */}
      <BizChatWidget
        tenantSlug="store"
        presetQuestions={[
          'What is your return & money-back policy?',
          'How much is international shipping?',
          'What does the 2-year warranty cover?',
          'Do UltraMech keyboards support hot-swap switches?',
        ]}
      />
    </div>
  );
}
