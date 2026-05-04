import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/lib/use-table";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, FileText, ShieldCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { uploadDoc } from "@/lib/uploads";

export const Route = createFileRoute("/staff")({ component: StaffPage });

function StaffPage() {
  const { rows } = useTable<any>("staff", { order: { column: "created_at" } });
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<any | null>(null);
  return (
    <div className="pb-12">
      <PageHeader eyebrow="Staff & Volunteers" title="The people who make it possible"
        description="Profiles, certifications, schedules and HR documents."
        actions={<Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add person</Button></DialogTrigger>
          <Form onClose={() => setOpen(false)} />
        </Dialog>} />
      <div className="space-y-4 px-6 pt-6 lg:px-10">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Type</TableHead><TableHead>Phone</TableHead><TableHead>Background check</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No staff records.</TableCell></TableRow>}
              {rows.map((s) => (
                <TableRow key={s.id} className="cursor-pointer" onClick={() => setSel(s)}>
                  <TableCell className="font-medium">{s.full_name}</TableCell>
                  <TableCell>{s.position ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline">{s.is_volunteer ? "Volunteer" : "Staff"}</Badge></TableCell>
                  <TableCell>{s.phone ?? "—"}</TableCell>
                  <TableCell>{s.background_check_done ? <Badge className="bg-success/15 text-success gap-1"><ShieldCheck className="h-3 w-3" />Cleared</Badge> : <Badge variant="outline">Pending</Badge>}</TableCell>
                  <TableCell><Button variant="ghost" size="sm">Open</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>{sel && <Detail s={sel} onClose={() => setSel(null)} />}</Dialog>
    </div>
  );
}

function Form({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({ full_name: "", position: "", email: "", phone: "", hire_date: "", is_volunteer: false, shift_schedule: "", background_check_done: false, certifications: "", notes: "" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.from("staff").insert({ ...f, hire_date: f.hire_date || null } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onClose();
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add staff or volunteer</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Full name *</Label><Input required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Position</Label><Input value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} /></div>
          <div><Label>Type</Label>
            <Select value={f.is_volunteer ? "volunteer" : "staff"} onValueChange={(v) => setF({ ...f, is_volunteer: v === "volunteer" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="staff">Staff</SelectItem><SelectItem value="volunteer">Volunteer</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Email</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Hire date</Label><Input type="date" value={f.hire_date} onChange={(e) => setF({ ...f, hire_date: e.target.value })} /></div>
          <div><Label>Shift schedule</Label><Input value={f.shift_schedule} onChange={(e) => setF({ ...f, shift_schedule: e.target.value })} placeholder="e.g. Mon-Fri 8-4" /></div>
        </div>
        <div><Label>Certifications</Label><Input value={f.certifications} onChange={(e) => setF({ ...f, certifications: e.target.value })} /></div>
        <div className="flex items-center gap-3"><Switch checked={f.background_check_done} onCheckedChange={(v) => setF({ ...f, background_check_done: v })} /><Label>Background check done</Label></div>
        <div><Label>Notes</Label><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "…" : "Save"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function Detail({ s, onClose }: { s: any; onClose: () => void }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [kind, setKind] = useState("employment");
  async function loadDocs() {
    const { data } = await supabase.from("documents").select("*").eq("owner_table", "staff").eq("owner_id", s.id);
    setDocs(data ?? []);
  }
  useEffect(() => { loadDocs(); }, [s.id]);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { await uploadDoc("staff-docs", file, "staff", s.id, kind); toast.success("Uploaded"); loadDocs(); }
    catch (err: any) { toast.error(err.message); }
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{s.full_name}</DialogTitle></DialogHeader>
      <div className="space-y-1 text-sm">
        <p><span className="text-muted-foreground">Position:</span> {s.position ?? "—"}</p>
        <p><span className="text-muted-foreground">Phone:</span> {s.phone ?? "—"}</p>
        <p><span className="text-muted-foreground">Email:</span> {s.email ?? "—"}</p>
        <p><span className="text-muted-foreground">Schedule:</span> {s.shift_schedule ?? "—"}</p>
        <p><span className="text-muted-foreground">Certifications:</span> {s.certifications ?? "—"}</p>
      </div>
      <div className="border-t pt-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Records</p>
        <div className="mt-2 flex items-center gap-2">
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="employment">Employment</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="background_check">Background check</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
            <Upload className="h-4 w-4" /> Upload <input type="file" className="hidden" onChange={onFile} />
          </label>
        </div>
        <div className="mt-3 space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />{d.file_name}<Badge variant="outline" className="capitalize">{d.doc_kind}</Badge>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
    </DialogContent>
  );
}
