"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  // Honeypot: if filled by bot, reject silently
  const honeypot = formData.get("website_url") as string;
  if (honeypot) {
    return { ok: true, data: null };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const websiteType = formData.get("websiteType") as string;
  const budget = formData.get("budget") as string;
  const message = formData.get("message") as string;

  const to = process.env.RESEND_TO;
  const from = process.env.RESEND_FROM ?? "Evolution Media <onboarding@resend.dev>";

  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "Email service not configured." };
  }

  if (!to) {
    return { ok: false, error: "Recipient email not configured." };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Quote request: ${websiteType} from ${name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Website type:</strong> ${websiteType}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <h3>Message</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return { ok: false, error: message };
  }
}
