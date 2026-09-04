import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { markBriefReceived } from "@/lib/clientProjects";
import { renderClientEmail, sendClientEmail } from "@/lib/clientEmail";

const NOTIFY_EMAIL =
  process.env.INTAKE_NOTIFY_EMAIL || process.env.RESEND_TO || "";
const FROM =
  process.env.RESEND_FROM ?? "Evolution Media <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Honeypot — treat as success without sending
    if (data.website_url) {
      return NextResponse.json({ ok: true });
    }

    const required = [
      "businessName",
      "industry",
      "description",
      "pagesNeeded",
      "contactName",
      "contactEmail",
    ];
    for (const field of required) {
      if (!data[field] || String(data[field]).trim() === "") {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!process.env.RESEND_API_KEY || !NOTIFY_EMAIL) {
      console.error("Intake: Resend not configured (RESEND_API_KEY / notify email)");
      return NextResponse.json(
        { error: "Email not configured" },
        { status: 500 }
      );
    }

    const rows: [string, string][] = [
      ["Business name", data.businessName],
      ["Industry", data.industry],
      ["Description", data.description],
      ["Existing domain", data.existingDomain || "—"],
      ["Logo", data.logoNote || "—"],
      ["Colours", data.colours || "—"],
      ["Inspiration", data.inspiration || "—"],
      ["Pages needed", data.pagesNeeded],
      ["Existing content", data.existingContent || "—"],
      ["Photos", data.photos || "—"],
      ["Functionality", data.functionality || "—"],
      ["Contact name", data.contactName],
      ["Contact email", data.contactEmail],
      ["Contact phone", data.contactPhone || "—"],
      ["Stripe session", data.sessionId || "—"],
    ];

    const html = `
      <h2>New project brief — ${escapeHtml(data.businessName)}</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;">
        ${rows
          .map(
            ([label, value]) => `
          <tr style="border-bottom:1px solid #eee;">
            <td style="font-weight:600;vertical-align:top;width:160px;">${escapeHtml(label)}</td>
            <td style="white-space:pre-wrap;">${escapeHtml(String(value))}</td>
          </tr>`
          )
          .join("")}
      </table>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_EMAIL,
      replyTo: String(data.contactEmail).trim(),
      subject: `New brief: ${String(data.businessName).trim()}`,
      html,
    });

    // Phase 4, item 7, Prompt 2: advance the pipeline stage and — the
    // gap this closes — actually tell the client their brief arrived,
    // not just John. Best-effort: this must never block the response
    // above, which already does this endpoint's real job.
    if (data.sessionId) {
      const project = await markBriefReceived({
        stripeSessionId: String(data.sessionId),
        businessName: String(data.businessName).trim(),
        contactEmail: String(data.contactEmail).trim(),
      });

      if (project) {
        await sendClientEmail({
          to: String(data.contactEmail).trim(),
          subject: "Brief received — Evolution Media",
          html: renderClientEmail({
            heading: "Brief received",
            bodyHtml: `
              <p>Thanks — that's everything we need to get started. We'll follow up shortly to confirm the build and next steps.</p>
            `,
          }),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Intake submission failed:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
