import { useEffect, useState } from "react";
import { Bell, Package, ShieldAlert, CalendarClock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type Notif = {
  id: string;
  kind: "inventory" | "expiry" | "compliance" | "event";
  title: string;
  detail: string;
  at?: string;
};

export function NotificationsBell() {
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem("hl.read") || "[]")); }
    catch { return new Set(); }
  });

  async function load() {
    const in14 = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    const todayIso = new Date().toISOString();
    const [inv, comp, ev] = await Promise.all([
      supabase.from("inventory_items").select("id, name, quantity, low_stock_threshold, expiry_date"),
      supabase.from("compliance_records").select("id, title, due_date, status").in("status", ["overdue", "pending"]),
      supabase.from("events").select("id, title, start_at, location").gte("start_at", todayIso).order("start_at").limit(5),
    ]);
    const list: Notif[] = [];
    (inv.data ?? []).forEach((i: any) => {
      if (Number(i.quantity) <= Number(i.low_stock_threshold)) {
        list.push({ id: `inv-low-${i.id}`, kind: "inventory", title: "Low stock",
          detail: `${i.name} — ${i.quantity} left` });
      }
      if (i.expiry_date && i.expiry_date <= in14) {
        list.push({ id: `inv-exp-${i.id}`, kind: "expiry", title: "Expiring soon",
          detail: `${i.name} expires ${format(new Date(i.expiry_date), "MMM d")}`, at: i.expiry_date });
      }
    });
    (comp.data ?? []).forEach((c: any) => {
      list.push({ id: `comp-${c.id}`, kind: "compliance",
        title: c.status === "overdue" ? "Overdue compliance" : "Compliance pending",
        detail: c.title, at: c.due_date });
    });
    (ev.data ?? []).forEach((e: any) => {
      list.push({ id: `ev-${e.id}`, kind: "event", title: "Upcoming event",
        detail: `${e.title}${e.location ? " · " + e.location : ""}`, at: e.start_at });
    });
    setItems(list);
  }

  useEffect(() => {
    load();
    const ch = supabase.channel("notif")
      .on("postgres_changes", { event: "*", schema: "public" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const unread = items.filter((i) => !readIds.has(i.id)).length;

  function markAllRead() {
    const next = new Set(items.map((i) => i.id));
    setReadIds(next);
    try { localStorage.setItem("hl.read", JSON.stringify([...next])); } catch {}
  }

  const Icon = (k: Notif["kind"]) =>
    k === "inventory" ? Package
    : k === "expiry" ? Sparkles
    : k === "compliance" ? ShieldAlert
    : CalendarClock;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground live-dot">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div>
            <p className="font-display text-sm font-semibold">Notifications</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{items.length} total · {unread} new</p>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllRead}>Mark all read</Button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">All caught up. Nothing needs attention.</p>
          )}
          {items.map((n) => {
            const I = Icon(n.kind);
            const isNew = !readIds.has(n.id);
            return (
              <div key={n.id} className={`flex gap-3 border-b border-border/40 px-4 py-3 last:border-b-0 ${isNew ? "bg-primary-soft/30" : ""}`}>
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <I className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {isNew && <Badge variant="outline" className="h-4 border-primary/40 px-1 text-[9px] text-primary">new</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{n.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
