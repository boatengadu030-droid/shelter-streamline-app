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
import { Plus, MapPin, Calendar, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/dashboard/events")({ component: EventsPage });

const STATUS_OPTIONS = ["upcoming", "ongoing", "completed", "postponed", "cancelled"] as const;

function statusVariant(s: string) {
  switch (s) {
    case "completed": return "default";
    case "cancelled": return "destructive";
    case "postponed": return "secondary";
    case "ongoing": return "default";
    default: return "outline";
  }
}

function toLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EventsPage() {
  const { rows, reload } = useTable<any>("events", { order: { column: "start_at", ascending: true } });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  // Auto-complete: when end_at (or start_at if no end) has passed, flip status to "completed"
  // unless the user manually set it to postponed/cancelled.
  useEffect(() => {
    if (!rows.length) return;
    const now = Date.now();
    const toComplete = rows.filter((e) => {
      if (!["upcoming", "ongoing"].includes(e.status)) return false;
      const endRef = e.end_at ?? e.start_at;
      return endRef && new Date(endRef).getTime() < now;
    });
    if (toComplete.length === 0) return;
    (async () => {
      await supabase.from("events").update({ status: "completed" } as any).in("id", toComplete.map((e) => e.id));
      reload();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Events" title="Events & activities"
        description="Plan, schedule and track everything happening at the home."
        actions={<Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />New event</Button></DialogTrigger>
          <EventForm onClose={() => setOpen(false)} />
        </Dialog>} />
      <div className="grid gap-4 px-6 pt-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {rows.length === 0 && <Card className="col-span-full p-10 text-center text-muted-foreground">No events scheduled.</Card>}
        {rows.map((e) => (
          <Card key={e.id} className="p-5 float-in transition hover:shadow-glow">
            <div className="flex items-start justify-between gap-2">
              <Badge variant={statusVariant(e.status) as any} className="capitalize">{e.status}</Badge>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(e)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold">{e.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{format(new Date(e.start_at), "EEE MMM d, yyyy · HH:mm")}</p>
              {e.location && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{e.location}</p>}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && <EventForm event={editing} onClose={() => setEditing(null)} />}
      </Dialog>
    </div>
  );
}

function EventForm({ event, onClose }: { event?: any; onClose: () => void }) {
  const isEdit = !!event;
  const [f, setF] = useState({
    title: event?.title ?? "",
    description: event?.description ?? "",
    start_at: toLocalInput(event?.start_at) || "",
    end_at: toLocalInput(event?.end_at) || "",
    location: event?.location ?? "",
    status: event?.status ?? "upcoming",
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const payload = {
      title: f.title,
      description: f.description,
      start_at: new Date(f.start_at).toISOString(),
      end_at: f.end_at ? new Date(f.end_at).toISOString() : null,
      location: f.location,
      status: f.status,
    };
    const { error } = isEdit
      ? await supabase.from("events").update(payload as any).eq("id", event.id)
      : await supabase.from("events").insert(payload as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(isEdit ? "Event updated" : "Event created"); onClose();
  }

  async function remove() {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", event.id);
    if (error) return toast.error(error.message);
    toast.success("Event deleted"); onClose();
  }

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{isEdit ? "Edit event" : "New event"}</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Title *</Label><Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Starts *</Label><Input type="datetime-local" required value={f.start_at} onChange={(e) => setF({ ...f, start_at: e.target.value })} /></div>
          <div><Label>Ends</Label><Input type="datetime-local" value={f.end_at} onChange={(e) => setF({ ...f, end_at: e.target.value })} /></div>
        </div>
        <div><Label>Location</Label><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
        <div>
          <Label>Status</Label>
          <Select value={f.status} onValueChange={(v) => setF({ ...f, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="mt-1 text-xs text-muted-foreground">Completed is set automatically after the end date. Use Postponed or Cancelled, then update the date.</p>
        </div>
        <DialogFooter className="gap-2">
          {isEdit && <Button type="button" variant="destructive" onClick={remove}>Delete</Button>}
          <Button type="submit" disabled={busy}>{busy ? "…" : isEdit ? "Save changes" : "Save"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
