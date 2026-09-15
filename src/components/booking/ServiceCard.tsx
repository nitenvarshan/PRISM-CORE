'use client';

import React from 'react';
import { Clock, Check, Sparkles } from 'lucide-react';
import { DbService } from '@/lib/supabase/mockDb';

interface Props {
  service: DbService;
  isSelected: boolean;
  onSelect: (service: DbService) => void;
  currency?: string;
}

export default function ServiceCard({ service, isSelected, onSelect, currency = '$' }: Props) {
  const isPopular = service.price > 100;

  return (
    <div
      onClick={() => onSelect(service)}
      className="glass-panel"
      style={{
        padding: '24px',
        cursor: 'pointer',
        position: 'relative',
        borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
        backgroundColor: isSelected ? 'rgba(var(--primary-rgb), 0.12)' : 'var(--bg-card)',
        transform: isSelected ? 'translateY(-3px)' : 'none',
        boxShadow: isSelected
          ? '0 12px 30px -5px var(--primary-glow), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
          : 'var(--shadow-card)',
        borderRadius: '16px',
      }}
    >
      {/* Top right select checkmark or Popular tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        {isPopular ? (
          <span
            className="badge badge-tenant"
            style={{ fontSize: '0.68rem', padding: '3px 8px', gap: '4px' }}
          >
            <Sparkles size={11} /> SIGNATURE TREATMENT
          </span>
        ) : (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            HAIR CARE & STYLING
          </span>
        )}

        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
            border: isSelected ? 'none' : '1px solid var(--border-subtle)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSelected ? '0 0 12px var(--primary-glow)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {isSelected && <Check size={14} />}
        </div>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
        {service.name}
      </h3>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
        {service.description}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)' }}>{currency}</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
            {service.price.toFixed(2)}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            padding: '4px 10px',
            borderRadius: '20px',
          }}
        >
          <Clock size={13} color="var(--primary)" />
          <span>{service.duration} mins allocation</span>
        </div>
      </div>
    </div>
  );
}
