import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, TrendingUp, Users, Package, AlertTriangle, HeartHandshake, Sparkles, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { format } from "date-fns";
import bgPhoto from "@/assets/bg.jpg";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const [stats, setStats] = useState({
    children: 0, sponsors: 0, lowStock: 0, expiring: 0,
    overdueCompliance: 0, upcomingEvents: 0,
    monthDonations: 0, totalDonations: 0,
  });
  const [trend, setTrend] = useState<{ day: string; amount: number }[]>([]);
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);

  async function load() {
    const today = new Date();
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const in14 = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

    const [
      ch, sp, inv, comp, ev, donAll, donMonth, donRecent,
    ] = await Promise.all([
      supabase.from("children").select("id", { count: "exact", head: true }),
      supabase.from("sponsors").select("id", { count: "exact", head: true }),
      supabase.from("inventory_items").select("id, name, quantity, low_stock_threshold, expiry_date"),
      supabase.from("compliance_records").select("id, title, due_date, status").in("status", ["overdue", "pending"]),
      supabase.from("events").select("id, title, start_at, location").gte("start_at", new Date().toISOString()).order("start_at").limit(5),
      supabase.from("donations").select("amount"),
      supabase.from("donations").select("amount, donation_date").gte("donation_date", startMonth.slice(0, 10)),
      supabase.from("donations").select("id, amount, currency, donation_date, sponsors(name)").order("created_at", { ascending: false }).limit(5),
    ]);

    const lowStock = (inv.data ?? []).filter((i) => Number(i.quantity) <= Number(i.low_stock_threshold)).length;
    const expiring = (inv.data ?? []).filter((i) => i.expiry_date && i.expiry_date <= in14).length;
    const totalDonations = (donAll.data ?? []).reduce((s, d) => s + Number(d.amount || 0), 0);
    const monthDonations = (donMonth.data ?? []).reduce((s, d) => s + Number(d.amount || 0), 0);

    // Build 30-day trend
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      days[d] = 0;
    }
    (donMonth.data ?? []).forEach((d) => {
      const k = String(d.donation_date);
      if (k in days) days[k] += Number(d.amount || 0);
    });
    setTrend(Object.entries(days).map(([day, amount]) => ({ day: format(new Date(day), "MMM d"), amount })));

    setStats({
      children: ch.count ?? 0,
      sponsors: sp.count ?? 0,
      lowStock,
      expiring,
      overdueCompliance: (comp.data ?? []).filter((c) => c.status === "overdue").length,
      upcomingEvents: (ev.data ?? []).length,
      monthDonations,
      totalDonations,
    });
    setRecentDonations(donRecent.data ?? []);
    setUpcoming(ev.data ?? []);

    const a: any[] = [];
    (inv.data ?? []).filter((i) => Number(i.quantity) <= Number(i.low_stock_threshold)).slice(0, 3).forEach((i) =>
      a.push({ kind: "inventory", text: `${i.name} is low (${i.quantity} left)` }));
    (comp.data ?? []).slice(0, 2).forEach((c) => a.push({ kind: "compliance", text: `${c.title} — ${c.status}` }));
    setAlerts(a);
  }

  useEffect(() => {
    load();
    const ch = supabase.channel("dash")
      .on("postgres_changes", { event: "*", schema: "public" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const monthLabel = useMemo(() => format(new Date(), "MMMM yyyy"), []);

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome back"
        description="Here's a calm, current view of the home today."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" />{monthLabel}</Button>
            <Button asChild className="gap-2"><Link to="/donations"><Plus className="h-4 w-4" />New donation</Link></Button>
          </>
        }
      />

      <div className="space-y-6 px-6 pt-6 lg:px-10">
        {/* Hero card */}
        <Card className="reveal relative overflow-hidden border-0 shadow-elegant min-h-[340px] group">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={bgPhoto}
              alt="Children laughing together"
              className="absolute inset-0 h-full w-full object-cover animate-[kenburns_22s_ease-in-out_infinite_alternate] transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Floating decorative orbs */}
          <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl drift" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-warning/20 blur-3xl animate-[float_9s_ease-in-out_infinite]" />

          <div className="relative grid gap-6 p-8 lg:grid-cols-[1.4fr_1fr] lg:p-12">
            <div className="text-primary-foreground">
              <div className="reveal reveal-d1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/80">
                <MapPin className="h-3 w-3" /> Havenlight Home · Accra
              </div>
              <h2 className="reveal reveal-d2 mt-3 font-display text-4xl font-bold leading-[1.05] lg:text-6xl">
                {stats.children} {stats.children === 1 ? "child" : "children"},<br />
                <span className="italic font-normal opacity-95">cared for today.</span>
              </h2>
              <p className="reveal reveal-d3 mt-4 max-w-lg text-sm text-primary-foreground/85 lg:text-base">
                {alerts.length === 0
                  ? "Every signal is calm. The home is running smoothly across welfare, inventory and compliance."
                  : `${stats.lowStock + stats.expiring} welfare alerts and ${stats.overdueCompliance} overdue compliance items need your attention this week.`}
              </p>
              <div className="reveal reveal-d4 mt-6 flex flex-wrap gap-2">
                <Badge className="bg-white/15 text-primary-foreground border-white/20 backdrop-blur transition-all hover:bg-white/25 hover:scale-105">
                  <Sparkles className="mr-1 h-3 w-3" /> {alerts.length === 0 ? "All systems healthy" : `${alerts.length} live alerts`}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-primary-foreground bg-white/5 backdrop-blur transition-all hover:bg-white/15 hover:scale-105">
                  {stats.sponsors} active sponsors
                </Badge>
                <Badge variant="outline" className="border-white/30 text-primary-foreground bg-white/5 backdrop-blur transition-all hover:bg-white/15 hover:scale-105">
                  GHS {stats.totalDonations.toLocaleString(undefined, { maximumFractionDigits: 0 })} raised
                </Badge>
              </div>
            </div>

            <div className="hidden lg:flex flex-col justify-end gap-3">
              <div className="reveal reveal-d2 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/15 text-primary-foreground transition-all hover:bg-white/15 hover:-translate-y-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">This month</p>
                <p className="mt-1 font-display text-3xl font-bold">
                  GHS {stats.monthDonations.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs opacity-80">in donations received</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="reveal reveal-d3 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15 text-primary-foreground transition-all hover:bg-white/15 hover:-translate-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Events</p>
                  <p className="mt-1 font-display text-2xl font-bold">{stats.upcomingEvents}</p>
                </div>
                <div className="reveal reveal-d4 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15 text-primary-foreground transition-all hover:bg-white/15 hover:-translate-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Low stock</p>
                  <p className="mt-1 font-display text-2xl font-bold">{stats.lowStock}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stat grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Children in care" value={stats.children} accent="text-primary" />
          <StatCard icon={HeartHandshake} label="Active sponsors" value={stats.sponsors} accent="text-success" />
          <StatCard icon={Package} label="Low stock items" value={stats.lowStock} accent="text-warning" />
          <StatCard icon={AlertTriangle} label="Compliance overdue" value={stats.overdueCompliance} accent="text-destructive" />
        </div>

        {/* Donations chart */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Donations · 30 days</p>
                <h3 className="mt-1 font-display text-2xl font-bold">
                  GHS {stats.monthDonations.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </h3>
              </div>
              <Badge variant="outline" className="gap-1"><TrendingUp className="h-3 w-3" /> live</Badge>
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.45 0.13 152)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="oklch(0.45 0.13 152)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                  <Area type="monotone" dataKey="amount" stroke="oklch(0.45 0.13 152)" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live alerts</p>
            <div className="mt-4 space-y-3">
              {alerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts. Everything calm.</p>}
              {alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-warning live-dot" />
                  <div className="text-sm">
                    <p className="font-medium capitalize">{a.kind}</p>
                    <p className="text-muted-foreground">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent + upcoming */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Recent donations</h3>
              <Link to="/donations" className="text-xs text-primary underline">View all</Link>
            </div>
            <div className="mt-4 divide-y divide-border/60">
              {recentDonations.length === 0 && <p className="py-6 text-sm text-muted-foreground">No donations yet — record your first one.</p>}
              {recentDonations.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{d.sponsors?.name ?? "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(d.donation_date), "MMM d, yyyy")}</p>
                  </div>
                  <p className="font-semibold">{d.currency} {Number(d.amount).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Upcoming events</h3>
              <Link to="/events" className="text-xs text-primary underline">View all</Link>
            </div>
            <div className="mt-4 divide-y divide-border/60">
              {upcoming.length === 0 && <p className="py-6 text-sm text-muted-foreground">No events scheduled.</p>}
              {upcoming.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.location ?? "—"}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(e.start_at), "MMM d · HH:mm")}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: string }) {
  return (
    <Card className="p-5 count-in">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </Card>
  );
}
