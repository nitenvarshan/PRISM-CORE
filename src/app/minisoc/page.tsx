'use client';

import React, { useState, useEffect } from 'react';
import MiniSocNavbar from '@/components/minisoc/MiniSocNavbar';
import RiskScoreGauge from '@/components/minisoc/RiskScoreGauge';
import LiveLogTerminal from '@/components/minisoc/LiveLogTerminal';
import IncidentTriageView from '@/components/minisoc/IncidentTriageView';
import ComplianceReportView from '@/components/minisoc/ComplianceReportView';
import RemediationModal from '@/components/minisoc/RemediationModal';
import UploadLogsModal from '@/components/minisoc/UploadLogsModal';
import { AnalysisResult, SecurityIncident } from '@/lib/minisoc/types';
import { ATTACK_SCENARIOS } from '@/lib/minisoc/scenarios';
import { Sparkles } from 'lucide-react';

export default function MiniSocPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'terminal' | 'incidents' | 'compliance'>('overview');
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('credential_stuffing');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [remediationState, setRemediationState] = useState<{
    isOpen: boolean;
    incident: SecurityIncident | null;
    actionType: string;
  }>({
    isOpen: false,
    incident: null,
    actionType: 'block_ip',
  });

  // Fetch initial scenario on mount
  useEffect(() => {
    loadScenario('credential_stuffing');
  }, []);

  const loadScenario = async (scenarioId: string) => {
    setIsLoading(true);
    setIsAnalyzing(true);
    setCurrentScenarioId(scenarioId);

    try {
      const res = await fetch(`/api/minisoc/analyze?scenario=${scenarioId}`);
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Failed to load scenario:', err);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleCustomLogsSubmit = async (rawLogs: string) => {
    setIsAnalyzing(true);
    setCurrentScenarioId('custom_upload');

    try {
      const res = await fetch('/api/minisoc/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customLogs: rawLogs }),
      });
      const data = await res.json();
      setAnalysisResult(data);
      setActiveTab('overview');
    } catch (err) {
      console.error('Custom log triage failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenRemediation = (incident: SecurityIncident, actionType: string) => {
    setRemediationState({
      isOpen: true,
      incident,
      actionType,
    });
  };

  const currentScenario = ATTACK_SCENARIOS[currentScenarioId] || {
    id: 'custom',
    title: 'Custom Log Ingestion Batch',
    subtitle: 'User-provided log telemetry',
    severity: 'high',
    targetEnvironment: 'Custom Ingest Stream',
  };

  return (
    <div data-tenant="minisoc" className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Glassmorphic Navigation Header */}
      <MiniSocNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        incidentCount={analysisResult?.incidents.length || 0}
        engineUsed={analysisResult?.llm_engine_used || 'Autonomous SOC Engine'}
      />

      {/* Main Command Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Pitch & Architecture Strip */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-cyan-950/30 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <Sparkles size={13} className="text-cyan-400" />
                <span>Affordable Enterprise SIEM Alternative for SMBs & Startups</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Autonomous AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Security Operations Center</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Enterprise SIEM tools (Splunk, Datadog) start at thousands of dollars per month and require dedicated SOC analysts. Sentinel Mini SOC delivers 24/7 autonomous log filtering, MITRE ATT&CK triage, and plain-English SOC 2 posture reporting for a fraction of the cost.
              </p>
            </div>

            {/* 3-Agent Architecture Pipeline Micro-Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 lg:w-80 flex-shrink-0 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-white/5">
                <span className="text-cyan-400 font-bold uppercase">3-Agent Pipeline</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span>1. Log Analysis Agent:</span>
                  <span className="text-cyan-300">Noise Filter (-98%)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>2. Threat Hunter Agent:</span>
                  <span className="text-amber-300">MITRE Correlator</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>3. GRC-Lite Agent:</span>
                  <span className="text-emerald-300">SOC 2 Auditor</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Risk Meter & Scenario Switcher */}
        {analysisResult && (
          <RiskScoreGauge
            report={analysisResult.executive_report}
            currentScenarioId={currentScenarioId}
            onSelectScenario={loadScenario}
            onOpenUploadModal={() => setUploadModalOpen(true)}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Tabbed Interactive Content Area */}
        {isLoading || !analysisResult ? (
          <div className="p-16 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-mono text-cyan-300">
              Ingesting stream & executing multi-agent triage...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Tab (Unified Command View) */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Two-Column Core Layout: Terminal on Left, Incidents on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column (5 cols): Real-Time Ingestion Stream */}
                  <div className="lg:col-span-5 space-y-4">
                    <LiveLogTerminal
                      logs={analysisResult.raw_logs}
                      sourceTitle={currentScenario.title}
                    />
                  </div>

                  {/* Right Column (7 cols): Autonomous Incident Investigation */}
                  <div className="lg:col-span-7 space-y-4">
                    <IncidentTriageView
                      incidents={analysisResult.incidents}
                      onTriggerRemediation={handleOpenRemediation}
                    />
                  </div>
                </div>

                {/* Bottom Section: SOC 2 & GRC-Lite Posture Card */}
                <div className="pt-2">
                  <ComplianceReportView
                    compliance={analysisResult.compliance}
                    executiveReport={analysisResult.executive_report}
                  />
                </div>
              </div>
            )}

            {/* Dedicated Terminal Tab */}
            {activeTab === 'terminal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      High-Throughput Raw Telemetry Feed
                    </h2>
                    <p className="text-xs text-slate-400">
                      Unfiltered ingestion buffer from edge proxies, auth microservices, and cloud audit trails.
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="btn btn-secondary text-xs px-3.5 py-1.5"
                  >
                    Paste Custom Stream
                  </button>
                </div>
                <LiveLogTerminal
                  logs={analysisResult.raw_logs}
                  sourceTitle={currentScenario.title}
                />
              </div>
            )}

            {/* Dedicated Incidents Tab */}
            {activeTab === 'incidents' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <IncidentTriageView
                  incidents={analysisResult.incidents}
                  onTriggerRemediation={handleOpenRemediation}
                />
              </div>
            )}

            {/* Dedicated Compliance Tab */}
            {activeTab === 'compliance' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <ComplianceReportView
                  compliance={analysisResult.compliance}
                  executiveReport={analysisResult.executive_report}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Remediation Modal */}
      <RemediationModal
        isOpen={remediationState.isOpen}
        onClose={() => setRemediationState({ ...remediationState, isOpen: false })}
        incident={remediationState.incident}
        actionType={remediationState.actionType}
      />

      {/* Upload Custom Logs Modal */}
      <UploadLogsModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmitCustomLogs={handleCustomLogsSubmit}
        isAnalyzing={isAnalyzing}
      />

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-xl py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Sentinel Mini SOC</span>
            <span>—</span>
            <span>Project 4 Portfolio Showcase</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>MITRE ATT&CK v14.1</span>
            <span>•</span>
            <span>SOC 2 Type II TSC</span>
            <span>•</span>
            <span className="text-cyan-400">Free-Tier Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
