create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),

  branch_id uuid references public.branches(id) on delete set null,

  employee_code text unique,
  full_name text not null,

  email text,
  phone text,

  designation text,
  department text,

  joining_date date,
  salary numeric(12,2),

  status text default 'Active',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);