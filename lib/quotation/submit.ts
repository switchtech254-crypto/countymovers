'use server';

import { z } from 'zod';
import { quotationSchema } from './schema';

const inputSchema = z.object({
  requestId: z.string().uuid(),
  quote: quotationSchema,
  website: z.string().max(0), // honeypot: must stay empty
});

export async function submitQuotation(input: z.infer<typeof inputSchema>) {
  // Server action arguments are untrusted, so validate them again here.
  const data = inputSchema.parse(input);

  // TODO(supabase): persist the request here. Insert into `quotation_requests`:
  //   id: data.requestId, client_name: data.quote.name, phone: data.quote.phone,
  //   email: data.quote.email, move_type: data.quote.moveType, details: data.quote
  // Treat Postgres error code '23505' (duplicate id) as success so retries are idempotent.
  console.log('[quotation] received (not persisted yet):', data.requestId);

  return { reference: `CM-${data.requestId.toUpperCase()}` };
}