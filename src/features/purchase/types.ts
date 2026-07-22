export type PurchaseOrder = {
  id: string;
  po_number: string;
  supplier_id: string;

  purchase_date: string;

  subtotal: number;
  gst_amount: number;
  other_charges: number;
  grand_total: number;

  notes?: string;

  status: 'Draft' | 'Ordered' | 'Received' | 'Cancelled';

  created_at?: string;
  updated_at?: string;

  supplier?: {
    id: string;
    supplier_name: string;
    gst_number?: string;
  };
};

export type PurchaseItem = {
  id: string;

  purchase_order_id: string;
  product_id: string;

  quantity: number;
  purchase_price: number;
  gst_percent: number;

  line_total: number;

  product?: {
    id: string;
    product_name: string;
    sku: string;
    current_stock: number;
  };
};