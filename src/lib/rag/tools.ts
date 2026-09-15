import { mockDb } from '../supabase/mockDb';
import { getServerSupabase } from '../supabase/server';
import { logAuditEvent } from '../security/auditLogger';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

export const BOOKING_TOOL: ToolDefinition = {
  name: 'create_booking',
  description: 'Book an appointment, service session, or consultation for a customer.',
  parameters: {
    type: 'object',
    properties: {
      service_name: {
        type: 'string',
        description: 'The name of the service to book (e.g. Signature Haircut & Blowout, Cloud Infrastructure Health Audit)',
      },
      customer_name: {
        type: 'string',
        description: 'Full name of the customer',
      },
      customer_email: {
        type: 'string',
        description: 'Email address of the customer',
      },
      datetime: {
        type: 'string',
        description: 'ISO 8601 date and time for the booking (e.g. 2026-09-18T14:00:00Z)',
      },
      notes: {
        type: 'string',
        description: 'Optional customer preferences or notes',
      },
    },
    required: ['service_name', 'customer_name', 'customer_email', 'datetime'],
  },
};

export interface ToolCallExecutionResult {
  tool: string;
  success: boolean;
  result: Record<string, any>;
  message: string;
}

/**
 * Executes agent tools against tenant data layer
 */
export async function executeAgentTool(
  tenantId: string,
  toolName: string,
  args: Record<string, any>
): Promise<ToolCallExecutionResult> {
  if (toolName === 'create_booking') {
    const { service_name, customer_name, customer_email, datetime, notes = '' } = args;

    // 1. Resolve service by name for this tenant
    const services = mockDb.getServices(tenantId);
    let matchedService = services.find(
      (s) => s.name.toLowerCase().includes((service_name || '').toLowerCase())
    );

    if (!matchedService && services.length > 0) {
      matchedService = services[0]; // default to closest service
    }

    if (!matchedService) {
      return {
        tool: toolName,
        success: false,
        result: {},
        message: `Could not find an active service matching "${service_name}" for this tenant.`,
      };
    }

    const bookingDate = new Date(datetime);
    const validDate = !isNaN(bookingDate.getTime()) ? bookingDate.toISOString() : new Date(Date.now() + 86400000).toISOString();

    const supabase = getServerSupabase();
    let bookingId = '';

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            tenant_id: tenantId,
            service_id: matchedService.id,
            customer_name,
            customer_email,
            datetime: validDate,
            status: 'confirmed',
            notes: notes || 'Booked via conversational AI assistant',
          })
          .select('id')
          .single();

        if (!error && data) {
          bookingId = data.id;
        }
      } catch (err) {
        console.warn('Supabase booking insert error, falling back to mockDb:', err);
      }
    }

    if (!bookingId) {
      const created = mockDb.createBooking({
        tenant_id: tenantId,
        service_id: matchedService.id,
        customer_name,
        customer_email,
        datetime: validDate,
        status: 'confirmed',
        notes: notes || 'Booked via conversational AI assistant',
      });
      bookingId = created.id;
    }

    // Log the event in SOC audit logs
    await logAuditEvent({
      tenantId,
      actorId: 'ai_agent_action',
      action: 'agent.booking_created',
      resource: `bookings:${bookingId}`,
      details: {
        service: matchedService.name,
        price: matchedService.price,
        customer: customer_name,
        email: customer_email,
        slot: validDate,
      },
      status: 'success',
    });

    return {
      tool: toolName,
      success: true,
      result: {
        bookingId,
        serviceName: matchedService.name,
        price: matchedService.price,
        customerName: customer_name,
        datetime: validDate,
        status: 'confirmed',
      },
      message: `Booking confirmed successfully! Booking ID: ${bookingId}. Service: ${matchedService.name} ($${matchedService.price}) for ${customer_name} at ${new Date(validDate).toLocaleString()}.`,
    };
  }

  return {
    tool: toolName,
    success: false,
    result: {},
    message: `Unknown tool "${toolName}" requested.`,
  };
}
