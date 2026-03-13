"use server";

/**
 * Supabase table schema for intake_stage1 — run this in Supabase SQL Editor:
 *
 * create table intake_stage1 (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamptz default now(),
 *   full_name text not null,
 *   business_name text not null,
 *   email text not null,
 *   phone text,
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
import { Resend } from "resend";

export type Stage1Payload = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
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
    email: payload.email.trim(),
    phone: payload.phone.trim() || null,
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

  const to = process.env.RESEND_TO;
  const from = process.env.RESEND_FROM ?? "Evolution Media <onboarding@resend.dev>";
  if (process.env.RESEND_API_KEY && to) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const websiteDisplay = payload.hasCurrentWebsite
        ? (payload.currentWebsiteUrl.trim() || "—")
        : "I don't have one";
      await resend.emails.send({
        from,
        to: [to],
        replyTo: payload.email.trim(),
        subject: `New EvoMedia Enquiry — ${payload.businessName.trim()}`,
        html: `
          <h2>New intake enquiry</h2>
          <table style="border-collapse: collapse; max-width: 560px;">
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Name</td><td style="padding: 8px 0;">${escapeHtml(payload.fullName)}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Business Name</td><td style="padding: 8px 0;">${escapeHtml(payload.businessName)}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Email</td><td style="padding: 8px 0;">${escapeHtml(payload.email)}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Phone</td><td style="padding: 8px 0;">${payload.phone.trim() ? escapeHtml(payload.phone) : "—"}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Industry</td><td style="padding: 8px 0;">${payload.industry.trim() ? escapeHtml(payload.industry) : "—"}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Current Website URL</td><td style="padding: 8px 0;">${escapeHtml(websiteDisplay)}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">What they need the site to do</td><td style="padding: 8px 0;">${escapeHtml(payload.sitePurpose)}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Logo status</td><td style="padding: 8px 0;">${escapeHtml(payload.hasLogo)}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Content readiness</td><td style="padding: 8px 0;">${escapeHtml(payload.contentReadiness)}</td></tr>
            <tr><td style="padding: 8px 12px 8px 0; color: #64748b; font-weight: 600;">Additional notes</td><td style="padding: 8px 0;">${payload.anythingElse.trim() ? escapeHtml(payload.anythingElse).replace(/\n/g, "<br>") : "—"}</td></tr>
          </table>
        `,
      });
    } catch {
      // Don't fail the submission if email fails
    }
  }

  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
