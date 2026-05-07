import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, TrendingUp, Users, Package, Calendar } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { format, startOfMonth, startOfQuarter, startOfYear } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

type Period = "monthly" | "quarterly" | "midyear" | "annual";

function periodRange(period: Period, anchor = new Date()) {
  const now = anchor;
  switch (period) {
    case "monthly": {
      const start = startOfMonth(now);
      return { start, end: now, label: format(now, "MMMM yyyy") };
    }
    case "quarterly": {
      const start = startOfQuarter(now);
      return { start, end: now, label: `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}` };
    }
    case "midyear": {
      const y = now.getFullYear();
      const start = new Date(y, 0, 1);
      const end = new Date(y, 5, 30, 23, 59, 59);
      return { start, end: now < end ? now : end, label: `Mid-Year ${y}` };
    }
    case "annual": {
      const start = startOfYear(now);
      return { start, end: now, label: `Annual ${now.getFullYear()}` };
    }
  }
}

const COLORS = ["hsl(var(--primary))", "#a78bfa", "#c4b5fd", "#7c3aed", "#5b21b6", "#ddd6fe"];

function ReportsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const range = useMemo(() => periodRange(period), [period]);
  const [donations, setDonations] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [inv, setInv] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const startISO = range.start.toISOString();
      const endISO = range.end.toISOString();
      const [d, s, c, e, i] = await Promise.all([
        supabase.from("donations").select("*").gte("created_at", startISO).lte("created_at", endISO),
        supabase.from("sponsors").select("*").gte("created_at", startISO).lte("created_at", endISO),
        supabase.from("children").select("id, full_name, intake_date, gender").gte("intake_date", range.start.toISOString().slice(0, 10)),
        supabase.from("events").select("*").gte("start_at", startISO).lte("start_at", endISO),
        supabase.from("inventory_items").select("*"),
      ]);
      setDonations(d.data ?? []); setSponsors(s.data ?? []);
      setChildren(c.data ?? []); setEvents(e.data ?? []); setInv(i.data ?? []);
      setLoading(false);
    })();
  }, [period, range.start.getTime(), range.end.getTime()]);

  const totalRaised = donations.reduce((a, b) => a + Number(b.amount || 0), 0);
  const currency = donations[0]?.currency ?? "GHS";

  // Costs proxy: low-stock value & donations categorized as expenses (target_type general w/ negative not supported) — use donation count breakdown
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    donations.forEach((d) => { const k = d.category ?? "uncategorized"; map[k] = (map[k] || 0) + Number(d.amount || 0); });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [donations]);

  const monthlySeries = useMemo(() => {
    const buckets: Record<string, number> = {};
    donations.forEach((d) => {
      const k = format(new Date(d.created_at), "MMM dd");
      buckets[k] = (buckets[k] || 0) + Number(d.amount || 0);
    });
    return Object.entries(buckets).map(([date, amount]) => ({ date, amount }));
  }, [donations]);

  function exportCSV(name: string, rows: any[]) {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${name}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Child of Grace — Report", 14, 18);
    doc.setFontSize(11); doc.setTextColor(100);
    doc.text(`${range.label}  •  Generated ${format(new Date(), "PPP")}`, 14, 26);

    doc.setTextColor(0); doc.setFontSize(13);
    doc.text("Summary", 14, 38);
    autoTable(doc, {
      startY: 42,
      head: [["Metric", "Value"]],
      body: [
        ["Total raised", `${currency} ${totalRaised.toLocaleString()}`],
        ["Donations recorded", String(donations.length)],
        ["New sponsors / partners", String(sponsors.length)],
        ["Children intaken", String(children.length)],
        ["Events held", String(events.length)],
        ["Inventory items tracked", String(inv.length)],
      ],
    });

    doc.text("Sponsors / Partners", 14, (doc as any).lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [["Name", "Type", "Email", "Phone"]],
      body: sponsors.map((s) => [s.name, s.type, s.email ?? "—", s.phone ?? "—"]),
    });

    doc.text("Donations by category (Account Position)", 14, (doc as any).lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [["Category", `Amount (${currency})`]],
      body: byCategory.map((c) => [c.name, c.value.toLocaleString()]),
      foot: [["Total", totalRaised.toLocaleString()]],
    });

    doc.text("Activities — Events", 14, (doc as any).lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [["Title", "Start", "Location", "Status"]],
      body: events.map((ev) => [ev.title, format(new Date(ev.start_at), "PP"), ev.location ?? "—", ev.status]),
    });

    doc.save(`report-${period}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  }

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Reports" title="Reporting"
        description="Monthly, quarterly, mid-year, and annual reports across activities, sponsors, costs and account position."
        actions={
          <div className="flex gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="midyear">Mid-Year</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportPDF} className="gap-2"><FileText className="h-4 w-4" />Export PDF</Button>
          </div>
        } />

      <div className="space-y-6 px-6 pt-6 lg:px-10">
        <p className="text-sm text-muted-foreground">Period: <span className="font-medium text-foreground">{range.label}</span></p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={TrendingUp} label="Total raised" value={`${currency} ${totalRaised.toLocaleString()}`} />
          <Stat icon={Users} label="New sponsors" value={String(sponsors.length)} />
          <Stat icon={Calendar} label="Events" value={String(events.length)} />
          <Stat icon={Package} label="Children intaken" value={String(children.length)} />
        </div>

        <Tabs defaultValue="activities">
          <TabsList>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors / Partners</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="account">Account Position</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Events held</h3>
                <Button size="sm" variant="outline" onClick={() => exportCSV("events", events)} className="gap-2"><Download className="h-3 w-3" />CSV</Button>
              </div>
              <SimpleTable rows={events} cols={[["title","Title"],["start_at","Start"],["location","Location"],["status","Status"]]} fmt={{ start_at: (v) => format(new Date(v), "PP") }} />
            </Card>
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Children intaken</h3>
                <Button size="sm" variant="outline" onClick={() => exportCSV("children", children)} className="gap-2"><Download className="h-3 w-3" />CSV</Button>
              </div>
              <SimpleTable rows={children} cols={[["full_name","Name"],["gender","Gender"],["intake_date","Intake date"]]} />
            </Card>
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-4">
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">New sponsors & partners</h3>
                <Button size="sm" variant="outline" onClick={() => exportCSV("sponsors", sponsors)} className="gap-2"><Download className="h-3 w-3" />CSV</Button>
              </div>
              <SimpleTable rows={sponsors} cols={[["name","Name"],["type","Type"],["email","Email"],["phone","Phone"]]} />
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <Card className="p-4">
              <h3 className="mb-3 font-display text-lg font-semibold">Inventory snapshot (cost drivers)</h3>
              <SimpleTable rows={inv} cols={[["name","Item"],["category","Category"],["quantity","Qty"],["unit","Unit"],["low_stock_threshold","Low stock at"]]} />
              <div className="mt-3 text-right">
                <Button size="sm" variant="outline" onClick={() => exportCSV("inventory", inv)} className="gap-2"><Download className="h-3 w-3" />CSV</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-4">
                <h3 className="mb-3 font-display text-lg font-semibold">Donations over period</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <BarChart data={monthlySeries}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="mb-3 font-display text-lg font-semibold">By category</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={80} label>
                        {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Donation ledger</h3>
                <Button size="sm" variant="outline" onClick={() => exportCSV("donations", donations)} className="gap-2"><Download className="h-3 w-3" />CSV</Button>
              </div>
              <SimpleTable rows={donations} cols={[["donation_date","Date"],["amount","Amount"],["currency","Ccy"],["category","Category"],["frequency","Frequency"]]} />
              <div className="mt-3 flex justify-end border-t pt-3 text-sm">
                <span className="mr-2 text-muted-foreground">Total:</span>
                <span className="font-semibold">{currency} {totalRaised.toLocaleString()}</span>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {loading && <p className="text-center text-sm text-muted-foreground">Loading…</p>}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary-soft p-2 text-primary"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function SimpleTable({ rows, cols, fmt = {} }: { rows: any[]; cols: [string, string][]; fmt?: Record<string, (v: any) => string> }) {
  return (
    <Table>
      <TableHeader><TableRow>{cols.map(([k, l]) => <TableHead key={k}>{l}</TableHead>)}</TableRow></TableHeader>
      <TableBody>
        {rows.length === 0 && <TableRow><TableCell colSpan={cols.length} className="py-6 text-center text-muted-foreground">No data in this period.</TableCell></TableRow>}
        {rows.map((r, i) => (
          <TableRow key={r.id ?? i}>
            {cols.map(([k]) => <TableCell key={k}>{r[k] == null ? "—" : (fmt[k] ? fmt[k](r[k]) : String(r[k]))}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
