-- ==============================================================================
-- BizOS: Multi-Tenant SaaS PostgreSQL + pgvector Schema
-- Complete DDL with Row Level Security (RLS), Vector Search, and Auth Sync
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    vertical_type TEXT NOT NULL CHECK (vertical_type IN ('salon', 'ecommerce', 'ops', 'custom')),
    branding_config JSONB NOT NULL DEFAULT '{
        "primaryColor": "#6366f1",
        "secondaryColor": "#4f46e5",
        "accentColor": "#ec4899",
        "logoUrl": "",
        "brandName": "BizOS Tenant",
        "tagline": "Modern Business Solution",
        "themeMode": "dark"
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Users Table (Tenant-scoped profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('superadmin', 'tenant_admin', 'tenant_staff', 'customer')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Services Table (Booking Module)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    duration INTEGER NOT NULL DEFAULT 30, -- duration in minutes
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookings Table (Appointments & Orders)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    datetime TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Documents Table (RAG Vector Knowledge Base with Gemini 768-dim)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(768), -- Gemini text-embedding-004 output dimension
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector Index (Cosine distance)
CREATE INDEX IF NOT EXISTS documents_embedding_idx 
ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 7. Chat Logs Table
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    sources JSONB DEFAULT '[]'::jsonb,
    action_taken JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit Logs Table (SOC / Threat Hunting Monitoring)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id TEXT DEFAULT 'system',
    action TEXT NOT NULL, -- 'booking.created', 'rag.query', 'doc.upload', 'auth.login', etc.
    resource TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'denied', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Persistent Serverless Rate Limits Table
CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rate_limits_window_idx ON rate_limits(window_start);

-- ==============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Helper to extract tenant_id from authenticated session JWT
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'tenant_id', '')::UUID;
$$ LANGUAGE SQL STABLE;

-- Trigger to synchronize tenant_id and role to Supabase auth.users raw_app_meta_data
CREATE OR REPLACE FUNCTION sync_user_tenant_metadata()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.auth_user_id IS NOT NULL THEN
        UPDATE auth.users
        SET raw_app_meta_data = 
            coalesce(raw_app_meta_data, '{}'::jsonb) || 
            jsonb_build_object('tenant_id', NEW.tenant_id::text, 'role', NEW.role)
        WHERE id = NEW.auth_user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_user_tenant ON users;
CREATE TRIGGER trg_sync_user_tenant
AFTER INSERT OR UPDATE OF tenant_id, role, auth_user_id ON users
FOR EACH ROW EXECUTE FUNCTION sync_user_tenant_metadata();

-- Atomic Rate Limit Increment Function
CREATE OR REPLACE FUNCTION increment_rate_limit(
    p_key TEXT,
    p_window_seconds INT,
    p_max_requests INT
)
RETURNS TABLE (
    allowed BOOLEAN,
    current_count INT,
    remaining INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_now TIMESTAMPTZ := NOW();
    v_record RECORD;
BEGIN
    -- Delete expired windows
    DELETE FROM rate_limits 
    WHERE key = p_key AND window_start < v_now - (p_window_seconds || ' seconds')::INTERVAL;

    -- Upsert current rate limit record
    INSERT INTO rate_limits (key, count, window_start)
    VALUES (p_key, 1, v_now)
    ON CONFLICT (key) DO UPDATE
    SET count = rate_limits.count + 1
    RETURNING rate_limits.count INTO v_record;

    IF v_record.count > p_max_requests THEN
        RETURN QUERY SELECT FALSE, v_record.count, 0;
    ELSE
        RETURN QUERY SELECT TRUE, v_record.count, (p_max_requests - v_record.count);
    END IF;
END;
$$;

-- RAG Vector Search RPC Function with STRICT Tenant Isolation
CREATE OR REPLACE FUNCTION match_tenant_documents(
    query_embedding VECTOR(768),
    match_threshold FLOAT,
    match_count INT,
    filter_tenant_id UUID
)
RETURNS TABLE (
    id UUID,
    tenant_id UUID,
    title TEXT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.tenant_id,
        d.title,
        d.content,
        d.metadata,
        (1 - (d.embedding <=> query_embedding))::FLOAT AS similarity
    FROM documents d
    WHERE d.tenant_id = filter_tenant_id
      AND 1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- 1. Tenants Policies
CREATE POLICY "Public can view tenants" ON tenants
    FOR SELECT USING (true);

-- 2. Services Policies
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Tenant admin manages services" ON services
    FOR ALL USING (tenant_id = current_tenant_id());

-- 3. Bookings Policies
CREATE POLICY "Public can create bookings" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tenant admin manages bookings" ON bookings
    FOR ALL USING (tenant_id = current_tenant_id());

-- 4. Documents Policies
CREATE POLICY "Tenant admin manages documents" ON documents
    FOR ALL USING (tenant_id = current_tenant_id());

-- 5. Chat Logs Policies
CREATE POLICY "Public can insert chat logs" ON chat_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tenant admin views chat logs" ON chat_logs
    FOR SELECT USING (tenant_id = current_tenant_id());

-- 6. Audit Logs Policies
CREATE POLICY "Public/App can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Tenant admin views audit logs" ON audit_logs
    FOR SELECT USING (tenant_id = current_tenant_id());

-- 7. Rate Limits Policy
CREATE POLICY "Allow server to access rate limits" ON rate_limits
    FOR ALL USING (true) WITH CHECK (true);
