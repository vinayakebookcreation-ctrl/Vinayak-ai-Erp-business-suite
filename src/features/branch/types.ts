export type Branch = {
  id: string;
  company_id: string;

  branch_name: string;
  branch_code: string;

  email?: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;

  status: 'Active' | 'Inactive';

  created_at?: string;
  updated_at?: string;

  // joined company data
  companies?: {
    company_name: string;
  };
};