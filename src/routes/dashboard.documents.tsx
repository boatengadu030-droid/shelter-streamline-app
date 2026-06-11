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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Search, Download, Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { signedUrl } from "@/lib/uploads";
import { format } from "date-fns";

export const Route = createFileRoute("/dashboard/documents")({ component: DocsPage });

const CATEGORIES = ["policy", "legal", "finance", "hr", "operations", "report", "other"];

function DocsPage() {
  const { rows, reload } = useTable<any>("documents", { order: { column: "created_at", ascending: false } });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const general = useMemo(() => rows.filter((r) => r.owner_table === "general"), [rows]);
  const filtered = useMemo(() => {
    return general.filter((d) => {
      if (cat !== "all" && d.category !== cat) return false;
      if (!q) return true;
      const hay = `${d.title ?? ""} ${d.file_name} ${d.description ?? ""} ${(d.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [general, q, cat]);

  async function download(d: any) {
    const url = await signedUrl(d.bucket, d.storage_path);
    if (!url) return toast.error("Could not generate link");
    window.open(url, "_blank");
  }
  async function share(d: any) {
    const url = await signedUrl(d.bucket, d.storage_path);
    if (!url) return toast.error("Could not generate link");
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied (valid 60s)");
  }
  async function remove(d: any) {
    if (!confirm(`Delete ${d.file_name}?`)) return;
    await supabase.storage.from(d.bucket).remove([d.storage_path]);
    const { error } = await supabase.from("documents").delete().eq("id", d.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); reload();
  }

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Documents" title="Document Management"
        description="Centralized library for policies, contracts, reports and shared files."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Upload className="h-4 w-4" />Upload</Button></DialogTrigger>
            <UploadForm onClose={() => { setOpen(false); reload(); }} />
          </Dialog>
        } />

      <div className="space-y-4 px-6 pt-6 lg:px-10">
        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search title, file name, tags…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Category</TableHead>
              <TableHead>Tags</TableHead><TableHead>Uploaded</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No documents.</TableCell></TableRow>}
              {filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{d.title || d.file_name}</p>
                        {d.description && <p className="text-xs text-muted-foreground line-clamp-1">{d.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{d.category && <Badge variant="outline" className="capitalize">{d.category}</Badge>}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(d.tags ?? []).map((t: string) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(d.created_at), "PP")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => download(d)} title="Download"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => share(d)} title="Copy share link"><Share2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(d)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

function UploadForm({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return toast.error("Pick a file");
    setBusy(true);
    try {
      const ownerId = crypto.randomUUID();
      const path = `${ownerId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("general-docs").upload(path, file);
      if (upErr) throw upErr;
      const { error } = await supabase.from("documents").insert({
        owner_table: "general", owner_id: ownerId, bucket: "general-docs",
        storage_path: path, file_name: file.name, file_type: file.type,
        title: title || file.name, description, category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      } as any);
      if (error) throw error;
      toast.success("Uploaded"); onClose();
    } catch (err: any) { toast.error(err.message); }
    finally { setBusy(false); }
  }

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Upload document</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>File *</Label><Input type="file" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
        <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Defaults to file name" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Tags (comma-separated)</Label><Input value={tags} onChange={(e) => setTags(e.target.value)} /></div>
        </div>
        <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
