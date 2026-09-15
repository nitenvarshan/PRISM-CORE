'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { getTenantBySlug, TenantConfig } from '@/lib/config/tenants';

interface Props {
  tenantSlug: string;
  presetQuestions?: string[];
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  actionTaken?: any;
  sources?: any[];
  timestamp: string;
}

export default function BizChatWidget({ tenantSlug, presetQuestions = [] }: Props) {
  const tenant: TenantConfig | undefined = getTenantBySlug(tenantSlug);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const brand = tenant?.branding;
  const primaryColor = brand?.primaryColor || '#6366f1';
  const brandName = brand?.brandName || 'Assistant';

  useEffect(() => {
    if (tenant && messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `Welcome to ${brandName}! 👋 I am your grounded AI assistant. I can answer policy/service questions or book an appointment directly. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [tenant, brandName, messages.length]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const defaultPresets = presetQuestions.length > 0
    ? presetQuestions
    : tenantSlug === 'salon'
    ? ['What is your cancellation policy?', 'Book a Signature Haircut for tomorrow', 'How do I care for my Keratin treatment?']
    : tenantSlug === 'store'
    ? ['What is the warranty on keyboards?', 'What are the domestic shipping rates?', 'Book a hardware consultation']
    : ['What is the Sev 1 incident SLA?', 'How does database isolation work?', 'Book an infrastructure audit'];

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !tenant) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenant.id,
          message: trimmed,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not process that request.',
        actionTaken: data.actionTaken,
        sources: data.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          role: 'assistant',
          content: 'Network error connecting to BizOS RAG engine. Please retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!tenant) return null;

  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 90 }}>
      {/* Floating Launcher Button with Ripple Ring */}
      {!isOpen && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: primaryColor,
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              boxShadow: `0 8px 32px -4px ${primaryColor}aa, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="animate-float"
            aria-label="Open AI Concierge"
          >
            <MessageSquare size={28} />
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className="glass-panel-glow"
          style={{
            width: '400px',
            maxWidth: 'calc(100vw - 40px)',
            height: '590px',
            maxHeight: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#090d18',
            border: `1px solid ${primaryColor}66`,
            borderRadius: '24px',
            boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px ${primaryColor}44`,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: `${primaryColor}25`,
                  border: `1px solid ${primaryColor}77`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: primaryColor,
                  boxShadow: `0 0 15px -3px ${primaryColor}55`,
                }}
              >
                <Bot size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0, fontWeight: 800 }}>{brandName} Agent</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span
                    className="status-dot status-dot-pulse"
                    style={{ backgroundColor: '#10b981' }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>
                    Grounded RAG • Strict Context
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: '18px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '86%',
                      padding: '12px 16px',
                      borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      backgroundColor: isUser ? primaryColor : 'rgba(25, 34, 52, 0.85)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      lineHeight: '1.5',
                      border: isUser
                        ? '1px solid rgba(255, 255, 255, 0.15)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isUser
                        ? `0 4px 18px -2px ${primaryColor}66`
                        : '0 4px 14px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {m.content}

                    {/* Agent Action Badge if tool was called */}
                    {m.actionTaken && m.actionTaken.success && (
                      <div
                        style={{
                          marginTop: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(16, 185, 129, 0.18)',
                          border: '1px solid rgba(16, 185, 129, 0.45)',
                          fontSize: '0.78rem',
                          color: '#34d399',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Action Executed: Appointment Reserved in Database</span>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', padding: '0 4px' }}>
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px' }}>
                <Sparkles size={16} color={primaryColor} className="animate-spin" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Searching pgvector & grounding answer...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Presets (1-Click chips) */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(12, 18, 32, 0.8)',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {defaultPresets.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                style={{
                  fontSize: '0.74rem',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.18s ease',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = primaryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleFormSubmit}
            style={{
              padding: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '10px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${brandName} or book...`}
              className="input-field"
              style={{ fontSize: '0.88rem', padding: '10px 14px', borderRadius: '10px' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: primaryColor,
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: `0 4px 15px -2px ${primaryColor}77`,
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
