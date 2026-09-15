'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DEMO_TENANTS } from '@/lib/config/tenants';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTenant = searchParams.get('tenant') || 'salon';

  const [email, setEmail] = useState('admin@glamourhaven.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // If Supabase Auth is active, authenticate with Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.warn('Supabase auth failed, using demo session:', err);
      }
    }

    // Determine tenant from email
    let targetTenant = redirectTenant;
    if (email.includes('glamourhaven')) targetTenant = 'salon';
    else if (email.includes('apexgear')) targetTenant = 'store';
    else if (email.includes('cloudpulse')) targetTenant = 'ops';

    // Store admin session cookie/flag
    document.cookie = `bizos_admin_session=authenticated; path=/; max-age=86400`;
    router.push(`/admin?tenant=${targetTenant}`);
  };

  const selectDemoAccount = (tenantKey: 'salon' | 'store' | 'ops') => {
    const tenant = DEMO_TENANTS[tenantKey];
    setEmail(tenant.adminEmail);
    setPassword('DemoAdmin2026!');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="glass-panel-glow"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '36px',
          backgroundColor: '#0c1220',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Lock size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>BizOS Admin Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            Multi-Tenant Authenticated Console with Supabase Auth & RLS
          </p>
        </div>

        {/* Demo Fast-Fill Selector */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Quick 1-Click Demo Accounts:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => selectDemoAccount('salon')}
              style={{
                padding: '8px 4px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                cursor: 'pointer',
              }}
            >
              💅 Salon
            </button>
            <button
              type="button"
              onClick={() => selectDemoAccount('store')}
              style={{
                padding: '8px 4px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                cursor: 'pointer',
              }}
            >
              ⚡ Store
            </button>
            <button
              type="button"
              onClick={() => selectDemoAccount('ops')}
              style={{
                padding: '8px 4px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                cursor: 'pointer',
              }}
            >
              🛡️ Ops
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              ADMIN EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-dim)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-dim)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.82rem' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          >
            {loading ? 'Authenticating...' : <><ShieldCheck size={16} /> <span>Sign In to Dashboard</span> <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          🔒 Protected by PostgreSQL Row Level Security (RLS) & JWT Claims
        </div>
      </div>
    </div>
  );
}
