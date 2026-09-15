'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Wrench,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { SecurityIncident, SeverityLevel } from '@/lib/minisoc/types';

interface IncidentTriageViewProps {
  incidents: SecurityIncident[];
  onTriggerRemediation: (incident: SecurityIncident, actionType: string) => void;
}

export default function IncidentTriageView({
  incidents,
  onTriggerRemediation,
}: IncidentTriageViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    incidents.length > 0 ? incidents[0].id : null
  );
  const [copiedPatchId, setCopiedPatchId] = useState<string | null>(null);

  const handleCopyPatch = (id: string, patchText: string) => {
    navigator.clipboard.writeText(patchText);
    setCopiedPatchId(id);
    setTimeout(() => setCopiedPatchId(null), 2000);
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'critical':
        return {
          icon: AlertOctagon,
          bg: 'bg-rose-500/15',
          text: 'text-rose-400',
          border: 'border-rose-500/40',
          glow: 'shadow-[0_0_15px_rgba(244,63,94,0.35)]',
        };
      case 'high':
        return {
          icon: AlertTriangle,
          bg: 'bg-orange-500/15',
          text: 'text-orange-400',
          border: 'border-orange-500/40',
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.35)]',
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-500/15',
          text: 'text-amber-400',
          border: 'border-amber-500/40',
          glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
        };
      default:
        return {
          icon: Info,
          bg: 'bg-blue-500/15',
          text: 'text-blue-400',
          border: 'border-blue-500/40',
          glow: '',
        };
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">No Active Threats Detected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Current telemetry logs show normal baseline patterns. Trigger an attack simulation from the top switcher to observe autonomous threat response.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Autonomous Incident Investigation & MITRE ATT&CK Matrix
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {incidents.length} active incident{incidents.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {incidents.map((incident) => {
          const isExpanded = expandedId === incident.id;
          const sevStyle = getSeverityBadge(incident.severity);
          const SevIcon = sevStyle.icon;

          return (
            <div
              key={incident.id}
              className={`rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900/80 border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : incident.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${sevStyle.bg} ${sevStyle.text} border ${sevStyle.border} ${sevStyle.glow} flex-shrink-0`}
                  >
                    <SevIcon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full border ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
                      >
                        {incident.severity}
                      </span>
                      <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                        {incident.mitre_technique_id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Confidence: {(incident.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1 hover:text-cyan-300 transition-colors">
                      {incident.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs text-slate-400 font-mono hidden md:inline">
                    {incident.mitre_tactic}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Collapsible Details Panel */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-white/10 space-y-4">
                  {/* Executive Summary for Founders */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                    <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-cyan-400 block mb-1">
                      Executive Founder Briefing
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {incident.executive_summary}
                    </p>
                  </div>

                  {/* Two Column Grid: Forensic Analysis & Blast Radius */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                        Forensic Technical Breakdown
                      </span>
                      <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                        {incident.technical_analysis}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[11px] font-mono text-rose-400 font-bold uppercase">
                        Identified Blast Radius
                      </span>
                      <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                        {incident.blast_radius}
                      </p>
                    </div>
                  </div>

                  {/* Remediation Playbook */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                          Automated Remediation Playbook
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        15-min mitigation window
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-slate-400 font-medium block text-[11px]">Immediate Action:</span>
                        <p className="text-slate-200 mt-0.5 font-medium">
                          {incident.recommended_action.immediate}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-slate-400 font-medium block text-[11px]">Permanent Hardening:</span>
                        <p className="text-slate-200 mt-0.5 font-medium">
                          {incident.recommended_action.permanent}
                        </p>
                      </div>
                    </div>

                    {/* Generated Configuration / Code Snippet */}
                    {incident.recommended_action.config_patch && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1">
                          <span>Generated {incident.recommended_action.patch_type?.toUpperCase()} Policy:</span>
                          <button
                            onClick={() =>
                              handleCopyPatch(incident.id, incident.recommended_action.config_patch!)
                            }
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            {copiedPatchId === incident.id ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <Copy size={12} />
                            )}
                            <span>{copiedPatchId === incident.id ? 'Copied' : 'Copy Snippet'}</span>
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                          {incident.recommended_action.config_patch}
                        </pre>
                      </div>
                    )}

                    {/* Action Execution Button */}
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                      <button
                        onClick={() => onTriggerRemediation(incident, 'block_ip')}
                        className="btn btn-secondary text-xs px-3.5 py-1.5"
                      >
                        Quarantine Source IP
                      </button>

                      <button
                        onClick={() => onTriggerRemediation(incident, 'revoke_session')}
                        className="btn btn-secondary text-xs px-3.5 py-1.5"
                      >
                        Revoke Active Tokens
                      </button>

                      <button
                        onClick={() => onTriggerRemediation(incident, 'apply_waf')}
                        className="btn btn-primary text-xs px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 border-none shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      >
                        <Zap size={13} />
                        <span>Deploy Edge Protection Rule</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
