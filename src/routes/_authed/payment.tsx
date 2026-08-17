import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import {
  AuthCard,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authSubmitClass,
} from "@/components/auth/AuthCard";
import { getBankDetails, getMyPaymentStatus, submitPayment } from "@/lib/payment/server-fns";
import { submitPaymentSchema, type SubmitPaymentValues } from "@/lib/payment/schemas";

const title = "Complete Payment — CareerBooster";

export const Route = createFileRoute("/_authed/payment")({
  head: () => ({ meta: [{ title }] }),
  loader: async () => {
    const [bank, status] = await Promise.all([getBankDetails(), getMyPaymentStatus()]);
    return { bank, status };
  },
  component: PaymentPage,
});

function PaymentPage() {
  const { bank, status: initialStatus } = Route.useLoaderData();
  const [status, setStatus] = useState(initialStatus);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmitPaymentValues>({ resolver: zodResolver(submitPaymentSchema) });

  async function onSubmit(values: SubmitPaymentValues) {
    setFormError(null);
    try {
      await submitPayment({ data: values });
      setStatus({
        id: "",
        student_id: "",
        method: "bank_transfer",
        reference: values.reference,
        status: "pending",
        submitted_at: new Date().toISOString(),
        reviewed_at: null,
        reviewed_by: null,
        notes: null,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AuthCard
        title="Complete your payment"
        subtitle="Your account is verified. Pay via bank transfer to activate your dashboard and course access."
      >
        {status?.status === "approved" ? (
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent">
              <CheckCircle2 className="size-6 text-primary" />
            </span>
            <p className="mt-4 text-[14px] font-semibold">Payment verified</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              Your payment has been confirmed. Your dashboard and course access are now active.
            </p>
            <a
              href="/dashboard"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Go to dashboard
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <p className="text-[12px] font-semibold text-foreground/80">Bank transfer details</p>
              <dl className="mt-2.5 space-y-1.5 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Bank</dt>
                  <dd className="font-medium">{bank.bankName || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Account title</dt>
                  <dd className="font-medium">{bank.accountTitle || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Account number</dt>
                  <dd className="font-medium">{bank.accountNumber || "—"}</dd>
                </div>
              </dl>
            </div>

            {status?.status === "pending" && (
              <div className="flex items-start gap-2.5 rounded-lg border border-border bg-secondary/50 p-3.5 text-[12.5px] text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" />
                <p>
                  We received your reference{" "}
                  <span className="font-medium text-foreground">{status.reference}</span> and it's
                  awaiting review. You can submit an updated reference below if needed.
                </p>
              </div>
            )}
            {status?.status === "rejected" && (
              <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 text-[12.5px] text-muted-foreground">
                <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p>
                  Your last submission couldn't be verified
                  {status.notes ? `: ${status.notes}` : "."} Please double-check the reference and
                  submit again.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div>
                <label className={authLabelClass}>Transaction ID / reference</label>
                <input
                  type="text"
                  placeholder="e.g. the reference number from your bank receipt"
                  className={authInputClass(!!errors.reference)}
                  {...register("reference")}
                />
                {errors.reference && <p className={authErrorClass}>{errors.reference.message}</p>}
              </div>
              {formError && <p className={authErrorClass}>{formError}</p>}
              <button disabled={isSubmitting} className={authSubmitClass}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {status ? "Submit updated reference" : "I've made the payment"}
              </button>
              <p className="text-center text-[12px] text-muted-foreground">
                We'll review your payment and activate your account shortly.
              </p>
            </form>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
