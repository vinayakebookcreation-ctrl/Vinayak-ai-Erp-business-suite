import { z } from 'zod';

export const productSchema = z.object({
  sku: z
    .string()
    .min(2, 'SKU is required')
    .max(30, 'SKU must be less than 30 characters'),

  product_name: z
    .string()
    .min(2, 'Product name is required'),

  category_id: z.string().uuid('Please select a category'),

  brand_id: z.string().uuid('Please select a brand'),

  unit_id: z.string().uuid('Please select a unit'),

  hsn_code: z.string().optional(),

  purchase_price: z.coerce
    .number()
    .min(0, 'Purchase price cannot be negative'),

  sale_price: z.coerce
    .number()
    .min(0, 'Sale price cannot be negative'),

  opening_stock: z.coerce
    .number()
    .min(0, 'Opening stock cannot be negative'),

  current_stock: z.coerce
    .number()
    .min(0, 'Current stock cannot be negative'),

  reorder_level: z.coerce
    .number()
    .min(0, 'Reorder level cannot be negative'),

  description: z.string().optional(),

  status: z.enum(['Active', 'Inactive']),
});

export type ProductSchema = z.infer<typeof productSchema>;