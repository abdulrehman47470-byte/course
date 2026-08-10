import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import {
  contactMessageSchema,
  newsletterSchema,
  updateProfileSchema,
  type ContactMessageValues,
  type NewsletterValues,
  type UpdateProfileValues,
} from "./schemas";
import type { Profile } from "@/lib/supabase/types";

export type SessionUser = {
  id: string;
  email: string | undefined;
  profile: Profile;
};

/**
 * Resolves the current request's session. Uses auth.getUser(), which
 * revalidates against Supabase's servers — never trust the embedded JWT
 * from getSession() alone for authorization decisions.
 */
/**
 * Runs in the root route's beforeLoad on EVERY page — including plain
 * marketing pages that don't need auth at all — so Header can render the
 * right signed-in/out state everywhere without a flash. That means a
 * misconfigured or unreachable Supabase project must never throw here, or
 * it takes down the entire site, not just the auth-gated routes. Any
 * failure degrades to "signed out" rather than propagating.
 */
export const getSessionUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionUser | null> => {
    try {
      const supabase = getSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (!profile) return null;

      return { id: user.id, email: user.email, profile };
    } catch (error) {
      console.error("getSessionUser failed — treating as signed out:", error);
      return null;
    }
  },
);

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((input: unknown): ContactMessageValues => contactMessageSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
    if (error) throw new Error("Could not submit your message. Please try again.");

    await sendEmail({
      to: data.email,
      subject: "We got your message — CareerBooster",
      html: `<p>Hi ${data.name},</p><p>Thanks for reaching out — our team will get back to you shortly regarding "${data.subject}".</p>`,
    });

    return { success: true as const };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((input: unknown): NewsletterValues => newsletterSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: data.email });

    // Unique-constraint violation just means they're already subscribed —
    // treat that as a success-equivalent outcome, not an error.
    if (error && error.code !== "23505") {
      throw new Error("Could not subscribe right now. Please try again.");
    }

    return { success: true as const };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .validator((input: unknown): UpdateProfileValues => updateProfileSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be signed in to update your profile.");

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: data.displayName,
        headline: data.headline || null,
        bio: data.bio || null,
        phone: data.phone || null,
        country: data.country || null,
      })
      .eq("id", user.id);

    if (error) throw new Error("Could not update your profile. Please try again.");
    return { success: true as const };
  });
