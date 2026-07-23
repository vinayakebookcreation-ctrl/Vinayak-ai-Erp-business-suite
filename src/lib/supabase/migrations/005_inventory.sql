create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),

  product_name text not null,
  product_code text unique,

  hsn_code text,
  category text,
  unit text default 'Nos',

  purchase_price numeric(12,2) default 0,
  sale_price numeric(12,2) default 0,

  gst_percent numeric(5,2) default 18,

  opening_stock numeric(12,2) default 0,
  current_stock numeric(12,2) default 0,
  minimum_stock numeric(12,2) default 0,

  status text default 'Active',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);