"use server";

/**
 * Supabase table schema for intake_stage1 — run this in Supabase SQL Editor:
 *
 * create table intake_stage1 (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamptz default now(),
 *   full_name text not null,
 *   business_name text not null,
 *   industry text,
 *   current_website_url text,
 *   has_current_website boolean default true,
 *   site_purpose text not null,
 *   has_logo text not null,
 *   content_readiness text not null,
 *   anything_else text
 * );
 *
 * alter table intake_stage1 enable row level security;
 * create policy "Allow anonymous insert" on intake_stage1 for insert to anon with check (true);
 * create policy "Allow service role full access" on intake_stage1 for all to service_role using (true) with check (true);
 */

import { supabase } from "@/lib/supabase";

export type Stage1Payload = {
  fullName: string;
  businessName: string;
  industry: string;
  currentWebsiteUrl: string;
  hasCurrentWebsite: boolean;
  sitePurpose: string;
  hasLogo: string;
  contentReadiness: string;
  anythingElse: string;
};

export async function submitIntakeStage1(
  payload: Stage1Payload & { website_url?: string }
) {
  if (payload.website_url) return { ok: true };

  if (!supabase) {
    return { ok: false, error: "Database not configured." };
  }

  const { error } = await supabase.from("intake_stage1").insert({
    full_name: payload.fullName.trim(),
    business_name: payload.businessName.trim(),
    industry: payload.industry.trim() || null,
    current_website_url: payload.hasCurrentWebsite ? payload.currentWebsiteUrl.trim() || null : null,
    has_current_website: payload.hasCurrentWebsite,
    site_purpose: payload.sitePurpose,
    has_logo: payload.hasLogo,
    content_readiness: payload.contentReadiness,
    anything_else: payload.anythingElse.trim() || null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
