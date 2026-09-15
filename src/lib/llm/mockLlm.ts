import { LlmRequestOptions, LlmResponse } from './adapter';

export async function callMockLlm(options: LlmRequestOptions): Promise<LlmResponse> {
  const { systemPrompt, userMessage } = options;
  const userLower = userMessage.toLowerCase();

  // 1. Detect Booking Intent for Agent Action Layer
  const isBookingIntent =
    userLower.includes('book') ||
    userLower.includes('schedule') ||
    userLower.includes('appointment') ||
    userLower.includes('reserve');

  if (isBookingIntent) {
    // Extract potential customer name or service
    const defaultDate = new Date(Date.now() + 86400000 * 2).toISOString();
    let serviceName = 'Signature Service';

    if (userLower.includes('haircut') || userLower.includes('styling')) {
      serviceName = 'Signature Haircut & Blowout';
    } else if (userLower.includes('balayage') || userLower.includes('color')) {
      serviceName = 'Balayage & Dimensional Color';
    } else if (userLower.includes('keyboard') || userLower.includes('consultation')) {
      serviceName = 'Hardware Customization Consultation';
    } else if (userLower.includes('audit') || userLower.includes('cloud') || userLower.includes('soc')) {
      serviceName = 'Cloud Infrastructure Health Audit';
    }

    return {
      content: `I would be happy to schedule that for you! I have initiated your booking for "${serviceName}".`,
      toolCalls: [
        {
          name: 'create_booking',
          arguments: {
            service_name: serviceName,
            customer_name: 'Visitor Demo Client',
            customer_email: 'client@demouser.io',
            datetime: defaultDate,
            notes: 'Generated via BizOS Conversational Agent Action Layer',
          },
        },
      ],
      providerUsed: 'mock',
    };
  }

  // 2. Strict Grounding Logic from Retrieved Context
  const contextIndex = systemPrompt.indexOf('--- RETRIEVED CONTEXT ---');
  const servicesIndex = systemPrompt.indexOf('--- AVAILABLE SERVICES / CATALOG ---');
  const contextBlock = contextIndex !== -1 ? systemPrompt.substring(contextIndex, servicesIndex) : '';

  // Specific semantic matching against retrieved knowledge
  if (userLower.includes('cancel') || userLower.includes('cancellation') || userLower.includes('refund')) {
    if (contextBlock.toLowerCase().includes('cancellation policy')) {
      return {
        content:
          'Based on our records: Appointments cancelled at least 24 hours in advance receive a 100% full refund. Cancellations made with less than 24 hours notice forfeit the 20% booking deposit. We also provide a 15-minute grace period for late arrivals.',
        providerUsed: 'mock',
      };
    } else if (contextBlock.toLowerCase().includes('returns')) {
      return {
        content:
          'According to our store policy: We offer a 30-day money-back guarantee on all audio and keyboard gear. Products must be in original condition with original packaging. Domestic return shipping is completely free.',
        providerUsed: 'mock',
      };
    }
  }

  if (userLower.includes('return') || userLower.includes('shipping') || userLower.includes('delivery')) {
    if (contextBlock.toLowerCase().includes('shipping')) {
      return {
        content:
          'Domestic standard shipping is free on orders over $99 (delivering in 2-4 business days), with Express next-day shipping available for $14.99. We also ship internationally to over 50 countries via DHL Express (5-7 business days).',
        providerUsed: 'mock',
      };
    }
  }

  if (userLower.includes('warranty') || userLower.includes('guarantee')) {
    if (contextBlock.toLowerCase().includes('warranty')) {
      return {
        content:
          'All Apex Gear hardware is backed by our comprehensive 2-year manufacturer warranty covering defective switches, battery degradation, and audio driver failure.',
        providerUsed: 'mock',
      };
    }
  }

  if (userLower.includes('keratin') || userLower.includes('aftercare') || userLower.includes('shampoo')) {
    if (contextBlock.toLowerCase().includes('aftercare')) {
      return {
        content:
          'For Keratin treatment aftercare: Do not wash hair or tie hair with tight elastics for 48 hours following treatment. Only use sulfate-free shampoos to maintain results for up to 4 months.',
        providerUsed: 'mock',
      };
    }
  }

  if (userLower.includes('sla') || userLower.includes('incident') || userLower.includes('severity') || userLower.includes('failover')) {
    if (contextBlock.toLowerCase().includes('severity')) {
      return {
        content:
          'Per CloudPulse SOC guidelines: Severity 1 requires on-call paging within 5 minutes and hourly status updates. Severity 2 carries a 15-minute SLA. Automated failover switches DNS across regions within 60 seconds.',
        providerUsed: 'mock',
      };
    }
  }

  if (userLower.includes('isolation') || userLower.includes('rls') || userLower.includes('security') || userLower.includes('tenant')) {
    if (contextBlock.toLowerCase().includes('isolation')) {
      return {
        content:
          'BizOS enforces strict multi-tenant isolation: every table contains a tenant_id foreign key, and PostgreSQL Row Level Security (RLS) policies filter at the database kernel level using current_tenant_id(). Cross-tenant data leakage is structurally impossible.',
        providerUsed: 'mock',
      };
    }
  }

  if (userLower.includes('service') || userLower.includes('price') || userLower.includes('cost') || userLower.includes('how much')) {
    return {
      content:
        'Here are our available options from our catalog:\n' +
        systemPrompt.substring(servicesIndex).replace('--- AVAILABLE SERVICES / CATALOG ---\n', '') +
        '\nWould you like me to book any of these for you?',
      providerUsed: 'mock',
    };
  }

  // 3. Fallback: Strict refusal if information is absent from context
  return {
    content:
      'I do not have that information in my knowledge base. Please contact our support team or concierge directly so we can assist you.',
    providerUsed: 'mock',
  };
}
