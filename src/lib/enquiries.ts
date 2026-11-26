import { z } from "zod";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{8,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(1000, "Message is too long"),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export async function submitEnquiry(
  input: EnquiryInput,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const parsed = enquirySchema.parse(input);

  if (hasSupabaseEnv()) {
    const supabase = getSupabaseBrowserClient();
    const id = Math.random().toString(36).slice(2, 10);
    const { error } = await supabase.from("enquiries").insert({
      id,
      name: parsed.name,
      phone: parsed.phone,
      email: parsed.email,
      message: parsed.message,
      status: "new",
    });
    if (error) {
      console.error("Failed to submit enquiry:", error);
      return { ok: false, error: "Could not submit your enquiry. Please try again." };
    }
    return { ok: true, id };
  }

  await new Promise((r) => setTimeout(r, 900));
  return { ok: true };
}
