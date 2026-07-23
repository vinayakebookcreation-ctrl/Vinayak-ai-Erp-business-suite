-- Purchase invoices
create table if not exists public.purchase_invoices (
  id uuid primary key default gen_random_uuid(),

  invoice_number text unique not null,
  supplier_id uuid references public.suppliers(id),

  invoice_date date not null,

  subtotal numeric(12,2) default 0,
  gst_amount numeric(12,2) default 0,
  grand_total numeric(12,2) default 0,

  payment_status text default 'Unpaid',
  status text default 'Draft',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Purchase items
create table if not exists public.purchase_items (
  id uuid primary key default gen_random_uuid(),

  purchase_invoice_id uuid references public.purchase_invoices(id) on delete cascade,
  product_id uuid references public.products(id),

  quantity numeric(12,2) not null,
  purchase_price numeric(12,2) not null,
  gst_percent numeric(5,2) default 18,

  line_total numeric(12,2) not null
);