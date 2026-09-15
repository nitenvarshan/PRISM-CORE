'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Scissors, ShoppingBag, ShieldAlert, LayoutDashboard, Database, Zap, Shield } from 'lucide-react';
import TryItLiveModal from '../chat/TryItLiveModal';

export default function DemoNavbar() {
  const pathname = usePathname();
  const [isLiveDemoOpen, setIsLiveDemoOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Showcase Hub', icon: LayoutDashboard },
    { href: '/salon', label: 'Salon', icon: Scissors, badge: 'Booking' },
    { href: '/store', label: 'Store', icon: ShoppingBag, badge: 'Shopping RAG' },
    { href: '/ops', label: 'Ops', icon: ShieldAlert, badge: 'Telemetry' },
    { href: '/minisoc', label: 'Mini SOC', icon: Shield, badge: 'Project 4' },
    { href: '/admin', label: 'Admin & SOC', icon: Database, badge: 'RLS & Audit' },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(7, 9, 14, 0.72)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '0 24px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Identity */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px -4px var(--primary-glow), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Zap size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Biz<span style={{ color: 'var(--primary)' }}>OS</span>
                </span>
                <span
                  className="badge badge-tenant"
                  style={{
                    fontSize: '0.68rem',
                    padding: '3px 8px',
                    gap: '5px',
                  }}
                >
                  <span
                    className="status-dot status-dot-pulse"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                  1 BACKEND • 3 DEMOS
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Postgres RLS • pgvector RAG • Free Tier
              </p>
            </div>
          </Link>

          {/* Navigation Pill Group */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(16px)',
              padding: '4px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              gap: '4px',
            }}
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.16)'
                      : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 15px rgba(0,0,0,0.3)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <Icon size={15} color={isActive ? 'var(--primary)' : 'currentColor'} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: isActive
                          ? 'rgba(var(--primary-rgb), 0.25)'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                        fontWeight: 700,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button: Try Live Doc QA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsLiveDemoOpen(true)}
              className="btn btn-primary"
              style={{
                padding: '9px 18px',
                fontSize: '0.86rem',
                borderRadius: '10px',
                boxShadow: '0 0 25px -4px var(--primary-glow)',
              }}
            >
              <Sparkles size={16} />
              <span>Try RAG Live (30s)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Try It Live Modal */}
      {isLiveDemoOpen && <TryItLiveModal onClose={() => setIsLiveDemoOpen(false)} />}
    </>
  );
}
