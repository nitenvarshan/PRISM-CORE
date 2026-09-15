'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Filter, ShieldAlert } from 'lucide-react';
import { LogEvent } from '@/lib/minisoc/types';

interface LiveLogTerminalProps {
  logs: LogEvent[];
  sourceTitle: string;
}

export default function LiveLogTerminal({ logs, sourceTitle }: LiveLogTerminalProps) {
  const [filterAnomaliesOnly, setFilterAnomaliesOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayedLogs = filterAnomaliesOnly ? logs.filter((l) => l.is_anomaly) : logs;

  const handleCopyLogs = () => {
    const rawText = displayedLogs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.source}] ${l.ip_address} ${l.endpoint || ''} ${l.status_code || ''} ${JSON.stringify(l.payload)}`
      )
      .join('\n');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (code?: number) => {
    if (!code) return 'text-slate-400 bg-slate-800/60 border-slate-700/50';
    if (code >= 500) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (code >= 400) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (code >= 300) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'auth_gateway':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'nginx_edge':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'aws_cloudtrail':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="rounded-2xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[520px]">
      {/* Terminal Titlebar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mac-style window controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">Live Ingestion Feed</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">({sourceTitle})</span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterAnomaliesOnly(!filterAnomaliesOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              filterAnomaliesOnly
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <Filter size={12} />
            <span>{filterAnomaliesOnly ? 'Anomalies Only' : 'All Traffic'}</span>
          </button>

          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
            title="Copy logs to clipboard"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Log Stream */}
      <div className="p-4 flex-1 overflow-y-auto font-mono text-xs space-y-2 select-text custom-scrollbar">
        {displayedLogs.map((log) => (
          <div
            key={log.id}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              log.is_anomaly
                ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60 shadow-[inset_0_0_15px_rgba(244,63,94,0.08)]'
                : 'bg-slate-900/40 border-white/5 hover:border-white/15'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pb-1.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${getSourceBadge(
                    log.source
                  )}`}
                >
                  {log.source.replace('_', ' ')}
                </span>
                <span className="text-cyan-300 font-semibold">{log.event_type}</span>
              </div>

              {log.is_anomaly && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                  <ShieldAlert size={11} />
                  <span>SUSPICIOUS ANOMALY</span>
                </span>
              )}
            </div>

            {/* Event Details */}
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <span className="text-slate-300 font-medium">IP:</span>
              <span className="text-white font-semibold bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                {log.ip_address}
              </span>

              {log.endpoint && (
                <>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-300">Route:</span>
                  <span className="text-cyan-200">{log.endpoint}</span>
                </>
              )}

              {log.status_code && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border font-mono ${getStatusColor(
                    log.status_code
                  )}`}
                >
                  {log.status_code}
                </span>
              )}

              {log.user_identifier && (
                <>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">Target:</span>
                  <span className="text-amber-300">{log.user_identifier}</span>
                </>
              )}
            </div>

            {/* Payload snippet */}
            {log.payload && Object.keys(log.payload).length > 0 && (
              <div className="mt-1.5 text-[11px] text-slate-400 bg-black/40 p-1.5 rounded-lg border border-white/5 overflow-x-auto">
                <span className="text-slate-500 mr-1">$</span>
                <span className="text-slate-300">{JSON.stringify(log.payload)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Ingesting from 3 telemetry endpoints</span>
        </div>
        <span>{displayedLogs.length} events active</span>
      </div>
    </div>
  );
}
