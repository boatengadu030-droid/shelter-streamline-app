import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, GraduationCap, Hammer, Users, Quote } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/volunteer")({
  component: VolunteerPage,
  head: () => ({
    meta: [
      { title: "Volunteer — Child of Grace Foundation" },
      { name: "description", content: "Give your time and skills to help vulnerable children thrive. Mentor, teach, build, or visit." },
      { property: "og:title", content: "Volunteer — Child of Grace Foundation" },
      { property: "og:description", content: "Mentor, teach, build, or visit — your time changes lives." },
    ],
  }),
});

function VolunteerPage() {
  function submit(e: React.FormEvent) {
    e.preventDefault();
    (e.target as HTMLFormElement).reset();
    toast.success("Application received!", { description: "We'll be in touch within 5 business days." });
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Volunteer"
        title="Your time, their tomorrow."
        subtitle="Volunteers are the heartbeat of Child of Grace. Whether weekly or once a year, your presence matters."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Ways to serve</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ops.map((o) => (
            <Card key={o.title} className="rounded-3xl border-border/60 p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft">
                <o.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{o.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{o.body}</p>
              <p className="mt-3 text-xs uppercase tracking-wider text-primary">{o.commit}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary-soft/30 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Apply to volunteer</h2>
            <p className="mt-3 text-muted-foreground">Tell us a bit about yourself. We'll follow up with next steps and an interview.</p>
            <Card className="mt-6 rounded-3xl border-border/60 bg-white p-7 shadow-soft">
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Full name"><Input required placeholder="Your name" className="rounded-full" /></Field>
                  <Field label="Email"><Input required type="email" placeholder="you@email.com" className="rounded-full" /></Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Phone"><Input placeholder="+233…" className="rounded-full" /></Field>
                  <Field label="Area of interest"><Input placeholder="Mentor, tutor, events…" className="rounded-full" /></Field>
                </div>
                <Field label="Tell us about yourself"><Textarea required rows={4} placeholder="What draws you to Child of Grace?" /></Field>
                <Button type="submit" size="lg" className="w-full rounded-full">Submit application</Button>
              </form>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="rounded-3xl border-border/60 p-6 shadow-soft">
              <Quote className="h-6 w-6 text-primary/40" />
              <p className="mt-3 font-display text-lg leading-snug">"I came to tutor for a few months. Three years later, I can't imagine my week without these kids."</p>
              <p className="mt-3 text-xs text-muted-foreground">— Akua, weekly mentor</p>
            </Card>
            <Card className="rounded-3xl border-border/60 p-6 shadow-soft">
              <Quote className="h-6 w-6 text-primary/40" />
              <p className="mt-3 font-display text-lg leading-snug">"Volunteering here changed how my whole team thinks about giving back."</p>
              <p className="mt-3 text-xs text-muted-foreground">— Daniel, corporate volunteer lead</p>
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

const ops = [
  { icon: Heart, title: "Care Companion", body: "Spend afternoons with children — play, read, listen.", commit: "Weekly · 3 hrs" },
  { icon: GraduationCap, title: "Tutor / Mentor", body: "Help with homework, study skills, and life coaching.", commit: "Weekly · 2 hrs" },
  { icon: Hammer, title: "Skills & Trades", body: "Carpentry, IT, design — bring your craft.", commit: "Monthly · flexible" },
  { icon: Users, title: "Events & Outreach", body: "Lend a hand at fundraisers and community days.", commit: "Per event" },
];
