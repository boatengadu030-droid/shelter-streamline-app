import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/lib/use-table";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/dashboard/donations")({ component: DonationsPage });

const COLORS = ["oklch(0.45 0.13 152)", "oklch(0.62 0.14 152)", "oklch(0.78 0.1 145)", "oklch(0.55 0.09 175)", "oklch(0.78 0.16 70)"];

function DonationsPage() {
  const { rows: sponsors } = useTable<any>("sponsors", { order: { column: "created_at" } });
  const { rows: donations } = useTable<any>("donations", { order: { column: "donation_date" } });
  const { rows: children } = useTable<any>("children");
  const { rows: events } = useTable<any>("events");
  const { rows: inventory } = useTable<any>("inventory_items");
  const [openSponsor, setOpenSponsor] = useState(false);
  const [openDonation, setOpenDonation] = useState(false);

  const total = donations.reduce((s, d) => s + Number(d.amount || 0), 0);
  const byType = useMemo(() => {
    const m: Record<string, number> = {};
    donations.forEach((d) => {
      const sp = sponsors.find((s) => s.id === d.sponsor_id);
      const t = sp?.type ?? "individual";
      m[t] = (m[t] ?? 0) + Number(d.amount || 0);
    });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [donations, sponsors]);

  const byTarget = useMemo(() => {
    const m: Record<string, number> = {};
    donations.forEach((d) => { m[d.target_type] = (m[d.target_type] ?? 0) + Number(d.amount || 0); });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [donations]);

  const monthly = useMemo(() => {
    const m: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      m[format(d, "MMM")] = 0;
    }
    donations.forEach((d) => {
      const k = format(new Date(d.donation_date), "MMM");
      if (k in m) m[k] += Number(d.amount || 0);
    });
    return Object.entries(m).map(([month, amount]) => ({ month, amount }));
  }, [donations]);

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Donations & Sponsors"
        title="Generosity, in motion"
        description="Track sponsors, donations, and where every cedi is going."
        actions={
          <>
            <Dialog open={openSponsor} onOpenChange={setOpenSponsor}>
              <DialogTrigger asChild><Button variant="outline" className="gap-2"><Plus className="h-4 w-4" />Sponsor</Button></DialogTrigger>
              <SponsorForm onClose={() => setOpenSponsor(false)} />
            </Dialog>
            <Dialog open={openDonation} onOpenChange={setOpenDonation}>
              <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Donation</Button></DialogTrigger>
              <DonationForm onClose={() => setOpenDonation(false)} sponsors={sponsors} children={children} events={events} inventory={inventory} />
            </Dialog>
          </>
        }
      />

      <div className="space-y-4 px-6 pt-6 lg:px-10">
        <div className="grid gap-3 md:grid-cols-4">
          <Card className="p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">Total raised</p><p className="mt-1 font-display text-2xl font-bold">GHS {total.toLocaleString()}</p></Card>
          <Card className="p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">Donations</p><p className="mt-1 font-display text-2xl font-bold">{donations.length}</p></Card>
          <Card className="p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">Sponsors</p><p className="mt-1 font-display text-2xl font-bold">{sponsors.length}</p></Card>
          <Card className="p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-success" />Avg / donation</p><p className="mt-1 font-display text-2xl font-bold">GHS {donations.length ? Math.round(total / donations.length).toLocaleString() : 0}</p></Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">6-month trend</p>
            <div className="mt-3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                  <Bar dataKey="amount" fill="oklch(0.45 0.13 152)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">By sponsor type</p>
            <div className="mt-3 h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={byType} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} /><Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="donations">
          <TabsList><TabsTrigger value="donations">Donations</TabsTrigger><TabsTrigger value="sponsors">Sponsors</TabsTrigger><TabsTrigger value="targets">By target</TabsTrigger></TabsList>
          <TabsContent value="donations">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Sponsor</TableHead><TableHead>Target</TableHead><TableHead>Category</TableHead><TableHead>Frequency</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {donations.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No donations recorded.</TableCell></TableRow>}
                  {donations.map((d) => {
                    const sp = sponsors.find((s) => s.id === d.sponsor_id);
                    return (
                      <TableRow key={d.id}>
                        <TableCell>{format(new Date(d.donation_date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{sp?.name ?? "—"}</TableCell>
                        <TableCell className="capitalize">{d.target_type}</TableCell>
                        <TableCell className="capitalize">{d.category ?? "—"}</TableCell>
                        <TableCell className="capitalize">{d.frequency.replace("_", " ")}</TableCell>
                        <TableCell className="text-right font-semibold">{d.currency} {Number(d.amount).toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="sponsors">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead className="text-right">Total given</TableHead></TableRow></TableHeader>
                <TableBody>
                  {sponsors.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No sponsors yet.</TableCell></TableRow>}
                  {sponsors.map((s) => {
                    const given = donations.filter((d) => d.sponsor_id === s.id).reduce((sum, d) => sum + Number(d.amount), 0);
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{s.type}</Badge></TableCell>
                        <TableCell>{s.email ?? "—"}</TableCell>
                        <TableCell>{s.phone ?? "—"}</TableCell>
                        <TableCell className="text-right font-semibold">GHS {given.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="targets">
            <Card className="p-6">
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={byTarget} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip /><Bar dataKey="value" fill="oklch(0.62 0.14 152)" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SponsorForm({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({ name: "", type: "individual", email: "", phone: "", contact_person: "", address: "", notes: "" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.from("sponsors").insert(f as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Sponsor added"); onClose();
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add sponsor</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Name *</Label><Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div><Label>Type</Label>
          <Select value={f.type} onValueChange={(v) => setF({ ...f, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Email</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        </div>
        <div><Label>Contact person</Label><Input value={f.contact_person} onChange={(e) => setF({ ...f, contact_person: e.target.value })} /></div>
        <div><Label>Address</Label><Input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
        <div><Label>Notes</Label><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function DonationForm({ onClose, sponsors, children, events, inventory }: any) {
  const [f, setF] = useState({
    sponsor_id: "", amount: 0, currency: "GHS", frequency: "one_time",
    donation_date: new Date().toISOString().slice(0, 10),
    target_type: "general", target_child_id: "", target_event_id: "", target_inventory_id: "",
    category: "", notes: "",
  });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const payload: any = { ...f };
    payload.sponsor_id = f.sponsor_id || null;
    payload.target_child_id = f.target_type === "child" ? (f.target_child_id || null) : null;
    payload.target_event_id = f.target_type === "event" ? (f.target_event_id || null) : null;
    payload.target_inventory_id = f.target_type === "inventory" ? (f.target_inventory_id || null) : null;
    if (f.target_type !== "child") payload.category = null;
    else payload.category = f.category || null;
    const { error } = await supabase.from("donations").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Donation recorded"); onClose();
  }
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>Record donation</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Sponsor</Label>
          <Select value={f.sponsor_id} onValueChange={(v) => setF({ ...f, sponsor_id: v })}>
            <SelectTrigger><SelectValue placeholder="Select sponsor" /></SelectTrigger>
            <SelectContent>{sponsors.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><Label>Amount *</Label><Input type="number" step="0.01" required value={f.amount} onChange={(e) => setF({ ...f, amount: +e.target.value })} /></div>
          <div><Label>Currency</Label><Input value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Date</Label><Input type="date" value={f.donation_date} onChange={(e) => setF({ ...f, donation_date: e.target.value })} /></div>
          <div><Label>Frequency</Label>
            <Select value={f.frequency} onValueChange={(v) => setF({ ...f, frequency: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One-time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Sponsoring</Label>
          <Select value={f.target_type} onValueChange={(v) => setF({ ...f, target_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General fund</SelectItem>
              <SelectItem value="child">An individual child</SelectItem>
              <SelectItem value="event">An upcoming event</SelectItem>
              <SelectItem value="inventory">Inventory item</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {f.target_type === "child" && (
          <>
            <div><Label>Child</Label>
              <Select value={f.target_child_id} onValueChange={(v) => setF({ ...f, target_child_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select child" /></SelectTrigger>
                <SelectContent>{children.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.child_code} · {c.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Sponsorship category</Label>
              <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="feeding">Feeding</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {f.target_type === "event" && (
          <div><Label>Event</Label>
            <Select value={f.target_event_id} onValueChange={(v) => setF({ ...f, target_event_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
              <SelectContent>{events.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        {f.target_type === "inventory" && (
          <div><Label>Inventory item</Label>
            <Select value={f.target_inventory_id} onValueChange={(v) => setF({ ...f, target_inventory_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>{inventory.map((i: any) => <SelectItem key={i.id} value={i.id}>{i.inv_code} · {i.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        <div><Label>Notes</Label><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save donation"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
