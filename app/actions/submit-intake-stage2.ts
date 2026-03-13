"use server";

/**
 * Supabase table schema for intake_stage2 — run this in Supabase SQL Editor:
 *
 * create table intake_stage2 (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamptz default now(),
 *   name text not null,
 *   business_name text not null,
 *   brand_colours text,
 *   website_like_1 text,
 *   website_like_2 text,
 *   website_like_3 text,
 *   sections_needed text[],
 *   key_competitors text,
 *   what_makes_different text,
 *   functionality_needed text[],
 *   domain_status text not null,
 *   contact_email text not null
 * );
 *
 * alter table intake_stage2 enable row level security;
 * create policy "Allow anonymous insert" on intake_stage2 for insert to anon with check (true);
 * create policy "Allow service role full access" on intake_stage2 for all to service_role using (true) with check (true);
 *
 * Notion database: Create a database with these property types (names can vary, map in code):
 * - Name (title)
 * - Business Name (rich_text)
 * - Brand Colours (rich_text)
 * - Websites Liked (rich_text)
 * - Sections Needed (multi_select or rich_text)
 * - Key Competitors (rich_text)
 * - What Makes Different (rich_text)
 * - Functionality Needed (multi_select or rich_text)
 * - Domain Status (select)
 * - Contact Email (email)
 */

import { supabase } from "@/lib/supabase";

export type Stage2Payload = {
  name: string;
  businessName: string;
  brandColours: string;
  websiteLike1: string;
  websiteLike2: string;
  websiteLike3: string;
  sectionsNeeded: string[];
  keyCompetitors: string;
  whatMakesDifferent: string;
  functionalityNeeded: string[];
  domainStatus: string;
  contactEmail: string;
};

async function pushToNotion(payload: Stage2Payload) {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!apiKey || !databaseId) return;

  const properties: Record<string, unknown> = {
    "Name": { title: [{ text: { content: payload.name } }] },
    "Business Name": { rich_text: [{ text: { content: payload.businessName } }] },
    "Brand Colours": { rich_text: [{ text: { content: payload.brandColours || "—" } }] },
    "Websites Liked": {
      rich_text: [
        {
          text: {
            content: [payload.websiteLike1, payload.websiteLike2, payload.websiteLike3]
              .filter(Boolean)
              .join(", ") || "—",
          },
        },
      ],
    },
    "Sections Needed": { rich_text: [{ text: { content: payload.sectionsNeeded.join(", ") || "—" } }] },
    "Key Competitors": { rich_text: [{ text: { content: payload.keyCompetitors || "—" } }] },
    "What Makes Different": { rich_text: [{ text: { content: payload.whatMakesDifferent || "—" } }] },
    "Functionality Needed": {
      rich_text: [{ text: { content: payload.functionalityNeeded.join(", ") || "—" } }],
    },
    "Domain Status": { rich_text: [{ text: { content: payload.domainStatus } }] },
    "Contact Email": { email: payload.contactEmail },
  };

  try {
    await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
    });
  } catch {
    // Notion is optional; don't fail the whole submission
  }
}

export async function submitIntakeStage2(
  payload: Stage2Payload & { website_url?: string }
) {
  if (payload.website_url) return { ok: true };

  if (!supabase) {
    return { ok: false, error: "Database not configured." };
  }

  const { error } = await supabase.from("intake_stage2").insert({
    name: payload.name.trim(),
    business_name: payload.businessName.trim(),
    brand_colours: payload.brandColours.trim() || null,
    website_like_1: payload.websiteLike1.trim() || null,
    website_like_2: payload.websiteLike2.trim() || null,
    website_like_3: payload.websiteLike3.trim() || null,
    sections_needed: payload.sectionsNeeded.length ? payload.sectionsNeeded : [],
    key_competitors: payload.keyCompetitors.trim() || null,
    what_makes_different: payload.whatMakesDifferent.trim() || null,
    functionality_needed: payload.functionalityNeeded.length ? payload.functionalityNeeded : [],
    domain_status: payload.domainStatus,
    contact_email: payload.contactEmail.trim(),
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  await pushToNotion(payload);
  return { ok: true };
}
