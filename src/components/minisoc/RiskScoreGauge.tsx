'use client';

import React from 'react';
import {
  ShieldAlert,
  Zap,
  Filter,
  Flame,
  Play,
  UploadCloud,
} from 'lucide-react';
import { ExecutiveReport } from '@/lib/minisoc/types';
import { ATTACK_SCENARIOS } from '@/lib/minisoc/scenarios';

interface RiskScoreGaugeProps {
  report: ExecutiveReport;
  currentScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onOpenUploadModal: () => void;
  isAnalyzing: boolean;
}

export default function RiskScoreGauge({
  report,
  currentScenarioId,
  onSelectScenario,
  onOpenUploadModal,
  isAnalyzing,
}: RiskScoreGaugeProps) {
  const { risk_score, risk_status, noise_reduction_pct, total_events, incidents_created } = report;

  // Derive visual colors based on risk_score
  const getStatusColor = (score: number) => {
    if (score >= 75) return { text: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/10', glow: 'rgba(244,63,94,0.3)' };
    if (score >= 40) return { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10', glow: 'rgba(245,158,11,0.3)' };
    return { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', glow: 'rgba(16,185,129,0.3)' };
  };

  const statusStyle = getStatusColor(risk_score);

  return (
    <div className="space-y-6">
      {/* Top Threat Simulation Switcher Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400">
                Interactive Attack Simulation Engine
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Trigger real-world attack vectors or upload raw logs to test multi-agent triage & SOC 2 gap analysis.
            </p>
          </div>

          {/* Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {Object.values(ATTACK_SCENARIOS).map((scenario) => {
              const isSelected = currentScenarioId === scenario.id;
              return (
                <button
                  key={scenario.id}
                  disabled={isAnalyzing}
                  onClick={() => onSelectScenario(scenario.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/40'
                      : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/10'
                  }`}
                >
                  <Play size={11} className={isSelected ? 'fill-white' : ''} />
                  <span>{scenario.title.split('&')[0].trim()}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono font-bold ${
                      scenario.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {scenario.severity}
                  </span>
                </button>
              );
            })}

            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            >
              <UploadCloud size={13} className="text-cyan-400" />
              <span>Paste / Upload Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Metrics Strip: 4 Glassmorphic HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Dynamic Risk Score Gauge */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Composite Risk Score
            </span>
            <div className={`p-1.5 rounded-lg ${statusStyle.bg} border ${statusStyle.border}`}>
              <Flame className={`w-4 h-4 ${statusStyle.text}`} />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className={`text-4xl font-extrabold tracking-tight ${statusStyle.text} font-mono`}>
              {risk_score}
            </span>
            <span className="text-sm text-slate-400 font-mono">/ 100</span>
            <span
              className={`ml-auto text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
            >
              {risk_status}
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                risk_score >= 75
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : risk_score >= 40
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${risk_score}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Computed via Bayesian threat severity & control exposure.
          </p>
        </div>

        {/* 2. Log Noise Filter Ratio */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Noise Reduction
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Filter className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {noise_reduction_pct}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">dropped</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Agent 1 discarded routine 200 OKs, saving <span className="text-cyan-300 font-mono">95%+</span> in LLM token consumption.
          </p>
        </div>

        {/* 3. Incidents Triaged */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Active Incidents
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {incidents_created}
            </span>
            <span className="text-xs text-rose-400 font-medium">requiring review</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Correlated with MITRE ATT&CK techniques with verified blast radius.
          </p>
        </div>

        {/* 4. Total Events Processed */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Telemetry Velocity
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {total_events}
            </span>
            <span className="text-xs text-slate-400 font-medium">events in window</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Multi-source ingestion: Auth, Edge Nginx, and CloudTrail streams.
          </p>
        </div>
      </div>
    </div>
  );
}
