import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useContent, uid } from "@/lib/content/store";
import { enquirySchema, submitEnquiry, type EnquiryInput } from "@/lib/enquiries";
import { PageHero } from "@/components/site/PageHero";
import { Editable } from "@/components/site/Editable";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — V2 Classes, Sector 13, Hisar" },
      {
        name: "description",
        content:
          "Visit, call or WhatsApp V2 Classes in Sector 13, Hisar, or send an enquiry online.",
      },
      { property: "og:title", content: "Contact V2 Classes" },
      {
        property: "og:description",
        content: "Address, phone, WhatsApp and enquiry form for V2 Classes, Hisar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

type Errors = Partial<Record<keyof EnquiryInput, string>>;
const EMPTY: EnquiryInput = { name: "", phone: "", email: "", message: "" };

function Contact() {
  const { content, update } = useContent();
  const c = content.site.contact;
  const [form, setForm] = useState<EnquiryInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof EnquiryInput;
        errs[k] ??= issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const res = await submitEnquiry(parsed.data);
      if (!res.ok) throw new Error(res.error);
      // Demo only: keep a local copy so it shows in the admin enquiries list.
      update((s) => ({
        ...s,
        enquiries: [
          { id: uid(), ...parsed.data, createdAt: new Date().toISOString(), status: "new" },
          ...s.enquiries,
        ],
      }));
      setState("done");
      setForm(EMPTY);
    } catch {
      setState("idle");
      toast.error("Couldn't send your enquiry. Please try again or call us.");
    }
  };

  const field = (k: keyof EnquiryInput, label: string, type = "text") => (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {k === "message" ? (
        <textarea
          rows={5}
          value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          aria-invalid={!!errors[k]}
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive"
        />
      ) : (
        <input
          type={type}
          value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          aria-invalid={!!errors[k]}
          className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:border-brand focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive"
        />
      )}
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  const items = [
    { Icon: MapPin, label: "Address", value: <span>{c.address}</span> },
    {
      Icon: Phone,
      label: "Phone",
      value: (
        <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-brand">
          {c.phone}
        </a>
      ),
    },
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: (
        <a
          href={`https://wa.me/${c.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-brand"
        >
          Message us on WhatsApp
        </a>
      ),
    },
    { Icon: Mail, label: "Email", value: <Editable text={c.email} /> },
    { Icon: Clock, label: "Hours", value: <Editable text={c.hours} /> },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title={
          <>
            Let's talk about <span className="text-brand">your goals.</span>
          </>
        }
      >
        Visit the institute in Sector 13, Hisar, call us, or send an enquiry below.
      </PageHero>
      <section className="container-x mt-16 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <ul className="card-elegant divide-y divide-border">
            {items.map(({ Icon, label, value }) => (
              <li key={label} className="flex gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">{label}</p>
                  <div className="mt-1 font-medium">{value}</div>
                </div>
              </li>
            ))}
          </ul>
          <iframe
            title="V2 Classes location map"
            loading="lazy"
            className="h-80 w-full rounded-2xl border border-border"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`}
          />
        </div>
        <div className="card-elegant p-6 md:p-10">
          {state === "done" ? (
            <div className="grid min-h-96 place-items-center text-center" role="status">
              <div>
                <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
                <h2 className="mt-4 text-3xl font-extrabold">Thank you!</h2>
                <p className="mt-2 text-muted-foreground">Your enquiry has been recorded.</p>
                <p className="placeholder-tag mt-4">Demo — online delivery not connected yet</p>
                <div>
                  <button onClick={() => setState("idle")} className="btn-ghost mt-6">
                    Send another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <h2 className="text-3xl font-extrabold">Send an enquiry</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {field("name", "Full name")}
                {field("phone", "Phone", "tel")}
              </div>
              {field("email", "Email", "email")}
              {field("message", "Message")}
              <button
                type="submit"
                disabled={state === "sending"}
                className="btn-brand w-full justify-center disabled:opacity-70"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send enquiry"
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
