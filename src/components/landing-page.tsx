import { Button } from "@/components/ui/button";
import {
  Sprout, ArrowRight, Users, HeartHandshake, Package, ShieldCheck,
  Calendar, FileCheck2, BarChart3, Sparkles,
} from "lucide-react";
import photo1 from "@/assets/landing-photo.jpg";
import photo2 from "@/assets/landing-photo-2.jpg";
import photo3 from "@/assets/landing-photo-3.jpg";

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Top bar */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold tracking-tight">Havenlight</p>
              <p className="text-[10px] tracking-[0.22em] text-muted-foreground">ORPHANAGE OS · EST. 2026</p>
            </div>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#mission" className="transition hover:text-foreground">Mission</a>
            <a href="#platform" className="transition hover:text-foreground">Platform</a>
            <a href="#stories" className="transition hover:text-foreground">Stories</a>
            <a href="#numbers" className="transition hover:text-foreground">Impact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onEnter} className="hidden sm:inline-flex">Sign in</Button>
            <Button onClick={onEnter} className="gap-2 shadow-soft">
              Get started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative">
        {/* Decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] bg-primary-soft/70 blob drift" />
        <div aria-hidden className="pointer-events-none absolute -top-10 right-[-120px] h-[360px] w-[360px] bg-warning/20 blob drift" style={{ animationDelay: "-3s" }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-12 lg:pb-28 lg:pt-14">
          <div className="lg:col-span-7">
            <span className="reveal inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Trusted by caregivers · Live
            </span>

            <h1 className="reveal reveal-d1 mt-6 font-display text-[2.7rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Every child has a <span className="italic text-sheen">story</span>.
              <br />
              We help you tell it well.
            </h1>

            <p className="reveal reveal-d2 mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Havenlight is the quiet, dependable operating system for children's homes —
              records, sponsorships, donations, inventory and compliance, all in one calm place.
            </p>

            <div className="reveal reveal-d3 mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={onEnter} className="h-12 gap-2 px-6 text-base shadow-soft">
                Open the dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onEnter} className="h-12 px-6 text-base">
                I have an account
              </Button>
            </div>

            <div className="reveal reveal-d4 mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Row-level secured</span>
              <span className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-primary" /> Audit ready</span>
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Real-time</span>
            </div>
          </div>

          {/* Photo collage */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              <div className="absolute inset-0 -rotate-2 rounded-[2rem] border border-border/60 bg-card shadow-soft drift" />
              <div className="reveal reveal-d2 absolute inset-0 overflow-hidden rounded-[2rem] border border-border/60 shadow-soft">
                <img
                  src={photo1}
                  alt="Children laughing together at sunset in a community home courtyard"
                  className="h-full w-full object-cover"
                  width={1080}
                  height={1920}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-primary-foreground">
                  <p className="text-[10px] uppercase tracking-[0.22em] opacity-90">Havenlight Home · Accra</p>
                  <p className="font-display text-2xl font-semibold">128 children. One care team.</p>
                </div>
              </div>

              <div className="reveal reveal-d3 absolute -bottom-6 -left-6 hidden w-44 rotate-[-6deg] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft drift sm:block" style={{ animationDelay: "-2s" }}>
                <img src={photo3} alt="A child holding a seedling" className="h-28 w-full object-cover" loading="lazy" width={1024} height={1024} />
                <div className="px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Today</p>
                  <p className="text-sm font-medium">3 new sponsorships</p>
                </div>
              </div>

              <div className="reveal reveal-d4 absolute -top-6 -right-4 hidden w-48 rotate-[5deg] rounded-2xl border border-border/60 bg-card p-4 shadow-soft drift sm:block" style={{ animationDelay: "-4s" }}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Donations · 24h</p>
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="mt-1 font-display text-xl font-bold">GHS 4,820</p>
                <div className="mt-2 flex h-8 items-end gap-1">
                  {[35, 60, 42, 80, 55, 90, 70].map((h, i) => (
                    <span key={i} className="w-2 rounded-sm bg-primary/80" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="border-y border-border/60 bg-card/60 py-4">
          <div className="flex overflow-hidden">
            <div className="marquee-track flex shrink-0 items-center gap-12 whitespace-nowrap pr-12 text-sm font-medium text-muted-foreground">
              {[
                "Care · Dignity · Hope",
                "Children records secured by RLS",
                "Sponsorship analytics in real-time",
                "Inventory with INV-IDs and expiry alerts",
                "Compliance trails ready for audit",
                "Built for caregivers, not bureaucrats",
              ].concat([
                "Care · Dignity · Hope",
                "Children records secured by RLS",
                "Sponsorship analytics in real-time",
                "Inventory with INV-IDs and expiry alerts",
                "Compliance trails ready for audit",
                "Built for caregivers, not bureaucrats",
              ]).map((t, i) => (
                <span key={i} className="flex items-center gap-12">
                  <span>{t}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / NUMBERS */}
      <section id="mission" className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Our quiet promise</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] lg:text-5xl">
              Software that disappears, so caregivers can show up.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Built with the people who run children's homes — not for them. Every screen
              is calm, every record is protected, every donation is honoured.
            </p>
          </div>
          <div id="numbers" className="grid grid-cols-2 gap-4 lg:col-span-7 lg:grid-cols-4">
            {[
              { n: "8", l: "Modules" },
              { n: "100%", l: "RLS secured" },
              { n: "<1s", l: "Live updates" },
              { n: "0", l: "Setup fees" },
            ].map((s, i) => (
              <div key={s.l} className="reveal rounded-2xl border border-border/60 bg-card p-5" style={{ animationDelay: `${i * 0.08}s` }}>
                <p className="font-display text-4xl font-bold">{s.n}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section id="platform" className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">The platform</p>
              <h2 className="mt-3 font-display text-4xl font-bold lg:text-5xl">Everything in one calm place.</h2>
            </div>
            <a onClick={onEnter} className="hidden cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:underline md:inline-flex">
              See it in action <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Users, t: "Children records", d: "Profiles, medical, education and guardianship — every child gets a CH-ID and a story." },
              { i: HeartHandshake, t: "Sponsors & donations", d: "Track gifts, sponsorships and recurring giving with live analytics." },
              { i: Package, t: "Inventory", d: "Supplies in INV-IDs with low-stock and expiry alerts — never run out of essentials." },
              { i: ShieldCheck, t: "Compliance", d: "Documents, due dates and audit-ready trails the inspectors will thank you for." },
              { i: Calendar, t: "Events & visits", d: "Schedule visits, birthdays, medical check-ups and outings — together with the team." },
              { i: BarChart3, t: "Analytics", d: "Donation trends, welfare signals and operational health — at a glance." },
            ].map(({ i: I, t, d }, idx) => (
              <article
                key={t}
                className="reveal group relative overflow-hidden rounded-3xl border border-border/60 bg-background p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition group-hover:scale-110">
                  <I className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/15" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STORY / TESTIMONIAL */}
      <section id="stories" className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-soft">
              <img src={photo2} alt="A caregiver reading to two children" className="h-full w-full object-cover" loading="lazy" width={1024} height={1280} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">A caregiver's note</p>
            <blockquote className="mt-4 font-display text-3xl font-semibold leading-snug lg:text-4xl">
              “For the first time, I close my laptop at 6pm knowing every child's
              records, medication and sponsor letter are exactly where they should be.”
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">AB</div>
              <div>
                <p className="text-sm font-semibold">Akua Boateng</p>
                <p className="text-xs text-muted-foreground">Director, Sunrise Children's Home</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { k: "Faster intake", v: "4×" },
                { k: "Less paperwork", v: "−72%" },
                { k: "Audit pass rate", v: "100%" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-border/60 bg-card p-4">
                  <p className="font-display text-2xl font-bold">{s.v}</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-primary to-primary-soft" />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center text-primary-foreground lg:py-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">Begin today</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] lg:text-6xl">
            Care, dignity and hope — measured every day.
          </h2>
          <p className="mx-auto mt-5 max-w-xl opacity-90">
            Sign up in under a minute. The first account becomes the home's administrator.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={onEnter} className="h-12 bg-background px-6 text-base text-foreground hover:bg-background/90">
              Create your home
            </Button>
            <Button size="lg" variant="outline" onClick={onEnter} className="h-12 border-primary-foreground/40 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10">
              Sign in
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>© Havenlight {new Date().getFullYear()} · Care, dignity and hope.</p>
          <div className="flex items-center gap-5">
            <a href="#mission" className="hover:text-foreground">Mission</a>
            <a href="#platform" className="hover:text-foreground">Platform</a>
            <a href="#stories" className="hover:text-foreground">Stories</a>
            <button onClick={onEnter} className="font-medium text-primary hover:underline">Enter dashboard →</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
