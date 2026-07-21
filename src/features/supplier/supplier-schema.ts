import { z } from 'zod';

export const supplierSchema = z.object({
  supplier_code: z
    .string()
    .min(2, 'Supplier code is required')
    .max(20, 'Supplier code must be less than 20 characters'),

  supplier_name: z
    .string()
    .min(2, 'Supplier name must be at least 2 characters'),

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

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  status: z.enum(['Active', 'Inactive']),
});

export type SupplierSchema = z.infer<typeof supplierSchema>;