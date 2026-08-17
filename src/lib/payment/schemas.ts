import { z } from "zod";

export const submitPaymentSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(3, "Enter the transaction ID or reference from your bank transfer")
    .max(200),
});
export type SubmitPaymentValues = z.infer<typeof submitPaymentSchema>;
