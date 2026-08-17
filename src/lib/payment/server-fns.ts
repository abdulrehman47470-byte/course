import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PaymentSubmission } from "@/lib/supabase/types";
import { submitPaymentSchema, type SubmitPaymentValues } from "./schemas";

export type BankDetails = {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
};

// Configured via env vars (PAYMENT_BANK_NAME / PAYMENT_ACCOUNT_TITLE /
// PAYMENT_ACCOUNT_NUMBER) rather than hardcoded, same pattern as
// ADMIN_ACCESS_PASSWORD — lets bank details change without a code deploy.
export const getBankDetails = createServerFn({ method: "GET" }).handler((): BankDetails => ({
  bankName: process.env["PAYMENT_BANK_NAME"] ?? "",
  accountTitle: process.env["PAYMENT_ACCOUNT_TITLE"] ?? "",
  accountNumber: process.env["PAYMENT_ACCOUNT_NUMBER"] ?? "",
}));

export const getMyPaymentStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<PaymentSubmission | null> => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("payment_submissions")
      .select("*")
      .eq("student_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data;
  },
);

export const submitPayment = createServerFn({ method: "POST" })
  .validator((input: unknown): SubmitPaymentValues => submitPaymentSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be signed in.");

    const { error } = await supabase.from("payment_submissions").insert({
      student_id: user.id,
      reference: data.reference,
    });
    if (error) throw new Error(error.message);
    return { success: true as const };
  });
