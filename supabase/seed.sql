-- ==============================================================================
-- BizOS: Seed Data for 3 Demo Verticals (Salon, Store, Ops)
-- ==============================================================================

-- 1. Insert 3 Demo Tenants
INSERT INTO tenants (id, slug, name, vertical_type, branding_config) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'salon',
    'Glamour Haven Salon & Spa',
    'salon',
    '{
        "primaryColor": "#f43f5e",
        "secondaryColor": "#e11d48",
        "accentColor": "#fda4af",
        "logoUrl": "/icons/salon-logo.svg",
        "brandName": "Glamour Haven",
        "tagline": "Luxury Hair Care & Bespoke Styling",
        "themeMode": "dark",
        "currency": "$",
        "supportEmail": "concierge@glamourhaven.com"
    }'::jsonb
),
(
    '22222222-2222-2222-2222-222222222222',
    'store',
    'Apex Gear Tech Store',
    'ecommerce',
    '{
        "primaryColor": "#10b981",
        "secondaryColor": "#059669",
        "accentColor": "#34d399",
        "logoUrl": "/icons/store-logo.svg",
        "brandName": "Apex Gear",
        "tagline": "Next-Gen Pro Audio & Desk Peripherals",
        "themeMode": "dark",
        "currency": "$",
        "supportEmail": "support@apexgear.com"
    }'::jsonb
),
(
    '33333333-3333-3333-3333-333333333333',
    'ops',
    'CloudPulse SaaS Ops & SOC',
    'ops',
    '{
        "primaryColor": "#6366f1",
        "secondaryColor": "#4f46e5",
        "accentColor": "#818cf8",
        "logoUrl": "/icons/ops-logo.svg",
        "brandName": "CloudPulse Ops",
        "tagline": "Autonomous Cloud Telemetry & SOC Threat Hunting",
        "themeMode": "dark",
        "currency": "$",
        "supportEmail": "security@cloudpulse.io"
    }'::jsonb
)
ON CONFLICT (slug) DO UPDATE
SET branding_config = EXCLUDED.branding_config;

