import { z } from 'zod';

export const purchaseItemSchema = z.object({
  product_id: z.string().uuid('Please select a product'),

  quantity: z.coerce
    .number()
    .min(0.01, 'Quantity must be greater than 0'),

  purchase_price: z.coerce
    .number()
    .min(0, 'Purchase price cannot be negative'),

  gst_percent: z.coerce
    .number()
    .min(0)
    .max(28),
});

export const purchaseSchema = z.object({
  po_number: z
    .string()
    .min(3, 'PO number is required'),

  supplier_id: z.string().uuid('Please select a supplier'),

  purchase_date: z.string().min(1, 'Purchase date is required'),

  other_charges: z.coerce
    .number()
    .min(0)
    .default(0),

  notes: z.string().optional(),

  status: z.enum([
    'Draft',
    'Ordered',
    'Received',
    'Cancelled',
  ]),

  items: z
    .array(purchaseItemSchema)
    .min(1, 'Add at least one product'),
});

export type PurchaseSchema = z.infer<typeof purchaseSchema>;
export type PurchaseItemSchema = z.infer<typeof purchaseItemSchema>;