export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  brandName: string;
  tagline: string;
  themeMode: 'dark' | 'light';
  currency: string;
  supportEmail: string;
}

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  verticalType: 'salon' | 'ecommerce' | 'ops' | 'custom';
  branding: BrandingConfig;
  features: {
    bookingModule: boolean;
    ragAgent: boolean;
    securityAudit: boolean;
    productCatalog: boolean;
    telemetry: boolean;
  };
  adminEmail: string;
}

export const DEMO_TENANTS: Record<string, TenantConfig> = {
  salon: {
    id: '11111111-1111-1111-1111-111111111111',
    slug: 'salon',
    name: 'Glamour Haven Salon & Spa',
    verticalType: 'salon',
    adminEmail: 'admin@glamourhaven.com',
    branding: {
      primaryColor: '#f43f5e',
      secondaryColor: '#e11d48',
      accentColor: '#fda4af',
      brandName: 'Glamour Haven',
      tagline: 'Luxury Hair Care & Bespoke Styling',
      themeMode: 'dark',
      currency: '$',
      supportEmail: 'concierge@glamourhaven.com',
    },
    features: {
      bookingModule: true,
      ragAgent: true,
      securityAudit: false,
      productCatalog: false,
      telemetry: false,
    },
  },
  store: {
    id: '22222222-2222-2222-2222-222222222222',
    slug: 'store',
    name: 'Apex Gear Tech Store',
    verticalType: 'ecommerce',
    adminEmail: 'admin@apexgear.com',
    branding: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      accentColor: '#34d399',
      brandName: 'Apex Gear',
      tagline: 'Next-Gen Pro Audio & Desk Peripherals',
      themeMode: 'dark',
      currency: '$',
      supportEmail: 'support@apexgear.com',
    },
    features: {
      bookingModule: true,
      ragAgent: true,
      securityAudit: false,
      productCatalog: true,
      telemetry: false,
    },
  },
  ops: {
    id: '33333333-3333-3333-3333-333333333333',
    slug: 'ops',
    name: 'CloudPulse SaaS Ops & SOC',
    verticalType: 'ops',
    adminEmail: 'admin@cloudpulse.io',
    branding: {
      primaryColor: '#6366f1',
      secondaryColor: '#4f46e5',
      accentColor: '#818cf8',
      brandName: 'CloudPulse Ops',
      tagline: 'Autonomous Cloud Telemetry & Threat Hunting',
      themeMode: 'dark',
      currency: '$',
      supportEmail: 'security@cloudpulse.io',
    },
    features: {
      bookingModule: true,
      ragAgent: true,
      securityAudit: true,
      productCatalog: false,
      telemetry: true,
    },
  },
};

export function getTenantBySlug(slug: string): TenantConfig | undefined {
  return DEMO_TENANTS[slug.toLowerCase()];
}

export function getTenantById(id: string): TenantConfig | undefined {
  return Object.values(DEMO_TENANTS).find((t) => t.id === id);
}

export function getAllTenants(): TenantConfig[] {
  return Object.values(DEMO_TENANTS);
}
