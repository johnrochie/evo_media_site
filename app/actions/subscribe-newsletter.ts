"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeNewsletter(email: string) {
  const to = process.env.RESEND_TO;
  const from = process.env.RESEND_FROM ?? "Evolution Media <onboarding@resend.dev>";

  if (!process.env.RESEND_API_KEY || !to) {
    return { ok: false, error: "Newsletter not configured." };
  }

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Newsletter signup: ${email}`,
    html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
