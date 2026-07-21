import { z } from 'zod';

export const branchSchema = z.object({
  company_id: z.string().min(1, 'Please select a company'),

  branch_name: z
    .string()
    .min(2, 'Branch name must be at least 2 characters'),

  branch_code: z
    .string()
    .min(2, 'Branch code is required')
    .max(10, 'Branch code must be less than 10 characters'),

  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  phone: z.string().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),

  status: z.enum(['Active', 'Inactive']),
});

export type BranchSchema = z.infer<typeof branchSchema>;