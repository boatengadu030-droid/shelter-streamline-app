import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, HandHeart, Sparkles, ShieldCheck, GraduationCap, Stethoscope, Users, Home as HomeIcon, BookOpen, FileCheck2, BarChart3, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteLayout } from "@/components/site/site-layout";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/landing-photo.jpg";
import storyImg from "@/assets/landing-photo-3.jpg";
import aboutImg from "@/assets/landing-photo-2.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Child of Grace Foundation — Healing Hearts, Shaping Futures" },
      { name: "description", content: "Every child, regardless of their beginning, has value and potential. Join us to provide healing, mentorship, education, and long-term support." },
      { property: "og:title", content: "Child of Grace Foundation" },
      { property: "og:description", content: "Healing Hearts, Shaping Futures — sponsor, donate, volunteer." },
    ],
  }),
});

function HomePage() {
  const [stats, setStats] = useState({ children_count: 0, new_sponsors_today: 0 });

  useEffect(() => {
    supabase.rpc("get_landing_stats").then(({ data }) => {
      if (data) setStats(data as any);
    });
  }, []);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary-soft/50 via-background to-background">
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-40 -right-40 h-[460px] w-[460px] rounded-full bg-warning/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-24">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Healing Hearts, Shaping Futures
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[4rem]">
              Every child, regardless of their beginning, <span className="italic text-primary">has value and potential.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              We provide healing, mentorship, education, and long-term support to help vulnerable
              children build brighter futures.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 gap-2 rounded-full px-6 shadow-soft">
                <Link to="/sponsorship"><Heart className="h-4 w-4" /> Sponsor a Child</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 gap-2 rounded-full px-6">
                <Link to="/donate">Support Our Mission <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px]">
              <div className="absolute inset-0 -rotate-2 rounded-[2.5rem] border border-border/60 bg-card shadow-soft" />
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-border/60 shadow-soft">
                <img src={heroImg} alt="Joyful children with mentors at Child of Grace" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 hidden w-44 rounded-2xl border border-border/60 bg-white p-3.5 shadow-soft sm:block">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Children in care</p>
                <p className="mt-1 font-display text-2xl font-bold">{stats.children_count.toLocaleString()}</p>
                <p className="text-xs text-success">Lives changing every day</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="border-y border-border/40 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Our Impact</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Transforming lives through dignity, healing, and consistent support.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Children Supported", value: Math.max(stats.children_count, 240) },
              { label: "Active Sponsors", value: 180 },
              { label: "Scholarships", value: 92 },
              { label: "Families Assisted", value: 320 },
              { label: "Community Programs", value: 18 },
            ].map((s) => (
              <Card key={s.label} className="rounded-3xl border-border/60 p-6 text-center shadow-soft">
                <p className="font-display text-4xl font-bold text-primary">{s.value.toLocaleString()}+</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-[2rem] border border-border/60 shadow-soft">
            <img src={aboutImg} alt="A caring mentor reading to a child" className="aspect-[5/4] w-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Who We Are</p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
              More than care. A foundation for the future.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Child of Grace Foundation exists to restore dignity, nurture healing, and create
              opportunities for vulnerable children. Our work is not defined by charity alone, but
              by an intentional commitment to emotional healing and mindset transformation.
            </p>
            <p className="mt-3 text-muted-foreground">
              Through long-term care, mentorship, education, and community support, we walk with
              every child until they thrive — not just survive.
            </p>
            <Button asChild className="mt-6 gap-2 rounded-full">
              <Link to="/about">Learn more <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="bg-primary-soft/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Our Approach</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">The values that shape our work</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: HandHeart, title: "Dignity", body: "Every child deserves value, respect, and belonging." },
              { icon: Heart, title: "Healing", body: "Emotional well-being is foundational to growth." },
              { icon: Sparkles, title: "Consistency", body: "Lasting impact comes through long-term commitment." },
              { icon: ShieldCheck, title: "Accountability", body: "Every resource is stewarded responsibly." },
            ].map((v) => (
              <Card key={v.title} className="rounded-3xl border-border/60 bg-white p-6 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Programs</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">How we serve children</h2>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/programs">All programs <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Card key={p.title} className="group overflow-hidden rounded-3xl border-border/60 p-0 shadow-soft transition hover:shadow-glow">
              <div className="relative aspect-[16/10] overflow-hidden bg-primary-soft">
                <div className="flex h-full w-full items-center justify-center">
                  <p.icon className="h-16 w-16 text-primary/40 transition group-hover:scale-110" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* STORIES */}
      <section className="bg-linear-to-b from-background to-primary-soft/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-border/60 shadow-soft">
                <img src={storyImg} alt="A child holding a seedling" className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -right-5 hidden w-56 rounded-2xl border border-border/60 bg-white p-4 shadow-soft sm:block">
                <p className="font-display text-3xl font-bold text-primary">94%</p>
                <p className="text-xs text-muted-foreground">of sponsored children stay in school through secondary</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Stories of Transformation</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">From wounded to thriving</h2>
              <Quote className="mt-6 h-8 w-8 text-primary/40" />
              <blockquote className="mt-2 font-display text-2xl leading-snug">
                "Child of Grace didn't just give me a place to stay — they gave me people who believed
                in me, and a future I could imagine."
              </blockquote>
              <p className="mt-4 text-sm text-muted-foreground">— Ama, scholarship recipient, age 17</p>
              <Button asChild className="mt-6 gap-2 rounded-full">
                <Link to="/stories">Read more stories <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORSHIP CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary via-primary to-primary/80 px-8 py-16 text-primary-foreground shadow-glow sm:px-14 lg:px-20">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">Sponsorship</p>
              <h2 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Change one life. Transform a future.
              </h2>
              <p className="mt-4 max-w-md text-base opacity-90">
                For less than the cost of a weekly coffee, you can give a child consistent care,
                education, and a community that believes in them.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:justify-end">
              <Button asChild size="lg" variant="secondary" className="h-12 gap-2 rounded-full px-6">
                <Link to="/sponsorship">Become a Sponsor <Heart className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/40 bg-transparent px-6 text-white hover:bg-white/10">
                <Link to="/donate">Donate Once</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="border-t border-border/40 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Trust</p>
              <h2 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">Accountability matters.</h2>
              <p className="mt-3 text-muted-foreground">
                We publish annual reports, financial statements, and impact data so every supporter
                knows exactly how their gift is at work.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
              {[
                { icon: FileCheck2, title: "Annual Reports", body: "Yearly review of activities & finances." },
                { icon: ShieldCheck, title: "Governance", body: "Board oversight & audited accounts." },
                { icon: BarChart3, title: "Impact Reports", body: "Outcomes measured every quarter." },
              ].map((t) => (
                <Card key={t.title} className="rounded-3xl border-border/60 p-5 shadow-soft">
                  <t.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-display text-base font-semibold">{t.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Join us in <span className="italic text-primary">shaping futures</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Every gift, every hour, every partnership writes a new chapter for a child.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-12 gap-2 rounded-full px-6 shadow-soft">
            <Link to="/donate"><Heart className="h-4 w-4" /> Donate Today</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6">
            <Link to="/volunteer">Become a Volunteer</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-6">
            <Link to="/contact">Partner With Us</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

const programs = [
  { icon: HomeIcon, title: "Child Care & Protection", body: "Safe homes, trauma-informed care, and consistent guardianship for every child." },
  { icon: GraduationCap, title: "Education Support", body: "School fees, supplies, tutoring, and scholarships from primary through tertiary." },
  { icon: Stethoscope, title: "Health & Wellness", body: "Regular check-ups, nutrition, mental health support, and emergency care." },
  { icon: BookOpen, title: "Mentorship & Life Skills", body: "One-on-one mentoring, life-skills workshops, and career coaching." },
  { icon: Users, title: "Community Empowerment", body: "Family strengthening, vocational training, and local partnerships." },
  { icon: Sparkles, title: "Spiritual & Emotional Care", body: "Counselling, faith formation, and a community of belonging." },
];
