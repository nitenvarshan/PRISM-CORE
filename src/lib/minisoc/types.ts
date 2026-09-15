export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface LogEvent {
  id: string;
  timestamp: string;
  source: string; // 'auth_gateway' | 'nginx_edge' | 'aws_cloudtrail' | 'api_server'
  event_type: string;
  ip_address: string;
  user_identifier?: string;
  endpoint?: string;
  status_code?: number;
  payload: Record<string, any>;
  is_anomaly?: boolean;
}

export interface AnomalyCluster {
  id: string;
  signature: string;
  event_type: string;
  affected_targets: string[];
  source_ips: string[];
  event_count: number;
  sample_lines: string[];
  confidence: number;
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: SeverityLevel;
  mitre_tactic: string;
  mitre_technique_id: string;
  confidence_score: number;
  executive_summary: string;
  technical_analysis: string;
  blast_radius: string;
  recommended_action: {
    immediate: string;
    permanent: string;
    config_patch?: string;
    patch_type?: 'cloudflare_waf' | 'nginx_block' | 'aws_iam_policy' | 'iptables';
  };
  status: 'open' | 'investigating' | 'remediated' | 'false_positive';
}

export interface ComplianceFinding {
  id: string;
  framework: 'SOC2_Type_II' | 'CIS_Controls' | 'OWASP_API_Top_10';
  control_id: string;
  finding_title: string;
  plain_english_impact: string;
  remediation_steps: string[];
  priority: 'p1_critical' | 'p2_high' | 'p3_medium';
  status: 'active' | 'remediated';
}

export interface ExecutiveReport {
  risk_score: number; // 0 to 100
  risk_status: 'critical' | 'elevated' | 'moderate' | 'nominal';
  noise_reduction_pct: number; // e.g., 98.6%
  total_events: number;
  anomalies_detected: number;
  incidents_created: number;
  executive_summary: string;
  board_bullet_points: string[];
  generated_at: string;
}

export interface AnalysisResult {
  scenario_id?: string;
  raw_logs: LogEvent[];
  clusters: AnomalyCluster[];
  incidents: SecurityIncident[];
  compliance: {
    readiness_score: number;
    soc2_status: 'audit_ready' | 'minor_gaps' | 'at_risk';
    findings: ComplianceFinding[];
  };
  executive_report: ExecutiveReport;
  processing_time_ms: number;
  llm_engine_used: string;
}

export interface AttackScenario {
  id: string;
  title: string;
  subtitle: string;
  category: 'credential_attack' | 'web_recon' | 'cloud_iam';
  severity: SeverityLevel;
  iconName: string;
  targetEnvironment: string;
  logs: LogEvent[];
}
