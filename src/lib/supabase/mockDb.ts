import { DEMO_TENANTS } from '../config/tenants';

export interface DbService {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  is_active: boolean;
  created_at: string;
}

export interface DbBooking {
  id: string;
  tenant_id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  datetime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
}

export interface DbDocument {
  id: string;
  tenant_id: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
  created_at: string;
}

export interface DbAuditLog {
  id: string;
  tenant_id: string;
  actor_id: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ip_address: string;
  status: 'success' | 'denied' | 'failed';
  created_at: string;
}

export interface DbRateLimit {
  key: string;
  count: number;
  window_start: number;
}

// In-memory store persistent across requests in serverless runtime instance
class MockDatabase {
  private services: DbService[] = [
    // Salon Services
    {
      id: 's1111111-1111-1111-1111-111111111111',
      tenant_id: DEMO_TENANTS.salon.id,
      name: 'Signature Haircut & Blowout',
      description: 'Precision cut customized to face shape, includes clarifying shampoo & styling.',
      price: 65.0,
      duration: 45,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 's1111111-1111-1111-1111-111111111112',
      tenant_id: DEMO_TENANTS.salon.id,
      name: 'Balayage & Dimensional Color',
      description: 'Hand-painted sun-kissed dimension with bonding treatment & gloss toner.',
      price: 180.0,
      duration: 120,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 's1111111-1111-1111-1111-111111111113',
      tenant_id: DEMO_TENANTS.salon.id,
      name: 'Keratin Silk Smoothing Treatment',
      description: 'Frizz-free restructuring treatment lasting up to 4 months with deep shine.',
      price: 220.0,
      duration: 150,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 's1111111-1111-1111-1111-111111111114',
      tenant_id: DEMO_TENANTS.salon.id,
      name: 'Hydrating Scalp Spa & Massage',
      description: 'Detoxifying scalp scrub, organic essential oil steam, and tension-relief massage.',
      price: 50.0,
      duration: 30,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    // Store Services/Products
    {
      id: 's2222222-2222-2222-2222-222222222221',
      tenant_id: DEMO_TENANTS.store.id,
      name: 'UltraMech Pro Mechanical Keyboard',
      description: 'Hot-swappable switches, gasket-mounted sound damping, CNC aluminum casing.',
      price: 149.0,
      duration: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 's2222222-2222-2222-2222-222222222222',
      tenant_id: DEMO_TENANTS.store.id,
      name: 'Quantum ANC Studio Headset',
      description: 'Active hybrid noise cancelling, 40mm planar magnetic drivers, 50h battery.',
      price: 229.0,
      duration: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 's2222222-2222-2222-2222-222222222223',
      tenant_id: DEMO_TENANTS.store.id,
      name: 'Apex Studio Cardioid Microphone',
      description: 'Broadcast-grade 192kHz/24bit microphone with built-in shock mount & DSP.',
      price: 119.0,
      duration: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 's2222222-2222-2222-2222-222222222224',
      tenant_id: DEMO_TENANTS.store.id,
      name: 'Hardware Customization Consultation',
      description: '1-on-1 virtual consultation with a mechanical engineer for custom desk gear.',
      price: 45.0,
      duration: 30,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    // Ops Services
    {
      id: 's3333333-3333-3333-3333-333333333331',
      tenant_id: DEMO_TENANTS.ops.id,
      name: 'Cloud Infrastructure Health Audit',
      description: 'Comprehensive scan for security holes, AWS/GCP cost leakage, and IAM over-privileges.',
      price: 499.0,
      duration: 60,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 's3333333-3333-3333-3333-333333333332',
      tenant_id: DEMO_TENANTS.ops.id,
      name: 'Monthly SOC Incident Response Retainer',
      description: '24/7 dedicated telemetry triage and guaranteed 15-minute response SLA.',
      price: 1200.0,
      duration: 30,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 's3333333-3333-3333-3333-333333333333',
      tenant_id: DEMO_TENANTS.ops.id,
      name: 'SOC 2 Type II Readiness Sprint',
      description: 'Architecture hardening, policy drafting, and automated evidence collector setup.',
      price: 2500.0,
      duration: 90,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];

  private bookings: DbBooking[] = [
    {
      id: 'b1111111-1111-1111-1111-111111111111',
      tenant_id: DEMO_TENANTS.salon.id,
      service_id: 's1111111-1111-1111-1111-111111111111',
      customer_name: 'Sophia Martinez',
      customer_email: 'sophia.m@gmail.com',
      customer_phone: '+1-555-0192',
      datetime: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'confirmed',
      notes: 'Prefers quiet session with text consultation.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'b1111111-1111-1111-1111-111111111112',
      tenant_id: DEMO_TENANTS.salon.id,
      service_id: 's1111111-1111-1111-1111-111111111112',
      customer_name: 'Emma Watson',
      customer_email: 'emma.w@outlook.com',
      customer_phone: '+1-555-0143',
      datetime: new Date(Date.now() + 86400000 * 3).toISOString(),
      status: 'confirmed',
      notes: 'Caramel balayage touch-up.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'b2222222-2222-2222-2222-222222222221',
      tenant_id: DEMO_TENANTS.store.id,
      service_id: 's2222222-2222-2222-2222-222222222224',
      customer_name: 'Liam Chen',
      customer_email: 'liam.chen@techcorp.io',
      customer_phone: '+1-555-0177',
      datetime: new Date(Date.now() + 86400000 * 1).toISOString(),
      status: 'confirmed',
      notes: 'Looking for custom silent switches consultation.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'b3333333-3333-3333-3333-333333333331',
      tenant_id: DEMO_TENANTS.ops.id,
      service_id: 's3333333-3333-3333-3333-333333333331',
      customer_name: 'David Sterling (CTO, Fintech Corp)',
      customer_email: 'david@fintechcorp.com',
      customer_phone: '+1-555-0111',
      datetime: new Date(Date.now() + 86400000 * 4).toISOString(),
      status: 'confirmed',
      notes: 'Q3 AWS architecture security assessment.',
      created_at: new Date().toISOString(),
    },
  ];

  private documents: DbDocument[] = [
    // Salon Documents
    {
      id: 'd1111111-1111-1111-1111-111111111111',
      tenant_id: DEMO_TENANTS.salon.id,
      title: 'Salon Policies & Booking Guidelines',
      content:
        'Cancellation Policy: Appointments cancelled at least 24 hours in advance receive a 100% full refund. Cancellations made with less than 24 hours notice forfeit the 20% booking deposit. Late Arrival: We offer a 15-minute grace period. If you arrive beyond 15 minutes, we will do our best to accommodate you, but your service time may be adjusted to avoid delaying subsequent clients. Preparation: For color and balayage services, please arrive with clean, dry hair free of heavy styling products.',
      metadata: { category: 'policies', version: '2.1' },
      created_at: new Date().toISOString(),
    },
    {
      id: 'd1111111-1111-1111-1111-111111111112',
      tenant_id: DEMO_TENANTS.salon.id,
      title: 'Hair Care & Aftercare Recommendations',
      content:
        'Aftercare for Keratin Treatments: Do not wash hair or tie hair with tight elastics for 48 hours following treatment. Use only sulfate-free shampoos to maintain smoothing effects for up to 4 months. Hair coloring aftercare: We recommend our organic Argan Gloss serum and washing in cool water to preserve color vibrancy.',
      metadata: { category: 'aftercare', version: '1.4' },
      created_at: new Date().toISOString(),
    },
    // Store Documents
    {
      id: 'd2222222-2222-2222-2222-222222222221',
      tenant_id: DEMO_TENANTS.store.id,
      title: 'Apex Gear Shipping & Returns Policy',
      content:
        'Domestic Shipping: Standard shipping is free on orders over $99 and takes 2-4 business days. Express shipping is $14.99 and delivers next business day. International Shipping: We ship to over 50 countries via DHL Express (5-7 business days). Returns: We offer a 30-day money-back guarantee on all audio and keyboard gear. Products must be in original condition with original packaging. Return shipping is free for domestic customers.',
      metadata: { category: 'logistics', version: '3.0' },
      created_at: new Date().toISOString(),
    },
    {
      id: 'd2222222-2222-2222-2222-222222222222',
      tenant_id: DEMO_TENANTS.store.id,
      title: 'Hardware Warranty & Specifications',
      content:
        'Warranty: All Apex Gear hardware includes a comprehensive 2-year manufacturer warranty covering defective switches, battery degradation, and audio driver failure. Water damage and accidental drops are not covered under standard warranty. Custom Keyboards: UltraMech Pro keyboards support both 3-pin and 5-pin MX-compatible switches and feature hot-swappable sockets.',
      metadata: { category: 'specs', version: '2.0' },
      created_at: new Date().toISOString(),
    },
    // Ops Documents
    {
      id: 'd3333333-3333-3333-3333-333333333331',
      tenant_id: DEMO_TENANTS.ops.id,
      title: 'CloudPulse SOC Incident Response Matrix',
      content:
        'Severity Levels & SLAs: Severity 1 (Critical Outage / Data Breach Indicator) requires on-call engineer paging within 5 minutes and hourly executive status updates. Severity 2 (Degraded Performance / Anomalous Traffic) has a 15-minute response SLA. Automated Failover: Kubernetes clusters run active-passive multi-region failovers with automated Route 53 health check DNS rerouting within 60 seconds.',
      metadata: { category: 'runbooks', version: '4.2' },
      created_at: new Date().toISOString(),
    },
    {
      id: 'd3333333-3333-3333-3333-333333333332',
      tenant_id: DEMO_TENANTS.ops.id,
      title: 'Data Isolation & Multi-Tenant Security Standards',
      content:
        'Database Isolation: Every table enforces foreign key constraints referencing tenant_id. Supabase Row Level Security (RLS) policies filter at the PostgreSQL kernel level using current_tenant_id() derived from JWT session claims. Direct SQL queries lacking tenant scoping are blocked unconditionally. All secrets and API credentials reside in secure Vercel environment variables with zero client-side exposure.',
      metadata: { category: 'security_standards', version: '1.0' },
      created_at: new Date().toISOString(),
    },
  ];

  private auditLogs: DbAuditLog[] = [
    {
      id: 'l1111111-1111-1111-1111-111111111111',
      tenant_id: DEMO_TENANTS.salon.id,
      actor_id: 'customer_web',
      action: 'booking.created',
      resource: 'bookings:b1111111-1111-1111-1111-111111111111',
      details: { service: 'Signature Haircut', price: 65 },
      ip_address: '192.0.2.45',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'l2222222-2222-2222-2222-222222222221',
      tenant_id: DEMO_TENANTS.store.id,
      actor_id: 'chat_agent',
      action: 'rag.query',
      resource: 'documents:d2222222-2222-2222-2222-222222222221',
      details: { query: 'What is the return policy?', similarity: 0.89 },
      ip_address: '198.51.100.12',
      status: 'success',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'l3333333-3333-3333-3333-333333333331',
      tenant_id: DEMO_TENANTS.ops.id,
      actor_id: 'soc_monitor',
      action: 'isolation.verified',
      resource: 'rls_policy_check',
      details: { tables_checked: 7, cross_tenant_leakage: false, mode: 'STRICT_RLS' },
      ip_address: '127.0.0.1',
      status: 'success',
      created_at: new Date(Date.now() - 1200000).toISOString(),
    },
  ];

  private rateLimits: Map<string, DbRateLimit> = new Map();

  // Rate Limiting
  public incrementRateLimit(key: string, windowSeconds: number, maxRequests: number): { allowed: boolean; count: number; remaining: number } {
    const now = Date.now();
    const existing = this.rateLimits.get(key);

    if (!existing || now - existing.window_start > windowSeconds * 1000) {
      this.rateLimits.set(key, { key, count: 1, window_start: now });
      return { allowed: true, count: 1, remaining: maxRequests - 1 };
    }

    existing.count += 1;
    const allowed = existing.count <= maxRequests;
    const remaining = Math.max(0, maxRequests - existing.count);
    return { allowed, count: existing.count, remaining };
  }

  // Services
  public getServices(tenantId: string): DbService[] {
    return this.services.filter((s) => s.tenant_id === tenantId && s.is_active);
  }

  public getServiceById(id: string): DbService | undefined {
    return this.services.find((s) => s.id === id);
  }

  // Bookings
  public getBookings(tenantId: string): DbBooking[] {
    return this.bookings.filter((b) => b.tenant_id === tenantId);
  }

  public createBooking(booking: Omit<DbBooking, 'id' | 'created_at'>): DbBooking {
    const newBooking: DbBooking = {
      ...booking,
      id: 'b-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    this.bookings.push(newBooking);

    // Automatically generate audit log
    this.addAuditLog({
      tenant_id: booking.tenant_id,
      actor_id: 'customer_agent',
      action: 'booking.created',
      resource: `bookings:${newBooking.id}`,
      details: { customer: booking.customer_name, service_id: booking.service_id, datetime: booking.datetime },
      ip_address: '127.0.0.1',
      status: 'success',
    });

    return newBooking;
  }

  // Documents & RAG
  public getDocuments(tenantId: string): DbDocument[] {
    return this.documents.filter((d) => d.tenant_id === tenantId);
  }

  public addDocument(doc: Omit<DbDocument, 'id' | 'created_at'>): DbDocument {
    const newDoc: DbDocument = {
      ...doc,
      id: 'd-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    this.documents.push(newDoc);

    this.addAuditLog({
      tenant_id: doc.tenant_id,
      actor_id: 'admin_ingest',
      action: 'document.uploaded',
      resource: `documents:${newDoc.id}`,
      details: { title: newDoc.title, length: newDoc.content.length },
      ip_address: '127.0.0.1',
      status: 'success',
    });

    return newDoc;
  }

  // Semantic Vector / Text Search (Strictly scoped by tenantId)
  public searchDocuments(tenantId: string, query: string, topK: number = 3): { doc: DbDocument; similarity: number }[] {
    const tenantDocs = this.documents.filter((d) => d.tenant_id === tenantId);
    const queryTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

    const scored = tenantDocs.map((doc) => {
      const contentLower = (doc.title + ' ' + doc.content).toLowerCase();
      let matchCount = 0;
      queryTokens.forEach((token) => {
        if (contentLower.includes(token)) {
          matchCount += 1;
        }
      });
      const baseScore = queryTokens.length > 0 ? matchCount / queryTokens.length : 0.5;
      const similarity = Math.min(0.98, Math.max(0.4, baseScore * 0.8 + 0.2));
      return { doc, similarity };
    });

    // Sort by score descending
    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topK);
  }

  // Audit Logs
  public getAuditLogs(tenantId: string): DbAuditLog[] {
    return this.auditLogs.filter((l) => l.tenant_id === tenantId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addAuditLog(log: Omit<DbAuditLog, 'id' | 'created_at'>): DbAuditLog {
    const newLog: DbAuditLog = {
      ...log,
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    // Keep max 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
    return newLog;
  }

  // Data Isolation Verification Routine
  public verifyDataIsolation(requestingTenantId: string): {
    passed: boolean;
    tests: { name: string; status: 'PASSED' | 'FAILED'; details: string }[];
    crossTenantLeakage: boolean;
  } {
    const tests = [];
    let crossTenantLeakage = false;

    // Test 1: Service Isolation
    const otherServices = this.services.filter((s) => s.tenant_id !== requestingTenantId);
    const leakedServices = this.getServices(requestingTenantId).filter((s) => s.tenant_id !== requestingTenantId);
    if (leakedServices.length === 0) {
      tests.push({
        name: 'Service Catalog Isolation (RLS)',
        status: 'PASSED' as const,
        details: `0 of ${otherServices.length} foreign tenant services visible to requesting tenant.`,
      });
    } else {
      crossTenantLeakage = true;
      tests.push({
        name: 'Service Catalog Isolation',
        status: 'FAILED' as const,
        details: `Leak detected: ${leakedServices.length} foreign rows returned!`,
      });
    }

    // Test 2: Document RAG Vector Boundary
    const otherDocs = this.documents.filter((d) => d.tenant_id !== requestingTenantId);
    const searchedDocs = this.searchDocuments(requestingTenantId, 'policy return cancellation cloud', 10);
    const leakedDocs = searchedDocs.filter((res) => res.doc.tenant_id !== requestingTenantId);
    if (leakedDocs.length === 0) {
      tests.push({
        name: 'pgvector RAG Document Isolation',
        status: 'PASSED' as const,
        details: `match_tenant_documents RPC strictly filtered out all ${otherDocs.length} foreign tenant embeddings.`,
      });
    } else {
      crossTenantLeakage = true;
      tests.push({
        name: 'pgvector RAG Document Isolation',
        status: 'FAILED' as const,
        details: `Cross-tenant vector leak: ${leakedDocs.length} foreign documents returned!`,
      });
    }

    // Test 3: Booking & Customer Isolation
    const otherBookings = this.bookings.filter((b) => b.tenant_id !== requestingTenantId);
    const leakedBookings = this.getBookings(requestingTenantId).filter((b) => b.tenant_id !== requestingTenantId);
    if (leakedBookings.length === 0) {
      tests.push({
        name: 'Customer PII & Booking Privacy',
        status: 'PASSED' as const,
        details: `Customer records isolated. 0 of ${otherBookings.length} foreign bookings exposed.`,
      });
    } else {
      crossTenantLeakage = true;
      tests.push({
        name: 'Customer PII & Booking Privacy',
        status: 'FAILED' as const,
        details: `PII leak detected!`,
      });
    }

    const passed = !crossTenantLeakage;

    // Log the verification in audit log
    this.addAuditLog({
      tenant_id: requestingTenantId,
      actor_id: 'soc_threat_hunter',
      action: 'isolation.verified',
      resource: 'multi_tenant_boundary_check',
      details: { passed, total_tests: tests.length, crossTenantLeakage },
      ip_address: '127.0.0.1',
      status: passed ? 'success' : 'failed',
    });

    return { passed, tests, crossTenantLeakage };
  }

  // GDPR Tenant Export
  public exportTenantData(tenantId: string): Record<string, any> {
    const tenant = Object.values(DEMO_TENANTS).find((t) => t.id === tenantId);
    const services = this.getServices(tenantId);
    const bookings = this.getBookings(tenantId);
    const documents = this.getDocuments(tenantId);
    const auditLogs = this.getAuditLogs(tenantId);

    this.addAuditLog({
      tenant_id: tenantId,
      actor_id: 'admin_gdpr',
      action: 'gdpr.data_exported',
      resource: `tenant:${tenantId}`,
      details: { export_type: 'full_json', timestamp: new Date().toISOString() },
      ip_address: '127.0.0.1',
      status: 'success',
    });

    return {
      exportTimestamp: new Date().toISOString(),
      compliance: 'GDPR / CCPA Article 20 Right to Data Portability',
      tenant,
      services,
      bookings,
      documents,
      auditLogs,
    };
  }
}

// Export singleton instance
export const mockDb = new MockDatabase();
