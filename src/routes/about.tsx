import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { HandHeart, Heart, Sparkles, ShieldCheck, Users } from "lucide-react";
import aboutImg from "@/assets/landing-photo-2.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Child of Grace Foundation" },
      { name: "description", content: "Our story, mission, vision, and the team restoring dignity and hope to vulnerable children." },
      { property: "og:title", content: "About — Child of Grace Foundation" },
      { property: "og:description", content: "More than care. A foundation for the future." },
    ],
  }),
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Story"
        title="More than care. A foundation for the future."
        subtitle="Child of Grace Foundation began with a simple belief: every child, regardless of their beginning, has value and potential. Today we walk that belief out — through homes, classrooms, clinics and communities."
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img src={aboutImg} alt="A care worker with children" className="aspect-[5/4] w-full rounded-[2rem] border border-border/60 object-cover shadow-soft" />
          <div className="space-y-6">
            <Block label="Vision" body="A world where every vulnerable child grows up with dignity, healing, and the freedom to imagine a thriving future." />
            <Block label="Mission" body="We restore dignity, nurture healing, and create opportunities for vulnerable children to thrive through long-term care, mentorship, education, and community support." />
          </div>
        </div>
      </section>

      <section className="bg-primary-soft/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Our core values</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => (
              <Card key={v.title} className="rounded-3xl border-border/60 bg-white p-6 text-center shadow-soft">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Leadership &amp; Governance</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Our work is overseen by a volunteer board of directors who ensure faithful stewardship,
          legal compliance, and strategic direction. The day-to-day care of children is led by an
          experienced multi-disciplinary team of caregivers, social workers, and educators.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((t) => (
            <Card key={t.name} className="rounded-3xl border-border/60 p-5 shadow-soft">
              <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-primary-soft to-primary/20" />
              <h3 className="mt-3 font-display text-lg font-semibold">{t.name}</h3>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.role}</p>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{label}</p>
      <p className="mt-2 font-display text-2xl leading-snug">{body}</p>
    </div>
  );
}

const values = [
  { icon: HandHeart, title: "Dignity", body: "Every child has inherent worth." },
  { icon: Heart, title: "Healing", body: "Restoration is at the center of care." },
  { icon: Sparkles, title: "Consistency", body: "We show up — for years, not seasons." },
  { icon: Users, title: "Community", body: "Children thrive in belonging." },
  { icon: ShieldCheck, title: "Accountability", body: "We steward every resource with care." },
];

const team = [
  { name: "Executive Director", role: "Leadership" },
  { name: "Director of Care", role: "Programs" },
  { name: "Education Lead", role: "Learning" },
  { name: "Operations Lead", role: "Stewardship" },
];
