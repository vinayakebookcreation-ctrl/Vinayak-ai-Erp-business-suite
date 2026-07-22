export type SalesInvoice = {
  id: string;
  invoice_number: string;
  customer_id: string;
  invoice_date: string;

  subtotal: number;
  gst_amount: number;
  grand_total: number;

  payment_status: string;
  status: string;

  customer?: {
    id: string;
    customer_name: string;
    phone?: string;
    gst_number?: string;
  };

  items?: {
    id: string;
    quantity: number;
    sale_price: number;
    gst_percent: number;

    product?: {
      id: string;
      product_name: string;
      product_code?: string;
    };
  }[];
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