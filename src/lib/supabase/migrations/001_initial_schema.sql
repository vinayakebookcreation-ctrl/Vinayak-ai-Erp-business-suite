-- Enable UUID extension
create extension if not exists pgcrypto;

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  email text unique,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);