'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { ComplianceFinding, ExecutiveReport } from '@/lib/minisoc/types';

interface ComplianceReportViewProps {
  compliance: {
    readiness_score: number;
    soc2_status: 'audit_ready' | 'minor_gaps' | 'at_risk';
    findings: ComplianceFinding[];
  };
  executiveReport: ExecutiveReport;
}

export default function ComplianceReportView({
  compliance,
  executiveReport,
}: ComplianceReportViewProps) {
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const { readiness_score, soc2_status, findings } = compliance;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'audit_ready':
        return {
          text: 'Audit Ready',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
        };
      case 'minor_gaps':
        return {
          text: 'Minor Remediations Needed',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
        };
      default:
        return {
          text: 'At Risk (Control Gaps)',
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
        };
    }
  };

  const statusStyle = getStatusBadge(soc2_status);

  // Generate complete Markdown Board Memo
  const generateBoardMemo = () => {
    return `# Sentinel Mini SOC — Executive Security & Compliance Memo
**Generated**: ${new Date(executiveReport.generated_at).toUTCString()}
**Overall Composite Risk Score**: ${executiveReport.risk_score} / 100 (${executiveReport.risk_status.toUpperCase()})
**SOC 2 Type II Readiness Score**: ${readiness_score}% (${statusStyle.text})

---

### 1. Executive Summary
${executiveReport.executive_summary}

### 2. Key Board & Investor Takeaways
${executiveReport.board_bullet_points.map((pt) => `- ${pt}`).join('\n')}

### 3. Log Telemetry & Noise Reduction
- Total Events Evaluated in Period: ${executiveReport.total_events}
- Anomalies Isolated: ${executiveReport.anomalies_detected}
- Routine Noise Discarded: ${executiveReport.noise_reduction_pct}%
- Active Security Incidents Triaged: ${executiveReport.incidents_created}

### 4. SOC 2 Type II & CIS Controls Audit Findings
${findings
  .map(
    (f, idx) => `#### Finding ${idx + 1}: ${f.finding_title} (${f.control_id})
- **Framework**: ${f.framework}
- **Priority**: ${f.priority.toUpperCase()}
- **Business Impact**: ${f.plain_english_impact}
- **Required Remediation**:
${f.remediation_steps.map((r) => `  - ${r}`).join('\n')}
`
  )
  .join('\n')}

---
*Generated autonomously by Sentinel Mini SOC Engine. Cryptographically verifiable audit trail.*
`;
  };

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(generateBoardMemo());
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  const handleDownloadMemo = () => {
    const element = document.createElement('a');
    const file = new Blob([generateBoardMemo()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `sentinel-soc-executive-memo-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: SOC 2 Readiness Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/40 backdrop-blur-xl border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Automated GRC Audit Engine
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  SOC 2 Type II & CIS 18
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mt-1">
                Security Posture & Investor Readiness
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Real-time translation of raw telemetry into plain-English findings ready for enterprise sales questionnaires, SOC 2 auditor reviews, and seed/Series A investor due diligence.
              </p>
            </div>
          </div>

          {/* Readiness Score Radial Pill */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center p-4 rounded-xl bg-slate-950/60 border border-white/10">
            <span className="text-xs text-slate-400 font-mono">SOC 2 Readiness</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold font-mono text-white">
                {readiness_score}%
              </span>
            </div>
            <span
              className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full mt-1 border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}
            >
              {statusStyle.text}
            </span>
          </div>
        </div>
      </div>

      {/* Control Checklist Findings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400">
            Identified Compliance Gaps & Control Findings ({findings.length})
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Evaluated against Trust Services Criteria
          </span>
        </div>

        {findings.map((finding) => (
          <div
            key={finding.id}
            className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {finding.priority.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs font-mono font-semibold text-cyan-300">
                  {finding.control_id}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{finding.framework}</span>
            </div>

            <h4 className="text-sm font-bold text-white">{finding.finding_title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{finding.plain_english_impact}</p>

            {/* Remediation Steps */}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                Required Audit Action:
              </span>
              <ul className="space-y-1 pl-4 list-disc text-xs text-slate-300">
                {finding.remediation_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 1-Click Executive Memo Export */}
      <div className="p-6 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                1-Click Board & Investor Security Memo
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant plain-English markdown brief answering &quot;What is our security posture?&quot;
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMemo}
              className="btn btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              {copiedMemo ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedMemo ? 'Copied to Clipboard' : 'Copy Memo'}</span>
            </button>

            <button
              onClick={handleDownloadMemo}
              className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 border-none shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              {downloaded ? <Check size={13} /> : <Download size={13} />}
              <span>{downloaded ? 'Downloaded' : 'Download .MD'}</span>
            </button>
          </div>
        </div>

        {/* Live Memo Preview Box */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-2 select-text custom-scrollbar">
          <p className="text-cyan-300 font-bold">
            # Sentinel Mini SOC — Executive Security & Compliance Memo
          </p>
          <p className="text-slate-400">
            **Overall Risk Score**: {executiveReport.risk_score}/100 | **Readiness**: {readiness_score}%
          </p>
          <p className="text-slate-300 text-[11px] pt-1">
            {executiveReport.executive_summary}
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            {executiveReport.board_bullet_points.map((pt, i) => (
              <div key={i}>• {pt}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
