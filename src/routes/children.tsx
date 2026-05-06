import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/lib/use-table";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { uploadDoc } from "@/lib/uploads";
import { format } from "date-fns";

export const Route = createFileRoute("/children")({ component: ChildrenPage });

function ChildrenPage() {
  const { rows } = useTable<any>("children", { order: { column: "created_at" } });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = rows.filter((r) => `${r.full_name} ${r.child_code}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Children"
        title="Children in our care"
        description="Profiles, health, education and document records — kept private and protected."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add child</Button></DialogTrigger>
            <ChildForm onClose={() => setOpen(false)} />
          </Dialog>
        }
      />
      <div className="space-y-4 px-6 pt-6 lg:px-10">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <Card className="col-span-full p-10 text-center text-muted-foreground">No children records yet.</Card>
          )}
          {filtered.map((c) => (
            <Card key={c.id} className="cursor-pointer p-5 transition hover:shadow-glow float-in" onClick={() => setSelected(c)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{c.child_code}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold">{c.full_name}</h3>
                </div>
                {c.is_sensitive && <Badge variant="outline" className="border-warning text-warning">Sensitive</Badge>}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div><span className="text-foreground">DOB:</span> {c.date_of_birth ?? "—"}</div>
                <div className="capitalize"><span className="text-foreground">Gender:</span> {c.gender ?? "—"}</div>
                <div className="col-span-2"><span className="text-foreground">Education:</span> {c.education_status ?? "—"}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && <ChildDetail child={selected} onClose={() => setSelected(null)} />}
      </Dialog>
    </div>
  );
}

function ChildForm({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({
    full_name: "", date_of_birth: "", gender: "male",
    education_status: "", current_grade: "", health_notes: "",
    guardian_info: "", is_sensitive: false,
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("children").insert({
      ...f,
      date_of_birth: f.date_of_birth || null,
    } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Child added");
    onClose();
  }
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>Add child</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Full name *</Label><Input required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Date of birth</Label><Input type="date" value={f.date_of_birth} onChange={(e) => setF({ ...f, date_of_birth: e.target.value })} /></div>
          <div><Label>Gender</Label>
            <Select value={f.gender} onValueChange={(v) => setF({ ...f, gender: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Education status</Label><Input value={f.education_status} onChange={(e) => setF({ ...f, education_status: e.target.value })} placeholder="e.g. In school" /></div>
          <div><Label>Current grade</Label><Input value={f.current_grade} onChange={(e) => setF({ ...f, current_grade: e.target.value })} placeholder="e.g. JHS 1" /></div>
        </div>
        <div><Label>Health notes</Label><Textarea value={f.health_notes} onChange={(e) => setF({ ...f, health_notes: e.target.value })} /></div>
        <div><Label>Guardian info</Label><Input value={f.guardian_info} onChange={(e) => setF({ ...f, guardian_info: e.target.value })} /></div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save child"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function ChildDetail({ child, onClose }: { child: any; onClose: () => void }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [docKind, setDocKind] = useState("medical");

  async function loadDocs() {
    const { data } = await supabase.from("documents").select("*").eq("owner_table", "children").eq("owner_id", child.id).order("created_at", { ascending: false });
    setDocs(data ?? []);
  }
  useState(() => { loadDocs(); });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { await uploadDoc("child-docs", file, "children", child.id, docKind); toast.success("Uploaded"); loadDocs(); }
    catch (err: any) { toast.error(err.message); }
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{child.child_code}</span>
          <span>{child.full_name}</span>
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <Field label="Date of birth" v={child.date_of_birth ?? "—"} />
        <Field label="Gender" v={child.gender ?? "—"} />
        <Field label="Intake date" v={child.intake_date ?? "—"} />
        <Field label="Education" v={child.education_status ?? "—"} />
        <Field label="Grade" v={child.current_grade ?? "—"} />
        <Field label="Guardian" v={child.guardian_info ?? "—"} />
        <div className="col-span-2"><Field label="Health notes" v={child.health_notes ?? "—"} /></div>
      </div>

      <div className="mt-4 border-t pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documents</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Select value={docKind} onValueChange={setDocKind}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
            <Upload className="h-4 w-4" /> Upload
            <input type="file" className="hidden" onChange={onFile} />
          </label>
        </div>
        <div className="mt-3 space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span>{d.file_name}</span><Badge variant="outline" className="capitalize">{d.doc_kind}</Badge></div>
              <span className="text-xs text-muted-foreground">{format(new Date(d.created_at), "MMM d, yyyy")}</span>
            </div>
          ))}
          {docs.length === 0 && <p className="text-xs text-muted-foreground">No documents yet.</p>}
        </div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
    </DialogContent>
  );
}

function Field({ label, v }: { label: string; v: any }) {
  return <div><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1">{v}</p></div>;
}
