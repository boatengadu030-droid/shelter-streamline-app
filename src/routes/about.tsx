import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandHeart, Heart, Sparkles, ShieldCheck, Users, ArrowRight, FileCheck2, BarChart3 } from "lucide-react";
import aboutImg from "@/assets/landing-photo-2.jpg";
import storyImg from "@/assets/landing-photo-3.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Child of Grace Foundation" },
      { name: "description", content: "Our story, mission, vision, leadership and the team restoring dignity and hope to vulnerable children." },
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

      {/* MISSION + VISION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img src={aboutImg} alt="A care worker with children" className="aspect-[5/4] w-full rounded-[2rem] border border-border/60 object-cover shadow-soft" />
          <div className="space-y-6">
            <Block label="Vision" body="A world where every vulnerable child grows up with dignity, healing, and the freedom to imagine a thriving future." />
            <Block label="Mission" body="We restore dignity, nurture healing, and create opportunities for vulnerable children to thrive through long-term care, mentorship, education, and community support." />
            <Block label="Promise" body="We never drop a child mid-journey. From first day of care to first job, we walk the whole way." />
          </div>
        </div>
      </section>

      {/* STORY / TIMELINE */}
      <section className="bg-gradient-to-b from-background to-primary-soft/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Our Journey</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">A decade of showing up.</h2>
              <p className="mt-4 text-muted-foreground">
                What began with a single child in a borrowed room has grown into a community of caregivers,
                educators, mentors, sponsors and partners across multiple regions.
              </p>
            </div>
            <ol className="relative lg:col-span-8">
              <span aria-hidden className="absolute left-3 top-2 bottom-2 w-px bg-primary/20 sm:left-4" />
              {timeline.map((t) => (
                <li key={t.year} className="relative mb-8 pl-10 sm:pl-14 last:mb-0">
                  <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground sm:h-8 sm:w-8 sm:text-xs">{t.year}</span>
                  <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">What We Believe</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Our core values</h2>
        </div>
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
      </section>

      {/* LEADERSHIP */}
      <section className="bg-primary-soft/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Leadership &amp; Governance</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">The people behind the work</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Our work is overseen by a volunteer board of directors and led day-to-day by an
              experienced team of caregivers, social workers and educators.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t) => (
              <Card key={t.name} className="rounded-3xl border-border/60 bg-white p-5 shadow-soft">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-soft to-primary/30">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-4xl font-bold text-primary/70">{t.name.split(" ").map(n => n[0]).slice(0,2).join("")}</span>
                  </div>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{t.name}</h3>
                <p className="text-xs uppercase tracking-wider text-primary">{t.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Transparency</p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">Accountability matters.</h2>
            <p className="mt-3 text-muted-foreground">
              We publish annual reports, financial statements, and impact data so every supporter
              knows exactly how their gift is at work.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            {[
              { icon: FileCheck2, title: "Annual Reports", body: "Yearly review of activities &amp; finances." },
              { icon: ShieldCheck, title: "Governance", body: "Board oversight &amp; audited accounts." },
              { icon: BarChart3, title: "Impact Data", body: "Outcomes measured every quarter." },
            ].map((t) => (
              <Card key={t.title} className="rounded-3xl border-border/60 p-5 shadow-soft">
                <t.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-display text-base font-semibold">{t.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.body }} />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="border-y border-border/40 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">In partnership with</p>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <div key={p} className="flex h-16 items-center justify-center rounded-2xl border border-border/60 bg-background px-4 text-center font-display text-sm font-semibold text-muted-foreground">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-primary/80 p-10 text-primary-foreground shadow-glow sm:p-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Walk with us.</h2>
            <p className="mt-3 max-w-md opacity-90">Sponsor a child, fund a program, or join as a volunteer — every chapter matters.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button asChild size="lg" variant="secondary" className="h-12 gap-2 rounded-full px-6">
              <Link to="/sponsorship">Sponsor a Child <Heart className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/40 bg-transparent px-6 text-white hover:bg-white/10">
              <Link to="/contact">Partner with us <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
        <img src={storyImg} alt="" aria-hidden className="sr-only" />
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

const timeline = [
  { year: "2014", title: "A first home opens", body: "Founders welcomed the first three children into a small rented home in Accra." },
  { year: "2017", title: "Education program launched", body: "Scholarships and full school enrollment introduced — now our largest program." },
  { year: "2019", title: "Mentorship model established", body: "Adult mentors matched one-to-one with every child in long-term care." },
  { year: "2022", title: "Community outreach expanded", body: "Vocational training and family-strengthening programs reach three regions." },
  { year: "Today", title: "240+ children, 320+ families", body: "A growing community of sponsors, volunteers and partners walking together." },
];

const team = [
  { name: "Grace Mensah", role: "Executive Director", bio: "Leads vision, partnerships and team. 15+ yrs in child welfare." },
  { name: "Daniel Owusu", role: "Director of Care", bio: "Oversees homes, social work and trauma-informed care." },
  { name: "Esi Boateng", role: "Education Lead", bio: "Heads the scholarship program and tutoring network." },
  { name: "Kwame Asante", role: "Operations &amp; Finance", bio: "Stewards budgets, audits and reporting." },
];

const partners = ["GraceCare", "Hope Ed Trust", "Kinder Health", "Sunrise Bank", "Mensah & Co", "Volta Schools"];
