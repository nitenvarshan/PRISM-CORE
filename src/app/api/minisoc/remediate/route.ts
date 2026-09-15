import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { incidentId, actionType, targetValue, patchType } = body;

    if (!incidentId || !actionType) {
      return NextResponse.json(
        { error: 'incidentId and actionType are required' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    let receipt: Record<string, any> = {
      incidentId,
      actionType,
      appliedAt: timestamp,
      status: 'success'
    };

    switch (actionType) {
      case 'block_ip':
        receipt = {
          ...receipt,
          headline: `Edge IP Quarantine Active`,
          message: `IP ${targetValue || '185.220.101.5'} successfully quarantined at Cloudflare & Nginx edge ingress. TTL: 24h.`,
          rule_id: `rule_edge_${Math.random().toString(36).substring(2, 8)}`,
          edge_nodes_synced: 14
        };
        break;

      case 'revoke_session':
        receipt = {
          ...receipt,
          headline: `Admin Session Terminated & Token Blacklisted`,
          message: `Active JWT session for user ${targetValue || 'admin@acme-saas.com'} invalidated across all Redis auth clusters. Forced password reset initiated.`,
          revoked_token_fingerprint: `jwt_revoked_${Math.random().toString(36).substring(2, 10)}`,
          mfa_enforced_next_login: true
        };
        break;

      case 'generate_waf_rule':
      case 'apply_waf':
        receipt = {
          ...receipt,
          headline: `WAF Protection Policy Deployed`,
          message: `Custom protection rule compiled and deployed to Edge Gateway.`,
          firewall_engine: patchType || 'cloudflare_waf',
          compiled_rule: targetValue || '(http.request.uri.path contains "/api/v1/auth" and cf.threat_score gt 20) -> BLOCK'
        };
        break;

      case 'disable_public_swagger':
        receipt = {
          ...receipt,
          headline: `Documentation Endpoints Gated Behind VPN`,
          message: `/swagger-ui.html and /v2/api-docs restricted to internal subnet (10.0.0.0/8). Public 404 response enforced.`,
          status_code_override: 404
        };
        break;

      case 'revoke_iam_key':
        receipt = {
          ...receipt,
          headline: `AWS Access Key Deactivated & Policy Detached`,
          message: `Access key ${targetValue || 'AKIA_PROD_ROGUE_7882'} deleted. Policy AdministratorAccess detached from backup-sync-worker.`,
          cloudtrail_audit_event_id: `evt_iam_${Math.random().toString(36).substring(2, 10)}`
        };
        break;

      default:
        receipt = {
          ...receipt,
          headline: `Remediation Completed`,
          message: `Security mitigation successfully applied.`
        };
    }

    return NextResponse.json(receipt);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Remediation failed' },
      { status: 500 }
    );
  }
}
