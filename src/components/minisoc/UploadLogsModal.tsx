'use client';

import React, { useState } from 'react';
import { X, UploadCloud, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface UploadLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCustomLogs: (rawLogs: string) => Promise<void>;
  isAnalyzing: boolean;
}

export default function UploadLogsModal({
  isOpen,
  onClose,
  onSubmitCustomLogs,
  isAnalyzing,
}: UploadLogsModalProps) {
  const [logText, setLogText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleNginxAttack = `198.51.100.23 - - [14/Sep/2026:10:14:01 +0000] "POST /api/v1/auth/token HTTP/1.1" 401 84 "-" "python-requests/2.28.1"
198.51.100.23 - - [14/Sep/2026:10:14:03 +0000] "POST /api/v1/auth/token HTTP/1.1" 401 84 "-" "python-requests/2.28.1"
198.51.100.23 - - [14/Sep/2026:10:14:05 +0000] "POST /api/v1/auth/token HTTP/1.1" 401 84 "-" "python-requests/2.28.1"
198.51.100.23 - - [14/Sep/2026:10:14:08 +0000] "GET /api/v1/internal/config HTTP/1.1" 403 120 "-" "curl/7.81.0"
198.51.100.23 - - [14/Sep/2026:10:14:12 +0000] "GET /phpmyadmin/index.php HTTP/1.1" 404 150 "-" "Go-http-client/1.1"`;

  const handleLoadSample = () => {
    setLogText(sampleNginxAttack);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File is too large. Please provide a log file under 2MB for browser analysis.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setLogText(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!logText.trim()) {
      setError('Please paste or upload log entries before submitting.');
      return;
    }
    setError(null);
    await onSubmitCustomLogs(logText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Custom Log Ingestion
              </h3>
              <p className="text-xs text-slate-400">
                Paste raw logs (Syslog, Nginx, JSON) for instant multi-agent triage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Log Input Stream:</span>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-mono">
                <span>Upload File (.log, .json)</span>
                <input
                  type="file"
                  accept=".log,.txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-slate-600">|</span>
              <button
                onClick={handleLoadSample}
                className="text-slate-400 hover:text-white font-mono"
              >
                Insert Sample Attack
              </button>
            </div>
          </div>

          <textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            placeholder="Paste raw server logs, auth events, or JSON lines here..."
            className="w-full h-52 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 custom-scrollbar"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-slate-400">
            {logText.split('\n').filter(Boolean).length} lines detected
          </span>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn btn-secondary text-xs px-4 py-2">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="btn btn-primary text-xs px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 border-none shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Agent Triaging...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Execute AI Triage</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
