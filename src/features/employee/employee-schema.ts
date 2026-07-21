import { z } from 'zod';

export const employeeSchema = z.object({
  company_id: z.string().min(1, 'Please select a company'),

  branch_id: z.string().min(1, 'Please select a branch'),

  employee_code: z
    .string()
    .min(2, 'Employee code is required')
    .max(20, 'Employee code must be less than 20 characters'),

  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters'),

  last_name: z.string().optional(),

  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  phone: z.string().optional(),

  department: z.string().optional(),

  designation: z.string().optional(),

  joining_date: z.string().optional(),

  salary: z.coerce.number().min(0, 'Salary must be positive'),

  status: z.enum(['Active', 'Inactive']),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;