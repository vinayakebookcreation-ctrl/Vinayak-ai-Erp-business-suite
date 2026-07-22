export type SalesInvoice = {
  id: string;

  invoice_number: string;
  customer_id: string;

  invoice_date: string;

  subtotal: number;
  gst_amount: number;
  discount_amount: number;
  other_charges: number;
  grand_total: number;

  notes?: string;

  payment_status: 'Pending' | 'Partial' | 'Paid';

  status: 'Draft' | 'Confirmed' | 'Cancelled';

  created_at?: string;
  updated_at?: string;

  customer?: {
    id: string;
    customer_name: string;
    gst_number?: string;
    phone?: string;
  };
};

export type SalesItem = {
  id: string;

  sales_invoice_id: string;
  product_id: string;

  quantity: number;
  sale_price: number;
  gst_percent: number;

  line_total: number;

  product?: {
    id: string;
    product_name: string;
    sku: string;
    current_stock: number;
  };
};