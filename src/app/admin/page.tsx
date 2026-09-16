'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calendar,
  TrendingUp,
  Users,
  ShieldAlert,
  Scissors,
  ShoppingBag,
  Database,
  ExternalLink,
  Layers,
  LogOut,
} from 'lucide-react';
import { DEMO_TENANTS, getAllTenants, TenantConfig } from '@/lib/config/tenants';
import { DbBooking, DbService } from '@/lib/supabase/mockDb';
import BookingsCalendar from '@/components/admin/BookingsCalendar';
import RevenueSummary from '@/components/admin/RevenueSummary';
import CustomerList from '@/components/admin/CustomerList';
import SecurityAuditTab from '@/components/admin/SecurityAuditTab';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTenantSlug = searchParams.get('tenant') || 'salon';

  const [activeTenantSlug, setActiveTenantSlug] = useState<string>(initialTenantSlug);
  const [activeTab, setActiveTab] = useState<'calendar' | 'revenue' | 'customers' | 'security'>('calendar');

  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);

  const currentTenant: TenantConfig = DEMO_TENANTS[activeTenantSlug] || DEMO_TENANTS.salon;
  const tenants = getAllTenants();

  const handleTenantChange = (slug: string) => {
    setActiveTenantSlug(slug);
    router.replace(`/admin?tenant=${slug}`);
  };

  // Fetch tenant bookings & services
  useEffect(() => {
    async function loadTenantData() {
      setLoading(true);
      try {
        const [bookingsRes, servicesRes] = await Promise.all([
          fetch(`/api/bookings?tenant_id=${currentTenant.id}`),
          fetch(`/api/audit?tenant_id=${currentTenant.id}`), // health check
        ]);

        const bData = await bookingsRes.json();
        if (bData.bookings) setBookings(bData.bookings);

        // Fetch services
        const availRes = await fetch(`/api/bookings/availability?tenant_id=${currentTenant.id}`);
        // Default local services if needed
        const { mockDb } = await import('@/lib/supabase/mockDb');
        setServices(mockDb.getServices(currentTenant.id));
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTenantData();
  }, [currentTenant.id]);

  const tabs = [
    { id: 'calendar', label: 'Calendar & Bookings', icon: Calendar, badge: bookings.length },
    { id: 'revenue', label: 'Revenue Summary', icon: TrendingUp },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'security', label: 'SOC Security & Isolation', icon: ShieldAlert, highlight: true },
  ];

  return (
    <div data-tenant={activeTenantSlug} style={{ minHeight: 'calc(100vh - 68px)', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Header & Tenant Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-tenant">MULTI-TENANT UNIFIED ADMIN</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Tenant ID: {currentTenant.id.slice(0, 13)}...
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {currentTenant.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {currentTenant.branding.tagline}
            </p>
          </div>

          {/* Tenant Switcher Pill Group */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              padding: '6px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, padding: '0 8px', textTransform: 'uppercase' }}>
              Switch Demo:
            </span>
            {tenants.map((t) => {
              const isSelected = t.slug === activeTenantSlug;
              return (
                <button
                  key={t.slug}
                  onClick={() => handleTenantChange(t.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: isSelected ? t.branding.primaryColor : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {t.slug === 'salon' && <Scissors size={14} />}
                  {t.slug === 'store' && <ShoppingBag size={14} />}
                  {t.slug === 'ops' && <ShieldAlert size={14} />}
                  <span>{t.branding.brandName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '28px',
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? '#ffffff' : tab.highlight ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: isActive ? `2px solid var(--primary)` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && (
                  <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                    SOC Mode
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === 'calendar' && (
            <BookingsCalendar bookings={bookings} currency={currentTenant.branding.currency} />
          )}

          {activeTab === 'revenue' && (
            <RevenueSummary
              bookings={bookings}
              services={services}
              currency={currentTenant.branding.currency}
              tenantSlug={activeTenantSlug}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerList
              bookings={bookings}
              services={services}
              currency={currentTenant.branding.currency}
            />
          )}

          {activeTab === 'security' && (
            <SecurityAuditTab tenantId={currentTenant.id} tenantSlug={activeTenantSlug} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Admin Portal...</div>}>
      <AdminDashboardContent />
    </React.Suspense>
  );
}
