'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scissors,
  ShoppingBag,
  ShieldAlert,
  Database,
  Sparkles,
  Lock,
  ArrowRight,
  Zap,
  Server,
  Layers,
  Cpu,
  CheckCircle2,
  Code2,
  Terminal,
  Activity,
  Check,
  Shield,
} from 'lucide-react';
import TryItLiveModal from '@/components/chat/TryItLiveModal';

export default function HomePage() {
  const [isLiveDemoOpen, setIsLiveDemoOpen] = useState(false);
  const [activeArchTab, setActiveArchTab] = useState<'rls' | 'rag' | 'action' | 'infra'>('rls');

  const verticals = [
    {
      title: 'Glamour Haven Salon',
      slug: 'salon',
      vertical: 'Salon & Spa Appointments',
      icon: Scissors,
      accentColor: '#f43f5e',
      tagline: 'Booking module front-and-center with real-time slot conflict prevention.',
      highlights: [
        'Interactive Time Slot Calendar',
        'Service Catalog CRUD with Durations',
        'Conversational Booking Action Agent',
        'Haircare Aftercare RAG Knowledge Base',
      ],
      link: '/salon',
    },
    {
      title: 'Apex Gear Tech Store',
      slug: 'store',
      vertical: 'E-Commerce Shopping Assistant',
      icon: ShoppingBag,
      accentColor: '#10b981',
      tagline: 'High-tech audio & mechanical keyboards with zero-hallucination shopping assistant.',
      highlights: [
        'Interactive Hardware Product Catalog',
        'Strict RAG Context Grounding',
        'Shipping & 30-Day Guarantee FAQ',
        '2-Year Hardware Warranty Grounding',
      ],
      link: '/store',
    },
    {
      title: 'CloudPulse SaaS Ops & SOC',
      slug: 'ops',
      vertical: 'Internal Platform SOC & RLS',
      icon: ShieldAlert,
      accentColor: '#6366f1',
      tagline: 'BizOS internal platform telemetry proving tenant isolation and audit logging.',
      highlights: [
        'Live Cluster Telemetry & Latency',
        'Active Data Isolation Verification (RLS)',
        'Immutable Audit Trail Stream',
        '1-Click GDPR Data Portability & Erasure',
      ],
      link: '/ops',
    },
    {
      title: 'Sentinel Mini SOC',
      slug: 'minisoc',
      vertical: 'PROJECT 4 • SMB CYBERSECURITY',
      icon: Shield,
      accentColor: '#06b6d4',
      tagline: 'Autonomous AI log monitoring, MITRE ATT&CK triage, and SOC 2 compliance auditor for SMBs.',
      highlights: [
        '3 Attack Simulations (Tor Spray, Scanner, IAM)',
        'Autonomous Noise Filtering (-98% Tokens)',
        'MITRE ATT&CK Correlation & Blast Radius',
        '1-Click SOC 2 & Investor Security Memo',
      ],
      link: '/minisoc',
      isProject4: true,
    },
  ];

  const archTabs = {
    rls: {
      title: 'PostgreSQL Row Level Security (RLS)',
      badge: 'Database Kernel Level',
      description:
        'Every query is structurally scoped by tenant_id. Even if an API route forgets to filter by tenant, PostgreSQL kernel policies refuse to return foreign data.',
      code: `-- Enforced at Postgres Kernel Level
CREATE POLICY "Tenant admin isolated access" 
ON bookings FOR ALL 
USING (tenant_id = current_tenant_id());`,
    },
    rag: {
      title: '768-Dim Gemini pgvector RAG',
      badge: 'Zero Hallucination',
      description:
        'Documents are sanitized and embedded into 768-dimensional vectors using Gemini text-embedding-004. Queries execute match_tenant_documents with strict tenant boundary filtering.',
      code: `-- Isolated pgvector search function
SELECT title, content, 1 - (embedding <=> query_vec) AS similarity
FROM documents 
WHERE tenant_id = filter_tenant_id
ORDER BY embedding <=> query_vec LIMIT 3;`,
    },
    action: {
      title: 'Agent Action Layer (Function Calling)',
      badge: 'Real Transactions',
      description:
        'The conversational AI does not just output text—it detects booking intent, validates parameters, and executes real database transactions through tool calls.',
      code: `// Agent Action Tool Schema
const BOOKING_TOOL = {
  name: 'create_booking',
  parameters: { service_name, customer_name, customer_email, datetime }
};`,
    },
    infra: {
      title: '100% Free-Tier Architecture',
      badge: 'Zero Paid Infra',
      description:
        'Engineered to run entirely inside free serverless limits: Vercel serverless (<10s), Supabase free tier (Postgres + pgvector + Auth), and Groq ultra-fast free tier.',
      code: `Vercel Serverless (API Routes) + Supabase (pgvector)
+ Groq API (Llama 3.3 70B) + Gemini (Embedding-004)`,
    },
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '80px 20px 60px',
          textAlign: 'center',
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Glow pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <span className="badge badge-tenant" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
            <span className="status-dot status-dot-pulse" style={{ backgroundColor: 'var(--accent)' }} />
            ONE SHARED BACKEND • 3 RADICALLY DIFFERENT VERTICALS
          </span>
          <span className="badge badge-success" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
            100% FREE TIER STACK
          </span>
        </div>

        <h1
          style={{
            fontSize: '3.8rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Architected for Scale. <br />
          <span className="gradient-text">Zero Hallucination. Zero Paid Infra.</span>
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '760px',
            margin: '0 auto 40px',
            lineHeight: '1.65',
          }}
        >
          BizOS proves that a single Next.js and Supabase pgvector backend can power a luxury hair salon booking engine, an e-commerce shopping agent, and an enterprise SOC telemetry console with strict database-level data isolation.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            href="/admin?tenant=ops"
            className="btn btn-primary"
            style={{
              padding: '14px 28px',
              fontSize: '0.98rem',
              borderRadius: '12px',
            }}
          >
            <Database size={18} />
            <span>Launch Admin & SOC Console</span>
            <ArrowRight size={16} />
          </Link>

          <button
            onClick={() => setIsLiveDemoOpen(true)}
            className="btn btn-secondary"
            style={{
              padding: '14px 26px',
              fontSize: '0.98rem',
              borderRadius: '12px',
            }}
          >
            <Sparkles size={18} color="var(--primary)" />
            <span>Try RAG Live on Custom Doc (30s)</span>
          </button>
        </div>

        {/* Floating tech badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '44px',
            flexWrap: 'wrap',
            color: 'var(--text-dim)',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          <span>⚡ Next.js 14 App Router</span>
          <span>•</span>
          <span>🛡️ Supabase PostgreSQL RLS</span>
          <span>•</span>
          <span>🧠 768-Dim Gemini pgvector</span>
          <span>•</span>
          <span>🚀 Groq Llama 3.3 70B</span>
          <span>•</span>
          <span>🔒 Persistent Rate Limiter</span>
        </div>
      </section>

      {/* 4 Live Demo Projects Showcase Cards */}
      <section style={{ maxWidth: '1320px', margin: '0 auto 90px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span className="badge badge-tenant" style={{ marginBottom: '10px' }}>
            PORTFOLIO SHOWCASE
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore the 4 Production AI Projects</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '6px' }}>
            Click into any demo below to experience the glassmorphic styling, RAG grounding, and autonomous multi-agent SOC triage.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
          {verticals.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.slug}
                className="glass-panel"
                style={{
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '20px',
                }}
              >
                {/* Glowing accent border top */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: v.accentColor,
                    boxShadow: `0 0 20px ${v.accentColor}`,
                  }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        backgroundColor: `${v.accentColor}22`,
                        color: v.accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 20px -3px ${v.accentColor}55`,
                        border: `1px solid ${v.accentColor}44`,
                      }}
                    >
                      <Icon size={26} />
                    </div>

                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: '12px',
                        backgroundColor: `${v.accentColor}18`,
                        color: v.accentColor,
                        border: `1px solid ${v.accentColor}44`,
                      }}
                    >
                      {v.vertical}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '10px' }}>{v.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                    {v.tagline}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                    {v.highlights.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: `${v.accentColor}25`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={12} color={v.accentColor} />
                        </div>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    href={v.link}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      backgroundColor: v.accentColor,
                      borderColor: v.accentColor,
                      padding: '12px',
                    }}
                  >
                    <span>Launch {v.title.split(' ')[0]} Demo</span>
                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    href={`/admin?tenant=${v.slug}`}
                    className="btn btn-secondary"
                    style={{ padding: '12px 16px' }}
                    title="View tenant in Admin Console"
                  >
                    <Database size={17} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Architecture Breakdown Tabs */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div className="glass-panel-glow" style={{ padding: '36px', backgroundColor: '#090e1a' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge badge-tenant" style={{ marginBottom: '8px' }}>
              TECHNICAL BLUEPRINT
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>How BizOS Solves Multi-Tenancy on Free Tier</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
              Click each layer to view the real database schemas, vector indexing, and action execution code.
            </p>
          </div>

          {/* Layer Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              padding: '6px',
              borderRadius: '12px',
              marginBottom: '24px',
              overflowX: 'auto',
            }}
          >
            {(Object.keys(archTabs) as (keyof typeof archTabs)[]).map((tabKey) => {
              const tab = archTabs[tabKey];
              const isSelected = activeArchTab === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveArchTab(tabKey)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>

          {/* Active Layer Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{archTabs[activeArchTab].title}</h3>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  {archTabs[activeArchTab].badge}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
                {archTabs[activeArchTab].description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#34d399' }}>
                <CheckCircle2 size={16} />
                <span>Verified in production: zero cross-tenant leakage guaranteed.</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: '#e2e8f0',
                overflowX: 'auto',
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                <code>{archTabs[activeArchTab].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Live Try It Modal */}
      {isLiveDemoOpen && <TryItLiveModal onClose={() => setIsLiveDemoOpen(false)} />}
    </div>
  );
}