-- 2. Insert Demo Admin Users
INSERT INTO users (id, tenant_id, email, full_name, role) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin@glamourhaven.com', 'Elena Rostova', 'tenant_admin'),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'admin@apexgear.com', 'Marcus Vance', 'tenant_admin'),
('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'admin@cloudpulse.io', 'DevOps Team Lead', 'tenant_admin')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Services for Tenant A: Salon
INSERT INTO services (id, tenant_id, name, description, price, duration, is_active) VALUES
('s1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Signature Haircut & Blowout', 'Precision cut customized to face shape, includes clarifying shampoo & styling.', 65.00, 45, true),
('s1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Balayage & Dimensional Color', 'Hand-painted sun-kissed dimension with bonding treatment & gloss toner.', 180.00, 120, true),
('s1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Keratin Silk Smoothing Treatment', 'Frizz-free restructuring treatment lasting up to 4 months with deep shine.', 220.00, 150, true),
('s1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'Hydrating Scalp Spa & Massage', 'Detoxifying scalp scrub, organic essential oil steam, and tension-relief massage.', 50.00, 30, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Services for Tenant B: Store
INSERT INTO services (id, tenant_id, name, description, price, duration, is_active) VALUES
('s2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'UltraMech Pro Mechanical Keyboard', 'Hot-swappable switches, gasket-mounted sound damping, CNC aluminum casing.', 149.00, 1, true),
('s2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Quantum ANC Studio Headset', 'Active hybrid noise cancelling, 40mm planar magnetic drivers, 50h battery.', 229.00, 1, true),
('s2222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Apex Studio Cardioid Microphone', 'Broadcast-grade 192kHz/24bit microphone with built-in shock mount & DSP.', 119.00, 1, true),
('s2222222-2222-2222-2222-222222222224', '22222222-2222-2222-2222-222222222222', 'Hardware Customization Consultation', '1-on-1 virtual consultation with a mechanical engineer for custom desk gear.', 45.00, 30, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Services for Tenant C: Ops
INSERT INTO services (id, tenant_id, name, description, price, duration, is_active) VALUES
('s3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Cloud Infrastructure Health Audit', 'Comprehensive scan for security holes, AWS/GCP cost leakage, and IAM over-privileges.', 499.00, 60, true),
('s3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Monthly SOC Incident Response Retainer', '24/7 dedicated telemetry triage and guaranteed 15-minute response SLA.', 1200.00, 30, true),
('s3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'SOC 2 Type II Readiness Sprint', 'Architecture hardening, policy drafting, and automated evidence collector setup.', 2500.00, 90, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Demo Bookings for Salon
INSERT INTO bookings (id, tenant_id, service_id, customer_name, customer_email, customer_phone, datetime, status, notes) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Sophia Martinez', 'sophia.m@gmail.com', '+1-555-0192', NOW() + INTERVAL '1 day 4 hours', 'confirmed', 'Prefers quiet session with text consultation.'),
('b1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111112', 'Emma Watson', 'emma.w@outlook.com', '+1-555-0143', NOW() + INTERVAL '2 days 6 hours', 'confirmed', 'Caramel balayage touch-up.'),
('b1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111114', 'Chloe Bennett', 'chloe.b@icloud.com', '+1-555-0188', NOW() - INTERVAL '1 day', 'completed', 'Hydrating treatment completed successfully.')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Demo Documents for RAG (Salon, Store, Ops Knowledge Bases)
INSERT INTO documents (id, tenant_id, title, content, metadata) VALUES
(
    'd1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Salon Policies & Booking Guidelines',
    'Cancellation Policy: Appointments cancelled at least 24 hours in advance receive a 100% full refund. Cancellations made with less than 24 hours notice forfeit the 20% booking deposit. Late Arrival: We offer a 15-minute grace period. If you arrive beyond 15 minutes, we will do our best to accommodate you, but your service time may be adjusted to avoid delaying subsequent clients. Preparation: For color and balayage services, please arrive with clean, dry hair free of heavy styling products.',
    '{"category": "policies", "version": "2.1"}'::jsonb
),
(
    'd1111111-1111-1111-1111-111111111112',
    '11111111-1111-1111-1111-111111111111',
    'Hair Care & Aftercare Recommendations',
    'Aftercare for Keratin Treatments: Do not wash hair or tie hair with tight elastics for 48 hours following treatment. Use only sulfate-free shampoos to maintain smoothing effects for up to 4 months. Hair coloring aftercare: We recommend our organic Argan Gloss serum and washing in cool water to preserve color vibrancy.',
    '{"category": "aftercare", "version": "1.4"}'::jsonb
),
(
    'd2222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    'Apex Gear Shipping & Returns Policy',
    'Domestic Shipping: Standard shipping is free on orders over $99 and takes 2-4 business days. Express shipping is $14.99 and delivers next business day. International Shipping: We ship to over 50 countries via DHL Express (5-7 business days). Returns: We offer a 30-day money-back guarantee on all audio and keyboard gear. Products must be in original condition with original packaging. Return shipping is free for domestic customers.',
    '{"category": "logistics", "version": "3.0"}'::jsonb
),
(
    'd2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Hardware Warranty & Specifications',
    'Warranty: All Apex Gear hardware includes a comprehensive 2-year manufacturer warranty covering defective switches, battery degradation, and audio driver failure. Water damage and accidental drops are not covered under standard warranty. Custom Keyboards: UltraMech Pro keyboards support both 3-pin and 5-pin MX-compatible switches and feature hot-swappable sockets.',
    '{"category": "specs", "version": "2.0"}'::jsonb
),
(
    'd3333333-3333-3333-3333-333333333331',
    '33333333-3333-3333-3333-333333333333',
    'CloudPulse SOC Incident Response Matrix',
    'Severity Levels & SLAs: Severity 1 (Critical Outage / Data Breach Indicator) requires on-call engineer paging within 5 minutes and hourly executive status updates. Severity 2 (Degraded Performance / Anomalous Traffic) has a 15-minute response SLA. Automated Failover: Kubernetes clusters run active-passive multi-region failovers with automated Route 53 health check DNS rerouting within 60 seconds.',
    '{"category": "runbooks", "version": "4.2"}'::jsonb
),
(
    'd3333333-3333-3333-3333-333333333332',
    '33333333-3333-3333-3333-333333333333',
    'Data Isolation & Multi-Tenant Security Standards',
    'Database Isolation: Every table enforces foreign key constraints referencing tenant_id. Supabase Row Level Security (RLS) policies filter at the PostgreSQL kernel level using current_tenant_id() derived from JWT session claims. Direct SQL queries lacking tenant scoping are blocked unconditionally. All secrets and API credentials reside in secure Vercel environment variables with zero client-side exposure.',
    '{"category": "security_standards", "version": "1.0"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Demo Audit Logs for SOC Dashboard
INSERT INTO audit_logs (id, tenant_id, actor_id, action, resource, details, ip_address, status, created_at) VALUES
('l1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'customer_web', 'booking.created', 'bookings:b1111111-1111-1111-1111-111111111111', '{"service": "Signature Haircut", "price": 65}'::jsonb, '192.0.2.45', 'success', NOW() - INTERVAL '3 hours'),
('l2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'chat_agent', 'rag.query', 'documents:d2222222-2222-2222-2222-222222222221', '{"query": "What is the return policy?", "similarity": 0.89}'::jsonb, '198.51.100.12', 'success', NOW() - INTERVAL '1 hour'),
('l3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'soc_monitor', 'isolation.verified', 'rls_policy_check', '{"tables_checked": 7, "leakage_detected": false, "isolation": "STRICT_RLS"}'::jsonb, '127.0.0.1', 'success', NOW() - INTERVAL '20 minutes'),
('l3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'anon_attacker', 'auth.failed', 'admin_login', '{"email": "root@cloudpulse.io", "reason": "invalid_credentials"}'::jsonb, '203.0.113.88', 'denied', NOW() - INTERVAL '10 minutes')
ON CONFLICT (id) DO NOTHING;
