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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { uploadDoc } from "@/lib/uploads";

export const Route = createFileRoute("/dashboard/compliance")({ component: CompliancePage });

function CompliancePage() {
  const { rows } = useTable<any>("compliance_records", { order: { column: "due_date", ascending: true } });
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<any | null>(null);

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Compliance" title="Compliance & records"
        description="Regulatory items, audits and supporting documents."
        actions={<Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add record</Button></DialogTrigger>
          <Form onClose={() => setOpen(false)} />
        </Dialog>} />
      <div className="space-y-4 px-6 pt-6 lg:px-10">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No records.</TableCell></TableRow>}
              {rows.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setSel(r)}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.due_date ?? "—"}</TableCell>
                  <TableCell><StatusBadge s={r.status} /></TableCell>
                  <TableCell><Button variant="ghost" size="sm">Open</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>{sel && <Detail rec={sel} onClose={() => setSel(null)} />}</Dialog>
    </div>
  );
}

function StatusBadge({ s }: { s: string }) {
  const map: any = {
    compliant: <Badge className="bg-success/15 text-success">Compliant</Badge>,
    pending: <Badge variant="outline">Pending</Badge>,
    overdue: <Badge variant="destructive">Overdue</Badge>,
    expired: <Badge variant="destructive">Expired</Badge>,
  };
  return map[s] ?? <Badge>{s}</Badge>;
}

function Form({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({ title: "", category: "general", description: "", status: "pending", due_date: "" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.from("compliance_records").insert({ ...f, due_date: f.due_date || null } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onClose();
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add compliance record</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Title *</Label><Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Category</Label><Input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></div>
          <div><Label>Status</Label>
            <Select value={f.status} onValueChange={(v) => setF({ ...f, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div><Label>Due date</Label><Input type="date" value={f.due_date} onChange={(e) => setF({ ...f, due_date: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "…" : "Save"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function Detail({ rec, onClose }: { rec: any; onClose: () => void }) {
  const [docs, setDocs] = useState<any[]>([]);
  async function loadDocs() {
    const { data } = await supabase.from("documents").select("*").eq("owner_table", "compliance_records").eq("owner_id", rec.id);
    setDocs(data ?? []);
  }
  useEffect(() => { loadDocs(); }, [rec.id]);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { await uploadDoc("compliance-docs", file, "compliance_records", rec.id); toast.success("Uploaded"); loadDocs(); }
    catch (err: any) { toast.error(err.message); }
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{rec.title}</DialogTitle></DialogHeader>
      <div className="space-y-2 text-sm">
        <p><span className="text-muted-foreground">Category:</span> {rec.category}</p>
        <p><span className="text-muted-foreground">Due:</span> {rec.due_date ?? "—"}</p>
        <p><span className="text-muted-foreground">Status:</span> <StatusBadge s={rec.status} /></p>
        <p>{rec.description}</p>
      </div>
      <div className="border-t pt-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documents</p>
        <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
          <Upload className="h-4 w-4" /> Upload document
          <input type="file" className="hidden" onChange={onFile} />
        </label>
        <div className="mt-3 space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />{d.file_name}
            </div>
          ))}
        </div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
    </DialogContent>
  );
}
