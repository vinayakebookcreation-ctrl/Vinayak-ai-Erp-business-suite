import { z } from 'zod';

export const companySchema = z.object({
  company_name: z
    .string()
    .min(2, 'Company name must be at least 2 characters'),

  legal_name: z.string().optional(),

  gst_number: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/,
      'Invalid GST number'
    )
    .optional()
    .or(z.literal('')),

  pan_number: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      'Invalid PAN number'
    )
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  phone: z.string().optional(),

  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),

  // 👇 defaults remove kiye
  country: z.string().optional(),
  pincode: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),

  status: z.enum(['Active', 'Inactive']),
});

export type CompanySchema = z.infer<typeof companySchema>;