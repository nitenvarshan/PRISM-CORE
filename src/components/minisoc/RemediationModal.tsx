'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { SecurityIncident } from '@/lib/minisoc/types';

interface RemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: SecurityIncident | null;
  actionType: string;
}

export default function RemediationModal({
  isOpen,
  onClose,
  incident,
  actionType,
}: RemediationModalProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [receipt, setReceipt] = useState<any | null>(null);

  if (!isOpen || !incident) return null;

  const getActionDetails = () => {
    switch (actionType) {
      case 'block_ip':
        return {
          title: 'Quarantine Offending Source IP',
          desc: 'Deploy an edge-level IP ban across Cloudflare WAF and ingress Nginx proxies.',
          target: '185.220.101.5',
          btnText: 'Confirm Edge Quarantine',
        };
      case 'revoke_session':
        return {
          title: 'Revoke Admin Sessions & Invalidate Tokens',
          desc: 'Instantly purge active JWTs and refresh tokens from distributed auth cache and enforce WebAuthn MFA on next login.',
          target: 'admin@acme-saas.com',
          btnText: 'Terminate Session & Enforce MFA',
        };
      default:
        return {
          title: 'Deploy Automated Firewall Protection Rule',
          desc: `Compile and deploy the synthesized ${incident.recommended_action.patch_type || 'WAF'} rule to active ingress edge.`,
          target: incident.recommended_action.config_patch || 'Custom rule expression',
          btnText: 'Deploy Edge Protection Policy',
        };
    }
  };

  const action = getActionDetails();

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch('/api/minisoc/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: incident.id,
          actionType,
          targetValue: action.target,
          patchType: incident.recommended_action.patch_type,
        }),
      });
      const data = await res.json();
      setReceipt(data);
    } catch (err) {
      console.error('Remediation error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 space-y-5 overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Automated Incident Remediation
              </h3>
              <p className="text-xs text-slate-400">{incident.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        {!receipt ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                Action to Execute:
              </span>
              <h4 className="text-sm font-bold text-white">{action.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{action.desc}</p>

              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">
                  Target Parameter:
                </span>
                <pre className="p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto">
                  {action.target}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={isExecuting}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="btn btn-primary text-xs px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 border-none shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                {isExecuting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Executing Protocol...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    <span>{action.btnText}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Receipt View */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={22} />
              </div>
              <h4 className="text-sm font-bold text-white">{receipt.headline}</h4>
              <p className="text-xs text-emerald-300">{receipt.message}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span className="text-slate-200">{new Date(receipt.appliedAt).toUTCString()}</span>
              </div>
              {receipt.rule_id && (
                <div className="flex justify-between text-slate-400">
                  <span>Rule Reference ID:</span>
                  <span className="text-cyan-300">{receipt.rule_id}</span>
                </div>
              )}
              {receipt.edge_nodes_synced && (
                <div className="flex justify-between text-slate-400">
                  <span>Edge Nodes Synchronized:</span>
                  <span className="text-emerald-400">{receipt.edge_nodes_synced} PoPs</span>
                </div>
              )}
              {receipt.revoked_token_fingerprint && (
                <div className="flex justify-between text-slate-400">
                  <span>Revoked Fingerprint:</span>
                  <span className="text-amber-300">{receipt.revoked_token_fingerprint}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="btn btn-primary text-xs px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 border-none"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
