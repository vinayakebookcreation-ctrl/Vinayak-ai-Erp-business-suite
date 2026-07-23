-- =========================================
-- Roles & Permissions
-- Migration: 008_roles_permissions.sql
-- =========================================

-- Create enum for user roles
create type public.user_role as enum (
  'Admin',
  'Manager',
  'Staff'
);

-- Add role column to profiles
alter table public.profiles
add column if not exists role public.user_role
default 'Staff';

-- =========================================
-- Role Permissions Table
-- =========================================

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),

  role public.user_role not null,
  module_name text not null,

  can_view boolean default true,
  can_create boolean default false,
  can_update boolean default false,
  can_delete boolean default false,

  created_at timestamptz default now(),

  unique(role, module_name)
);

-- =========================================
-- Admin Permissions
-- =========================================

insert into public.role_permissions
(role, module_name, can_view, can_create, can_update, can_delete)
values
('Admin', 'dashboard', true, true, true, true),
('Admin', 'company', true, true, true, true),
('Admin', 'branch', true, true, true, true),
('Admin', 'employee', true, true, true, true),
('Admin', 'supplier', true, true, true, true),
('Admin', 'customer', true, true, true, true),
('Admin', 'inventory', true, true, true, true),
('Admin', 'purchase', true, true, true, true),
('Admin', 'sales', true, true, true, true),
('Admin', 'reports', true, true, true, true)
on conflict do nothing;

-- =========================================
-- Manager Permissions
-- =========================================

insert into public.role_permissions
(role, module_name, can_view, can_create, can_update, can_delete)
values
('Manager', 'dashboard', true, false, false, false),
('Manager', 'supplier', true, true, true, false),
('Manager', 'customer', true, true, true, false),
('Manager', 'inventory', true, true, true, false),
('Manager', 'purchase', true, true, true, false),
('Manager', 'sales', true, true, true, false),
('Manager', 'reports', true, false, false, false)
on conflict do nothing;

-- =========================================
-- Staff Permissions
-- =========================================

insert into public.role_permissions
(role, module_name, can_view, can_create, can_update, can_delete)
values
('Staff', 'dashboard', true, false, false, false),
('Staff', 'sales', true, true, false, false)
on conflict do nothing;