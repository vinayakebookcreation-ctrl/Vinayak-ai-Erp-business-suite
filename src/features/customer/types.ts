export type Customer = {
  id: string;

  customer_code: string;
  customer_name: string;
  contact_person?: string;

  email?: string;
  phone?: string;

  gst_number?: string;

  billing_address?: string;
  shipping_address?: string;

  city?: string;
  state?: string;

  credit_limit: number;

  status: 'Active' | 'Inactive';

  created_at?: string;
  updated_at?: string;
};