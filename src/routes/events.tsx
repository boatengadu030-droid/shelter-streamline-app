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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/events")({ component: EventsPage });

function EventsPage() {
  const { rows } = useTable<any>("events", { order: { column: "start_at", ascending: true } });
  const [open, setOpen] = useState(false);
  return (
    <div className="pb-12">
      <PageHeader eyebrow="Events" title="Events & activities"
        description="Plan, schedule and track everything happening at the home."
        actions={<Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />New event</Button></DialogTrigger>
          <Form onClose={() => setOpen(false)} />
        </Dialog>} />
      <div className="grid gap-4 px-6 pt-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {rows.length === 0 && <Card className="col-span-full p-10 text-center text-muted-foreground">No events scheduled.</Card>}
        {rows.map((e) => (
          <Card key={e.id} className="p-5 float-in transition hover:shadow-glow">
            <Badge variant="outline" className="capitalize">{e.status}</Badge>
            <h3 className="mt-3 font-display text-xl font-semibold">{e.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{format(new Date(e.start_at), "EEE MMM d, yyyy · HH:mm")}</p>
              {e.location && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{e.location}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Form({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({ title: "", description: "", start_at: "", end_at: "", location: "", status: "upcoming" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.from("events").insert({
      ...f,
      start_at: new Date(f.start_at).toISOString(),
      end_at: f.end_at ? new Date(f.end_at).toISOString() : null,
    } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Event created"); onClose();
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New event</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Title *</Label><Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div><Label>Description</Label><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Starts *</Label><Input type="datetime-local" required value={f.start_at} onChange={(e) => setF({ ...f, start_at: e.target.value })} /></div>
          <div><Label>Ends</Label><Input type="datetime-local" value={f.end_at} onChange={(e) => setF({ ...f, end_at: e.target.value })} /></div>
        </div>
        <div><Label>Location</Label><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "…" : "Save"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
