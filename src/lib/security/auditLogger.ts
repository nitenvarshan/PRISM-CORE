import { getServerSupabase } from '../supabase/server';
import { mockDb, DbAuditLog } from '../supabase/mockDb';

export interface AuditLogPayload {
  tenantId: string;
  actorId?: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  ipAddress?: string;
  status?: 'success' | 'denied' | 'failed';
}

export async function logAuditEvent(payload: AuditLogPayload): Promise<void> {
  const {
    tenantId,
    actorId = 'anonymous_client',
    action,
    resource,
    details = {},
    ipAddress = '127.0.0.1',
    status = 'success',
  } = payload;

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      await supabase.from('audit_logs').insert({
        tenant_id: tenantId,
        actor_id: actorId,
        action,
        resource,
        details,
        ip_address: ipAddress,
        status,
      });
      return;
    } catch (err) {
      console.warn('Supabase audit log insert error, logging to mockDb:', err);
    }
  }

  // Fallback to local store
  mockDb.addAuditLog({
    tenant_id: tenantId,
    actor_id: actorId,
    action,
    resource,
    details,
    ip_address: ipAddress,
    status,
  });
}

export async function fetchAuditLogs(tenantId: string): Promise<DbAuditLog[]> {
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        return data as DbAuditLog[];
      }
    } catch (err) {
      console.warn('Error querying audit logs from Supabase, using mockDb:', err);
    }
  }

  return mockDb.getAuditLogs(tenantId);
}
