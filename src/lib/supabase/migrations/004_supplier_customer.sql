-- Suppliers
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),

  supplier_name text not null,
  gst_number text,
  contact_person text,

  phone text,
  email text,

  address text,
  city text,
  state text,
  pincode text,

  status text default 'Active',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Customers
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),

  customer_name text not null,
  gst_number text,

  phone text,
  email text,

  address text,
  city text,
  state text,
  pincode text,

  credit_limit numeric(12,2) default 0,

  status text default 'Active',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);