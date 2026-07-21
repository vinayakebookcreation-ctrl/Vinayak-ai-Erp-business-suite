export type Supplier = {
  id: string;

  supplier_code: string;
  supplier_name: string;
  contact_person?: string;

  email?: string;
  phone?: string;

  gst_number?: string;

  address?: string;
  city?: string;
  state?: string;

  status: 'Active' | 'Inactive';

  created_at?: string;
  updated_at?: string;
};