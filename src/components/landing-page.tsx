import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sprout, ArrowRight, ShieldCheck, FileCheck2, Sparkles, BarChart3, HeartHandshake, Users, Package } from "lucide-react";
import photo1 from "@/assets/landing-photo.jpg";
import photo3 from "@/assets/landing-photo-3.jpg";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  donations_24h: number;
  donations_currency: string;
  donations_spark: number[];
  new_sponsors_today: number;
  children_count: number;
};

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [stats, setStats] = useState<Stats>({
    donations_24h: 0, donations_currency: "GHS", donations_spark: [0,0,0,0,0,0,0],
    new_sponsors_today: 0, children_count: 0,
  });

  useEffect(() => {
    let active = true;
    async function load() {
      const { data } = await supabase.rpc("get_landing_stats");
      if (active && data) setStats(data as Stats);
    }
    load();
    const ch = supabase.channel("landing-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "sponsors" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "children" }, load)
      .subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, []);

  const spark = stats.donations_spark?.length ? stats.donations_spark : [0,0,0,0,0,0,0];
  const maxSpark = Math.max(...spark, 1);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] bg-primary-soft/70 blob drift" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 right-[-140px] h-[420px] w-[420px] bg-warning/20 blob drift" style={{ animationDelay: "-3s" }} />

      <header className="relative z-30 shrink-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-bold tracking-tight">Havenlight</p>
              <p className="text-[10px] tracking-[0.22em] text-muted-foreground">ORPHANAGE OS · EST. 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onEnter} className="hidden sm:inline-flex">Sign in</Button>
            <Button onClick={onEnter} className="gap-2 shadow-soft">
              Get started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-6 lg:grid-cols-12 lg:gap-10">
          {/* Left: hero copy + live stat strip */}
          <div className="lg:col-span-7">
            <span className="reveal inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Trusted by caregivers · Live
            </span>

            <h1 className="reveal reveal-d1 mt-4 font-display text-[2.2rem] font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-[4rem]">
              Every child has a <span className="italic text-sheen">story</span>.
              <br />
              We help you tell it well.
            </h1>

            <p className="reveal reveal-d2 mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              The quiet, dependable operating system for children's homes — records,
              sponsorships, donations, inventory and compliance, all in one calm place.
            </p>

            <div className="reveal reveal-d3 mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={onEnter} className="h-11 gap-2 px-5 shadow-soft">
                Open the dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onEnter} className="h-11 px-5">
                I have an account
              </Button>
            </div>

            {/* Live mini stats strip */}
            <div className="reveal reveal-d4 mt-6 grid grid-cols-3 gap-3">
              <LiveStat icon={Users} label="Children in care" value={stats.children_count.toLocaleString()} />
              <LiveStat icon={HeartHandshake} label="New sponsors today" value={stats.new_sponsors_today.toLocaleString()} />
              <LiveStat icon={Package} label="Modules" value="8" />
            </div>

            <div className="reveal reveal-d4 mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Row-level secured</span>
              <span className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-primary" /> Audit ready</span>
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Real-time</span>
            </div>
          </div>

          {/* Right: photo collage */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] lg:max-w-[420px]">
              <div className="absolute inset-0 -rotate-2 rounded-[2rem] border border-border/60 bg-card shadow-soft drift" />
              <div className="reveal reveal-d2 absolute inset-0 overflow-hidden rounded-[2rem] border border-border/60 shadow-soft">
                <img src={photo1} alt="Children laughing together at a community home" className="h-full w-full object-cover" width={1080} height={1350} />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-primary-foreground">
                  <p className="text-[10px] uppercase tracking-[0.22em] opacity-90">Havenlight Home · Accra</p>
                  <p className="font-display text-2xl font-semibold">{stats.children_count} children. One care team.</p>
                </div>
              </div>

              <div className="reveal reveal-d3 absolute -bottom-5 -left-6 hidden w-44 rotate-[-6deg] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft drift sm:block" style={{ animationDelay: "-2s" }}>
                <img src={photo3} alt="A child holding a seedling" className="h-24 w-full object-cover" loading="lazy" width={800} height={600} />
                <div className="px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Today</p>
                  <p className="text-sm font-medium">
                    <span className="ticker-pulse inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success live-dot" />
                      {stats.new_sponsors_today} new sponsorship{stats.new_sponsors_today === 1 ? "" : "s"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="reveal reveal-d4 absolute -top-5 -right-4 hidden w-48 rotate-[5deg] rounded-2xl border border-border/60 bg-card p-3.5 shadow-soft drift sm:block" style={{ animationDelay: "-4s" }}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Donations · 24h</p>
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="mt-1 font-display text-xl font-bold">
                  {stats.donations_currency} {Number(stats.donations_24h).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <div className="mt-2 flex h-7 items-end gap-1">
                  {spark.map((v, i) => (
                    <span key={i} className="w-2 rounded-sm bg-primary/80 transition-all" style={{ height: `${Math.max(8, (Number(v) / maxSpark) * 100)}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-3 text-[11px] text-muted-foreground">
          <p>© Havenlight {new Date().getFullYear()} · Care, dignity and hope.</p>
        </div>
      </footer>
    </div>
  );
}

function LiveStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-primary" />
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-success" />
      </div>
      <p className="mt-2 font-display text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
