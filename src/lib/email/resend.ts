import { Resend } from "resend";

const FROM = "CareerBooster <notifications@mentormatch.academy>";

/**
 * Thin wrapper around Resend. Server-only. Swallows send failures into a
 * console warning rather than throwing — a failed notification email should
 * never fail the user-facing action that triggered it (e.g. submitting the
 * contact form should still succeed even if the confirmation email fails).
 */
export async function sendEmail(input: { to: string; subject: string; html: string }) {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn(`RESEND_API_KEY not set — skipping email "${input.subject}" to ${input.to}`);
    return;
  }
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
  }
}
