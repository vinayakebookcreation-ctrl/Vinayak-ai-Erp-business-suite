-- Companies
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),

  company_name text not null,
  gst_number text,
  pan_number text,

  phone text,
  email text,
  website text,

  address text,
  city text,
  state text,
  country text default 'India',
  pincode text,

  timezone text default 'Asia/Kolkata',
  currency text default 'INR',

  logo_url text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Branches
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),

  company_id uuid references public.companies(id) on delete cascade,

  branch_name text not null,
  branch_code text unique,

  phone text,
  email text,

  address text,
  city text,
  state text,
  pincode text,

  is_active boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);