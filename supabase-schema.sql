-- Run this in Supabase SQL Editor to create the intake tables.
-- https://supabase.com/dashboard/project/_/sql

-- If intake_stage1 already exists (without email/phone), run this first:
-- alter table intake_stage1 add column if not exists email text;
-- alter table intake_stage1 add column if not exists phone text;
-- alter table intake_stage1 alter column email set not null;  -- only after adding and backfilling, or drop and recreate

-- Stage 1: Interest Form
create table if not exists intake_stage1 (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  business_name text not null,
  email text not null,
  phone text,
  industry text,
  current_website_url text,
  has_current_website boolean default true,
  site_purpose text not null,
  has_logo text not null,
  content_readiness text not null,
  anything_else text
);

alter table intake_stage1 enable row level security;

drop policy if exists "Allow anonymous insert" on intake_stage1;
create policy "Allow anonymous insert" on intake_stage1 for insert to anon with check (true);

drop policy if exists "Allow service role full access" on intake_stage1;
create policy "Allow service role full access" on intake_stage1 for all to service_role using (true) with check (true);

-- Stage 2: Build Brief Form
create table if not exists intake_stage2 (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  business_name text not null,
  brand_colours text,
  website_like_1 text,
  website_like_2 text,
  website_like_3 text,
  sections_needed text[],
  key_competitors text,
  what_makes_different text,
  functionality_needed text[],
  domain_status text not null,
  contact_email text not null
);

alter table intake_stage2 enable row level security;

drop policy if exists "Allow anonymous insert" on intake_stage2;
create policy "Allow anonymous insert" on intake_stage2 for insert to anon with check (true);

drop policy if exists "Allow service role full access" on intake_stage2;
create policy "Allow service role full access" on intake_stage2 for all to service_role using (true) with check (true);
