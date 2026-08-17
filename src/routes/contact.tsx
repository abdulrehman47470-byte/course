import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaFooter } from "@/components/site/CtaFooter";
import { submitContactMessage } from "@/lib/auth/server-fns";

const title = "Contact Us — CareerBooster";
const description =
  "Get in touch with the CareerBooster team about courses, certification, or mentorship.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

const contactPoints = [
  {
    icon: Mail,
    title: "Email Support",
    text: "General questions about courses and certification.",
  },
  {
    icon: MessageCircle,
    title: "Mentorship Inquiries",
    text: "Questions about research mentorship or career coaching.",
  },
  {
    icon: Clock,
    title: "Support Hours",
    text: "Mon – Sat, 10AM – 8PM, across multiple time zones.",
  },
  {
    icon: MapPin,
    title: "Remote-First",
    text: "We support learners globally, wherever you're based.",
  },
];

type FormState = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof FormState, string>>;

function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.subject.trim()) next.subject = "Subject is required.";
    if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    return next;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStatus("loading");
    try {
      await submitContactMessage({ data: form });
      setStatus("sent");
    } catch {
      setStatus("idle");
      setErrors({ message: "Could not send your message. Please try again." });
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center shadow-card">
        <span className="grid size-14 place-items-center rounded-full bg-accent">
          <CheckCircle2 className="size-7 text-primary" />
        </span>
        <h2 className="mt-4 text-[20px] font-bold tracking-tight">Message sent</h2>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          Thanks, {form.name.split(" ")[0] || "there"} — our team will get back to you at{" "}
          {form.email} soon.
        </p>
        <button
          onClick={() => {
            setForm({ name: "", email: "", subject: "", message: "" });
            setStatus("idle");
          }}
          className="mt-6 rounded-md border border-border px-5 py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-xl border border-border bg-card p-7 shadow-card"
      onSubmit={onSubmit}
      noValidate
    >
      <h2 className="text-[22px] font-bold tracking-tight">Send a Message</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-[12px] font-semibold text-foreground/80">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            className={`mt-2 w-full rounded-md border bg-background px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary ${
              errors.name ? "border-destructive" : "border-border"
            }`}
          />
          {errors.name && <p className="mt-1 text-[11px] text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label className="text-[12px] font-semibold text-foreground/80">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            className={`mt-2 w-full rounded-md border bg-background px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary ${
              errors.email ? "border-destructive" : "border-border"
            }`}
          />
          {errors.email && <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label className="text-[12px] font-semibold text-foreground/80">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          placeholder="What's this about?"
          className={`mt-2 w-full rounded-md border bg-background px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary ${
            errors.subject ? "border-destructive" : "border-border"
          }`}
        />
        {errors.subject && <p className="mt-1 text-[11px] text-destructive">{errors.subject}</p>}
      </div>
      <div>
        <label className="text-[12px] font-semibold text-foreground/80">Message</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us how we can help..."
          className={`mt-2 w-full resize-none rounded-md border bg-background px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary ${
            errors.message ? "border-destructive" : "border-border"
          }`}
        />
        {errors.message && <p className="mt-1 text-[11px] text-destructive">{errors.message}</p>}
      </div>
      <button
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHeader
          eyebrow="Contact Us"
          title={
            <>
              We're Here to <span className="text-emerald-bright">Help</span>
            </>
          }
          subtitle="Questions about a course, certification, or mentorship? Send us a message and our team will get back to you."
          image="/images/1511376979163-f804dff7ad7b-1600x500.jpg"
        />

        <section className="bg-surface py-16">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight">Get in Touch</h2>
              <div className="mt-7 space-y-4">
                {contactPoints.map((c) => (
                  <div
                    key={c.title}
                    className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-5 shadow-card"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent">
                      <c.icon className="size-[18px] text-primary" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold">{c.title}</p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
      <CtaFooter />
    </div>
  );
}
