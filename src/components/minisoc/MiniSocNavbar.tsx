'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Radio, Cpu, Sparkles, Terminal, Activity, FileText } from 'lucide-react';

interface MiniSocNavbarProps {
  activeTab: 'overview' | 'terminal' | 'incidents' | 'compliance';
  onTabChange: (tab: 'overview' | 'terminal' | 'incidents' | 'compliance') => void;
  incidentCount: number;
  engineUsed: string;
}

export default function MiniSocNavbar({
  activeTab,
  onTabChange,
  incidentCount,
  engineUsed,
}: MiniSocNavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all hover:bg-white/10"
          >
            <ArrowLeft size={13} />
            <span>Showcase</span>
          </Link>

          <div className="h-4 w-px bg-white/15" />

          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              <Shield className="w-4 h-4 text-cyan-300" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                  Sentinel <span className="text-cyan-400 font-extrabold">Mini SOC</span>
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  PROJECT 4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                AI Threat Triage & GRC-Lite Compliance for SMBs
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-white/10">
          <button
            onClick={() => onTabChange('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Activity size={13} />
            <span>Overview & Risk</span>
          </button>

          <button
            onClick={() => onTabChange('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'terminal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Terminal size={13} />
            <span>Ingestion Terminal</span>
          </button>

          <button
            onClick={() => onTabChange('incidents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'incidents'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Shield size={13} />
            <span>Threat Incidents</span>
            {incidentCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                {incidentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('compliance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'compliance'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FileText size={13} />
            <span>SOC 2 & GRC</span>
          </button>
        </nav>

        {/* Live Engine Status Pill */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-400">Stream:</span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">Active</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px] font-mono truncate max-w-[140px] sm:max-w-[180px]">
              {engineUsed.includes('Groq') ? 'Groq Llama-3.3' : 'Autonomous Engine'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
