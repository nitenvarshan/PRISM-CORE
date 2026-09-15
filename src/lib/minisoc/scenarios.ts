import { AttackScenario, LogEvent } from './types';

// Helper to generate ISO timestamps relative to "now"
const ago = (secondsAgo: number) => {
  return new Date(Date.now() - secondsAgo * 1000).toISOString();
};

export const ATTACK_SCENARIOS: Record<string, AttackScenario> = {
  credential_stuffing: {
    id: 'credential_stuffing',
    title: 'Credential Stuffing & ATO Attempt',
    subtitle: 'High-frequency distributed dictionary attack across 4 Tor exit nodes targeting admin credentials',
    category: 'credential_attack',
    severity: 'critical',
    iconName: 'KeyRound',
    targetEnvironment: 'Production Auth Gateway (/api/v1/auth/login)',
    logs: [
      {
        id: 'cs-01',
        timestamp: ago(118),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '185.220.101.5',
        user_identifier: 'sarah.miller@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'Python-urllib/3.9', tor_node: true }
      },
      {
        id: 'cs-02',
        timestamp: ago(115),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '185.220.101.5',
        user_identifier: 'david.chen@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'Python-urllib/3.9', tor_node: true }
      },
      {
        id: 'cs-03',
        timestamp: ago(110),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '198.98.56.12',
        user_identifier: 'alex.torres@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'Go-http-client/1.1', tor_node: true }
      },
      {
        id: 'cs-04',
        timestamp: ago(104),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '198.98.56.12',
        user_identifier: 'support@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'Go-http-client/1.1', tor_node: true }
      },
      {
        id: 'cs-05',
        timestamp: ago(98),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '176.10.99.200',
        user_identifier: 'billing@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'curl/7.68.0', tor_node: true }
      },
      {
        id: 'cs-06',
        timestamp: ago(92),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '176.10.99.200',
        user_identifier: 'ceo@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'curl/7.68.0', tor_node: true }
      },
      {
        id: 'cs-07',
        timestamp: ago(85),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '103.251.167.21',
        user_identifier: 'devops-lead@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'Python-urllib/3.9' }
      },
      {
        id: 'cs-08',
        timestamp: ago(75),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '103.251.167.21',
        user_identifier: 'admin@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'Python-urllib/3.9' }
      },
      {
        id: 'cs-09',
        timestamp: ago(60),
        source: 'auth_gateway',
        event_type: 'login_failed',
        ip_address: '185.220.101.5',
        user_identifier: 'admin@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 401,
        payload: { failure_reason: 'invalid_credentials', client_agent: 'Python-urllib/3.9' }
      },
      {
        id: 'cs-10',
        timestamp: ago(42),
        source: 'auth_gateway',
        event_type: 'login_success',
        ip_address: '185.220.101.5',
        user_identifier: 'admin@acme-saas.com',
        endpoint: '/api/v1/auth/login',
        status_code: 200,
        is_anomaly: true,
        payload: {
          session_token_issued: 'jwt_sec_9942a...',
          mfa_enforced: false,
          geo_location: 'Frankfurt, DE (Tor Exit)',
          user_role: 'super_admin',
          previous_login_geo: 'Austin, TX, US'
        }
      },
      {
        id: 'cs-11',
        timestamp: ago(35),
        source: 'api_server',
        event_type: 'api_access',
        ip_address: '185.220.101.5',
        user_identifier: 'admin@acme-saas.com',
        endpoint: '/api/v1/admin/users/export',
        status_code: 200,
        is_anomaly: true,
        payload: { records_requested: 450, action: 'customer_pii_download' }
      }
    ]
  },

  web_recon: {
    id: 'web_recon',
    title: 'Automated Web Recon & Exposure Probing',
    subtitle: 'Vulnerability scanner cycling sensitive environment files, Git metadata, and debug endpoints',
    category: 'web_recon',
    severity: 'high',
    iconName: 'SearchCode',
    targetEnvironment: 'Edge Nginx Ingress Controller',
    logs: [
      {
        id: 'wr-01',
        timestamp: ago(120),
        source: 'nginx_edge',
        event_type: 'http_request',
        ip_address: '45.154.255.89',
        endpoint: '/.env',
        status_code: 404,
        payload: { method: 'GET', user_agent: 'Nuclei - Open-source project (github.com/projectdiscovery/nuclei)' }
      },
      {
        id: 'wr-02',
        timestamp: ago(116),
        source: 'nginx_edge',
        event_type: 'http_request',
        ip_address: '45.154.255.89',
        endpoint: '/.git/config',
        status_code: 404,
        payload: { method: 'GET', user_agent: 'Nuclei/v2.9.8' }
      },
      {
        id: 'wr-03',
        timestamp: ago(112),
        source: 'nginx_edge',
        event_type: 'http_request',
        ip_address: '45.154.255.89',
        endpoint: '/.git/HEAD',
        status_code: 404,
        payload: { method: 'GET', user_agent: 'Nuclei/v2.9.8' }
      },
      {
        id: 'wr-04',
        timestamp: ago(105),
        source: 'nginx_edge',
        event_type: 'http_request',
        ip_address: '45.154.255.89',
        endpoint: '/actuator/env',
        status_code: 404,
        payload: { method: 'GET', user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      },
      {
        id: 'wr-05',
        timestamp: ago(98),
        source: 'nginx_edge',
        event_type: 'http_request',
        ip_address: '45.154.255.89',
        endpoint: '/actuator/heapdump',
        status_code: 404,
        payload: { method: 'GET', user_agent: 'Mozilla/5.0 (compatible; Nessus)' }
      },
      {
        id: 'wr-06',
        timestamp: ago(88),
        source: 'nginx_edge',
        event_type: 'http_request',
        ip_address: '45.154.255.89',
        endpoint: '/swagger-ui.html',
        status_code: 200,
        is_anomaly: true,
        payload: { method: 'GET', unauthenticated_swagger_exposed: true }
      },
      {
        id: 'wr-07',
        timestamp: ago(75),
        source: 'nginx_edge',
        event_type: 'http_request',
        ip_address: '45.154.255.89',
        endpoint: '/v2/api-docs',
        status_code: 200,
        is_anomaly: true,
        payload: { method: 'GET', schema_harvested: true, size_bytes: 148200 }
      },
      {
        id: 'wr-08',
        timestamp: ago(60),
        source: 'nginx_edge',
        event_type: 'http_request',
        ip_address: '45.154.255.89',
        endpoint: '/api/v1/internal/config',
        status_code: 403,
        payload: { method: 'GET', forbidden_access_attempt: true }
      }
    ]
  },

  cloud_iam: {
    id: 'cloud_iam',
    title: 'CloudTrail IAM Privilege Escalation',
    subtitle: 'Automated CI/CD service worker token compromised, attaching AdministratorAccess policy and generating persistent keys',
    category: 'cloud_iam',
    severity: 'critical',
    iconName: 'CloudAlert',
    targetEnvironment: 'AWS Organization (Account 8912-4412-0019)',
    logs: [
      {
        id: 'iam-01',
        timestamp: ago(130),
        source: 'aws_cloudtrail',
        event_type: 'AssumeRole',
        ip_address: '54.240.198.15',
        user_identifier: 'arn:aws:iam::891244120019:role/github-actions-deployer',
        endpoint: 'sts.amazonaws.com',
        status_code: 200,
        payload: { role_arn: 'github-actions-deployer', session_name: 'github_run_991823' }
      },
      {
        id: 'iam-02',
        timestamp: ago(115),
        source: 'aws_cloudtrail',
        event_type: 'AttachUserPolicy',
        ip_address: '194.26.29.112',
        user_identifier: 'github-actions-deployer',
        endpoint: 'iam.amazonaws.com',
        status_code: 200,
        is_anomaly: true,
        payload: {
          policyArn: 'arn:aws:iam::aws:policy/AdministratorAccess',
          target_user: 'backup-sync-worker',
          userAgent: 'aws-cli/2.13.12 Python/3.11.4 Linux/x86_64',
          sourceIPAddress: '194.26.29.112 (Saint Petersburg, RU)'
        }
      },
      {
        id: 'iam-03',
        timestamp: ago(90),
        source: 'aws_cloudtrail',
        event_type: 'CreateAccessKey',
        ip_address: '194.26.29.112',
        user_identifier: 'backup-sync-worker',
        endpoint: 'iam.amazonaws.com',
        status_code: 200,
        is_anomaly: true,
        payload: {
          accessKeyId: 'AKIA_PROD_ROGUE_7882',
          userAgent: 'aws-cli/2.13.12'
        }
      },
      {
        id: 'iam-04',
        timestamp: ago(60),
        source: 'aws_cloudtrail',
        event_type: 'DescribeInstances',
        ip_address: '194.26.29.112',
        user_identifier: 'backup-sync-worker',
        endpoint: 'ec2.us-east-1.amazonaws.com',
        status_code: 200,
        payload: { instances_enumerated: 14 }
      },
      {
        id: 'iam-05',
        timestamp: ago(30),
        source: 'aws_cloudtrail',
        event_type: 'ModifyBucketPolicy',
        ip_address: '194.26.29.112',
        user_identifier: 'backup-sync-worker',
        endpoint: 's3.amazonaws.com',
        status_code: 403,
        payload: {
          bucket_name: 'acme-financial-db-backups-2026',
          denied_by: 's3_block_public_access_org_scp'
        }
      }
    ]
  }
};

// Baseline benign background logs to demonstrate 95%+ noise reduction
export const BENIGN_BACKGROUND_LOGS: LogEvent[] = [
  {
    id: 'b-01',
    timestamp: ago(150),
    source: 'nginx_edge',
    event_type: 'http_request',
    ip_address: '66.249.66.1',
    endpoint: '/robots.txt',
    status_code: 200,
    payload: { method: 'GET', user_agent: 'Googlebot/2.1 (+http://www.google.com/bot.html)' }
  },
  {
    id: 'b-02',
    timestamp: ago(142),
    source: 'api_server',
    event_type: 'health_check',
    ip_address: '10.0.1.45',
    endpoint: '/healthz',
    status_code: 200,
    payload: { method: 'GET', uptime: '14d 6h 12m' }
  },
  {
    id: 'b-03',
    timestamp: ago(135),
    source: 'nginx_edge',
    event_type: 'static_asset',
    ip_address: '72.14.199.3',
    endpoint: '/assets/app.chunk.min.js',
    status_code: 200,
    payload: { method: 'GET', bytes: 24510 }
  },
  {
    id: 'b-04',
    timestamp: ago(122),
    source: 'auth_gateway',
    event_type: 'token_refresh',
    ip_address: '73.189.44.20',
    endpoint: '/api/v1/auth/refresh',
    status_code: 200,
    payload: { method: 'POST', user: 'julie@legit-customer.com' }
  },
  {
    id: 'b-05',
    timestamp: ago(100),
    source: 'api_server',
    event_type: 'cron_heartbeat',
    ip_address: '127.0.0.1',
    endpoint: '/internal/scheduler/tick',
    status_code: 200,
    payload: { job: 'sync_billing_invoices', duration_ms: 42 }
  }
];
