import { Button } from "@/components/ui/button";
import { Sprout, Users, HeartHandshake, Package, ShieldCheck, ArrowRight } from "lucide-react";
import hero from "@/assets/landing-hero.jpg";

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-bold">Havenlight</p>
            <p className="text-[10px] tracking-[0.18em] text-muted-foreground">ORPHANAGE OS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onEnter}>Sign in</Button>
          <Button onClick={onEnter} className="gap-2">Get started <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-12">
        <div className="float-in">
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Care · Dignity · Hope
          </span>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] lg:text-6xl">
            The calm operations system for modern orphanages.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Havenlight brings children's records, sponsorships, donations, inventory and compliance
            into one quiet place — so caregivers can focus on the children, not the paperwork.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" onClick={onEnter} className="gap-2">
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onEnter}>I already have an account</Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { n: "8", l: "Modules" },
              { n: "100%", l: "RLS secured" },
              { n: "Real‑time", l: "Updates" },
              { n: "Audit", l: "Ready" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border/60 bg-card p-3">
                <p className="font-display text-2xl font-bold">{s.n}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary-soft/60 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border/60 shadow-soft">
            <img src={hero} alt="Havenlight orphanage with children playing in the garden" width={1536} height={1024} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border/60 bg-card p-4 shadow-soft sm:block float-in">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Live signal</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="live-dot inline-block h-2 w-2 rounded-full bg-success" />
              <p className="text-sm font-medium">All operations healthy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Users, t: "Children records", d: "Profiles, medical, education, guardianship — all in CH‑ID." },
            { i: HeartHandshake, t: "Sponsors & donations", d: "Track gifts, sponsorships and live analytics." },
            { i: Package, t: "Inventory", d: "Supplies in INV‑ID with low‑stock and expiry alerts." },
            { i: ShieldCheck, t: "Compliance", d: "Documents, due dates and audit‑ready trails." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="rounded-2xl border border-border/60 bg-background p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <I className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© Havenlight {new Date().getFullYear()} · Care, dignity and hope.</p>
          <button onClick={onEnter} className="text-primary underline">Enter the dashboard →</button>
        </div>
      </footer>
    </div>
  );
}
