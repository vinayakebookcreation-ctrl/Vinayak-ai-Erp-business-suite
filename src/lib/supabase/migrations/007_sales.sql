-- Sales invoices
create table if not exists public.sales_invoices (
  id uuid primary key default gen_random_uuid(),

  invoice_number text unique not null,
  customer_id uuid references public.customers(id),

  invoice_date date not null,

  subtotal numeric(12,2) default 0,
  gst_amount numeric(12,2) default 0,
  discount_amount numeric(12,2) default 0,
  other_charges numeric(12,2) default 0,
  grand_total numeric(12,2) default 0,

  payment_status text default 'Unpaid',
  status text default 'Draft',

  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sales items
create table if not exists public.sales_items (
  id uuid primary key default gen_random_uuid(),

  sales_invoice_id uuid references public.sales_invoices(id) on delete cascade,
  product_id uuid references public.products(id),

  quantity numeric(12,2) not null,
  sale_price numeric(12,2) not null,
  gst_percent numeric(5,2) default 18,

  line_total numeric(12,2) not null
);