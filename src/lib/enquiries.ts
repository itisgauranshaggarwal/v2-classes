import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{8,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000, "Message is too long"),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

/**
 * PLACEHOLDER submission handler. Nothing is sent or stored on a server yet.
 * Replace with a server function that inserts into an `enquiries` table and sends an email notification.
 */
export async function submitEnquiry(input: EnquiryInput): Promise<{ ok: true } | { ok: false; error: string }> {
  enquirySchema.parse(input);
  await new Promise((r) => setTimeout(r, 900));
  return { ok: true };
}
