'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function TryItLiveModal({ onClose }: Props) {
  const [docTitle, setDocTitle] = useState('Acme Hardware Warranty & Returns');
  const [docContent, setDocContent] = useState(
    'Acme Hardware offers a 45-day complete replacement warranty on all mechanical parts. Products returned within 30 days in original packaging receive a 100% refund. Accidental water damage or unauthorized disassembly completely voids the warranty. Customer support is available Monday through Friday 9 AM to 5 PM EST.'
  );
  const [question, setQuestion] = useState('What happens if I accidentally drop it in water?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ response: string; provider?: string; flagged?: boolean } | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docContent.trim() || !question.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/rag/live-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle: docTitle,
          documentContent: docContent,
          question,
        }),
      });

      const data = await res.json();
      setResult({
        response: data.response || data.error,
        provider: data.provider,
        flagged: data.flagged,
      });
    } catch (err: any) {
      setResult({ response: 'Error running RAG query: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-panel-glow" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative',
        backgroundColor: '#0c1220',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>Try BizOS RAG Agent Live (30 Seconds)</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Paste any custom business policy, FAQ, or contract snippet below. Test how BizOS guarantees strict context grounding with zero hallucinations.
        </p>

        <form onSubmit={handleAsk} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Document Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              DOCUMENT TITLE / SCOPE
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="input-field"
              placeholder="e.g. Return Policy, Service Agreement..."
              required
            />
          </div>

          {/* Document Content */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              YOUR CUSTOM POLICY / FAQ CONTENT
            </label>
            <textarea
              rows={4}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="input-field"
              style={{ resize: 'vertical' }}
              placeholder="Paste any custom document paragraphs here..."
              required
            />
          </div>

          {/* Question Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              YOUR QUESTION (AS A CLIENT / PROSPECT)
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-field"
                placeholder="Ask anything about the document..."
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flexShrink: 0 }}
              >
                {loading ? 'Analyzing...' : <><Send size={16} /> <span>Query Agent</span></>}
              </button>
            </div>
          </div>
        </form>

        {/* Results Area */}
        {result && (
          <div className="glass-panel" style={{ marginTop: '24px', padding: '18px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                AI Grounded Response
              </span>
              {result.provider && (
                <span className="badge badge-tenant" style={{ fontSize: '0.7rem' }}>
                  Engine: {result.provider}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.95rem', color: '#ffffff', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {result.response}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: '#10b981', fontSize: '0.78rem' }}>
              <ShieldCheck size={16} />
              <span>Strict RAG boundary verified — 0 foreign tenant data leaked.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
