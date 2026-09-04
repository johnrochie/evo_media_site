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

-- Client Projects — Phase 4, item 7 (Automated Client Communication &
-- Status Agent). Tracks a paying client's project from payment through to
-- launch and drives the status emails sent at each stage. Deliberately
-- NOT given an "Allow anonymous insert" policy like the two tables above:
-- those are one-way form submissions (write-once, never read back through
-- the public anon key), but this table holds payment/PII data (email,
-- amount, Stripe session id) that also needs to be READ back by server
-- code (to find a client's row when their brief arrives, to advance their
-- stage). Allowing anonymous SELECT on that would let anyone holding the
-- public anon key enumerate every client's email and payment info from
-- the browser — so this table is service-role only, written and read
-- exclusively from server code via SUPABASE_SERVICE_ROLE_KEY, never the
-- anon key. See lib/supabaseAdmin.ts.
create table if not exists client_projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  stage text not null default 'paid',
  stage_updated_at timestamptz default now(),
  payment_type text not null,       -- 'deposit' | 'package' — see the two real checkout flows in app/api/checkout (deposit) and app/actions/create-checkout-session.ts (full package)
  tier text,                        -- e.g. "Tier 1", "Tier 2" — only set for the package flow; a bare deposit doesn't know the tier yet
  business_name text,               -- unknown at payment time for both flows (Stripe Checkout doesn't collect it); filled in once the brief arrives
  contact_email text,
  amount_total integer,             -- cents, from Stripe
  currency text,
  stripe_session_id text unique,
  live_url text
);

alter table client_projects enable row level security;

drop policy if exists "Allow service role full access" on client_projects;
create policy "Allow service role full access" on client_projects for all to service_role using (true) with check (true);
