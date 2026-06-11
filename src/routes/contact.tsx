import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Child of Grace Foundation" },
      { name: "description", content: "Reach out to partner, ask questions, or visit our home." },
      { property: "og:title", content: "Contact — Child of Grace Foundation" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
});

function ContactPage() {
  function submit(e: React.FormEvent) {
    e.preventDefault();
    (e.target as HTMLFormElement).reset();
    toast.success("Message sent!", { description: "We'll reply within 2 business days." });
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you."
        subtitle="Whether you want to partner, donate in kind, plan a visit, or just learn more — drop us a line."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <Card className="rounded-3xl border-border/60 p-7 shadow-soft lg:col-span-3">
            <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name"><Input required placeholder="Your full name" className="rounded-full" /></Field>
                <Field label="Email"><Input required type="email" placeholder="you@email.com" className="rounded-full" /></Field>
              </div>
              <Field label="Subject"><Input required placeholder="How can we help?" className="rounded-full" /></Field>
              <Field label="Message"><Textarea required rows={5} placeholder="Write your message…" /></Field>
              <Button type="submit" size="lg" className="gap-2 rounded-full">
                <Send className="h-4 w-4" /> Send message
              </Button>
            </form>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <Card className="rounded-3xl border-border/60 p-6 shadow-soft">
              <h3 className="font-display text-base font-semibold">Visit us</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>Child of Grace Home<br />Accra, Ghana</span></li>
                <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-primary" /><span>+233 (0) 000 000 000</span></li>
                <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-primary" /><span>hello@childofgrace.org</span></li>
              </ul>
              <div className="mt-5 flex gap-2">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-primary-soft hover:text-primary">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden rounded-3xl border-border/60 p-0 shadow-soft">
              <iframe
                title="Map to Child of Grace Foundation"
                src="https://www.google.com/maps?q=Accra,Ghana&output=embed"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
