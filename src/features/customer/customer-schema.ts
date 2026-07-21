import { z } from 'zod';

export const customerSchema = z.object({
  customer_code: z
    .string()
    .min(2, 'Customer code is required')
    .max(20, 'Customer code must be less than 20 characters'),

  customer_name: z
    .string()
    .min(2, 'Customer name must be at least 2 characters'),

  contact_person: z.string().optional(),

  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  phone: z.string().optional(),

  gst_number: z
    .string()
    .max(15, 'GST number must be 15 characters')
    .optional(),

  billing_address: z.string().optional(),

  shipping_address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  credit_limit: z.coerce.number().min(0, 'Credit limit cannot be negative'),

  status: z.enum(['Active', 'Inactive']),
});

export type CustomerSchema = z.infer<typeof customerSchema>;
