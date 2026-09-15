'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Server,
  Activity,
  Lock,
  ArrowUpRight,
  CheckCircle2,
  Terminal,
  Zap,
  Radio,
  Cpu,
  Shield,
} from 'lucide-react';
import { DEMO_TENANTS } from '@/lib/config/tenants';
import { mockDb } from '@/lib/supabase/mockDb';
import BizChatWidget from '@/components/chat/BizChatWidget';

export default function OpsDemoPage() {
  const tenant = DEMO_TENANTS.ops;
  const services = mockDb.getServices(tenant.id);

  return (
    <div data-tenant="ops" style={{ minHeight: 'calc(100vh - 72px)', paddingBottom: '120px' }}>
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
            DEMO VERTICAL C: SAAS OPS & SOC
          </span>
          <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
            SOC Monitoring & Internal Runbook Agent
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
          Autonomous Cloud Telemetry & <br />
          <span className="tenant-gradient-text">SOC Threat Hunting Command Center</span>
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
          Internal operations console demonstrating autonomous multi-tenant isolation, real-time SLA verification, and AI runbook triage.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link
            href="/admin?tenant=ops"
            className="btn btn-primary"
            style={{ padding: '13px 26px', borderRadius: '12px' }}
          >
            <Lock size={17} />
            <span>Launch SOC Threat Hunting Console</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      {/* Real-Time Telemetry Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                API Latency (p99)
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <Activity size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>14.2 ms</div>
            <span style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span className="status-dot status-dot-pulse" style={{ backgroundColor: '#34d399' }} />
              Serverless Edge Optimum
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Postgres RLS Integrity
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                <Lock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>100% SECURE</div>
            <span style={{ fontSize: '0.78rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span className="status-dot status-dot-pulse" style={{ backgroundColor: '#818cf8' }} />
              0 cross-tenant leaks detected
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                pgvector Vector Store
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fda4af' }}>
                <Zap size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>768-DIM</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Gemini text-embedding-004 indexed
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Incident Response SLA
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                <Radio size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>&lt; 5 mins</div>
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '4px', display: 'block' }}>
              Sev 1 Automated Paging Active
            </span>
          </div>
        </div>

        {/* Retainers & Audit Sprints */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Security Audits & Enterprise Retainers</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Infrastructure hardening, IAM least-privilege analysis, and automated SOC 2 evidence collection
              </p>
            </div>
            <span className="badge badge-tenant">3 Enterprise Sprints</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {services.map((srv) => (
              <div
                key={srv.id}
                className="glass-panel"
                style={{
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '18px',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Server size={22} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                    {srv.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {srv.description}
                  </p>
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
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
                      ${srv.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                      {srv.duration} mins dedicated
                    </span>
                  </div>

                  <Link
                    href={`/admin?tenant=ops`}
                    className="btn btn-outline-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '0.88rem', borderRadius: '10px' }}
                  >
                    <span>View Telemetry Audit Log</span>
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live SOC Runbook Sample Card */}
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            borderLeft: '4px solid #818cf8',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(15, 23, 42, 0.8))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Terminal size={20} color="#818cf8" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Active SOC Runbook: Failover & SLA Escalation</h4>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.65' }}>
            When a Sev 1 incident triggers, CloudPulse autonomous telemetry pages the on-call engineer within 5 minutes, auto-retrieves cluster topology from the pgvector knowledge base, and executes automated multi-region DNS failover within 60 seconds. Test this protocol live in the chat assistant below!
          </p>
        </div>

        {/* Project 4 Cross-Link Callout Banner */}
        <div
          className="glass-panel"
          style={{
            marginTop: '24px',
            padding: '24px 28px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(15, 23, 42, 0.85))',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
                flexShrink: 0,
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Standalone Commercial Product • Project 4
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                Looking for Client-Facing Threat Monitoring?
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                While this page monitors BizOS internal infra, <strong>Sentinel Mini SOC</strong> ingests and triages your clients&apos; external server &amp; cloud logs.
              </p>
            </div>
          </div>

          <Link
            href="/minisoc"
            className="btn btn-primary"
            style={{
              padding: '11px 22px',
              fontSize: '0.88rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
              border: 'none',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)',
            }}
          >
            <span>Explore Sentinel Mini SOC</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Embeddable Ops Agent */}
      <BizChatWidget
        tenantSlug="ops"
        presetQuestions={[
          'What is the Sev 1 incident response SLA?',
          'How does database isolation work in BizOS?',
          'What is the automated cluster failover procedure?',
          'Book a Cloud Infrastructure Health Audit',
        ]}
      />
    </div>
  );
}
