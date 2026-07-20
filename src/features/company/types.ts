export type CompanyStatus = 'Active' | 'Inactive';

export interface Company {
  id: string;
  company_name: string;
  legal_name?: string | null;
  gst_number?: string | null;
  pan_number?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  timezone?: string | null;
  currency?: string | null;
  status: CompanyStatus;
  created_at?: string;
  updated_at?: string;
}