import { z } from 'zod';

export const salesItemSchema = z.object({
  product_id: z.string().uuid('Please select a product'),

  quantity: z.coerce
    .number()
    .min(0.01, 'Quantity must be greater than 0'),

  sale_price: z.coerce
    .number()
    .min(0, 'Sale price cannot be negative'),

  gst_percent: z.coerce
    .number()
    .min(0)
    .max(28),
});

export const salesSchema = z.object({
  invoice_number: z
    .string()
    .min(3, 'Invoice number is required'),

  customer_id: z.string().uuid('Please select a customer'),

  invoice_date: z.string().min(1, 'Invoice date is required'),

  discount_amount: z.coerce
    .number()
    .min(0)
    .default(0),

  other_charges: z.coerce
    .number()
    .min(0)
    .default(0),

  notes: z.string().optional(),

  payment_status: z.enum([
    'Pending',
    'Partial',
    'Paid',
  ]),

  status: z.enum([
    'Draft',
    'Confirmed',
    'Cancelled',
  ]),

  items: z
    .array(salesItemSchema)
    .min(1, 'Add at least one product'),
});

export type SalesSchema = z.infer<typeof salesSchema>;
export type SalesItemSchema = z.infer<typeof salesItemSchema>;