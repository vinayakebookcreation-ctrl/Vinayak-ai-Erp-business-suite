export type Employee = {
  id: string;

  company_id: string;
  branch_id: string;

  employee_code: string;

  first_name: string;
  last_name?: string;

  email?: string;
  phone?: string;

  department?: string;
  designation?: string;

  joining_date?: string;
  salary?: number;

  status: 'Active' | 'Inactive';

  created_at?: string;
  updated_at?: string;

  // joined data
  companies?: {
    company_name: string;
  };

  branches?: {
    branch_name: string;
  };
};