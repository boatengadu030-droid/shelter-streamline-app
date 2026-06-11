import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/lib/use-table";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/inventory")({ component: InventoryPage });

function InventoryPage() {
  const { rows } = useTable<any>("inventory_items", { order: { column: "created_at" } });
  const [open, setOpen] = useState(false);
  const [moveItem, setMoveItem] = useState<any | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const in14 = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const lowCount = rows.filter((r) => Number(r.quantity) <= Number(r.low_stock_threshold)).length;
  const expCount = rows.filter((r) => r.expiry_date && r.expiry_date <= in14).length;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Inventory"
        title="Inventory & supplies"
        description="Food, clothing, medical and assets — every item with a unique INV ID."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add item</Button></DialogTrigger>
            <ItemForm onClose={() => setOpen(false)} />
          </Dialog>
        }
      />
      <div className="space-y-4 px-6 pt-6 lg:px-10">
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total items</p><p className="mt-1 font-display text-2xl font-bold">{rows.length}</p></Card>
          <Card className="p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-warning" />Low stock</p><p className="mt-1 font-display text-2xl font-bold text-warning">{lowCount}</p></Card>
          <Card className="p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3 text-destructive" />Expiring ≤ 14d</p><p className="mt-1 font-display text-2xl font-bold text-destructive">{expCount}</p></Card>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Item</TableHead><TableHead>Category</TableHead>
              <TableHead className="text-right">Qty</TableHead><TableHead>Expiry</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 && <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No inventory yet.</TableCell></TableRow>}
              {rows.map((r) => {
                const low = Number(r.quantity) <= Number(r.low_stock_threshold);
                const exp = r.expiry_date && r.expiry_date <= today;
                const expSoon = r.expiry_date && r.expiry_date <= in14 && !exp;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs text-primary">{r.inv_code}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="capitalize">{r.category}</TableCell>
                    <TableCell className="text-right">{r.quantity} {r.unit}</TableCell>
                    <TableCell>{r.expiry_date ?? "—"}</TableCell>
                    <TableCell>
                      {exp ? <Badge variant="destructive">Expired</Badge>
                        : low ? <Badge className="bg-warning text-warning-foreground">Low</Badge>
                        : expSoon ? <Badge variant="outline" className="border-warning text-warning">Expiring</Badge>
                        : <Badge variant="secondary" className="bg-success/15 text-success">OK</Badge>}
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm" onClick={() => setMoveItem(r)}>Log</Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={!!moveItem} onOpenChange={(o) => !o && setMoveItem(null)}>
        {moveItem && <MovementForm item={moveItem} onClose={() => setMoveItem(null)} />}
      </Dialog>
    </div>
  );
}

function ItemForm({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({ name: "", category: "food", quantity: 0, unit: "unit", low_stock_threshold: 5, expiry_date: "", location: "", notes: "" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.from("inventory_items").insert({ ...f, expiry_date: f.expiry_date || null } as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Item added"); onClose();
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add inventory item</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Name *</Label><Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Category</Label>
            <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="asset">Asset</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Unit</Label><Input value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Quantity</Label><Input type="number" value={f.quantity} onChange={(e) => setF({ ...f, quantity: +e.target.value })} /></div>
          <div><Label>Low stock at</Label><Input type="number" value={f.low_stock_threshold} onChange={(e) => setF({ ...f, low_stock_threshold: +e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Expiry date</Label><Input type="date" value={f.expiry_date} onChange={(e) => setF({ ...f, expiry_date: e.target.value })} /></div>
          <div><Label>Location</Label><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
        </div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function MovementForm({ item, onClose }: { item: any; onClose: () => void }) {
  const [movement, setMovement] = useState("out");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.from("inventory_logs").insert({ item_id: item.id, movement, quantity: qty, reason } as any);
    if (!error) {
      const delta = movement === "in" ? qty : movement === "adjust" ? 0 : -qty;
      const newQty = movement === "adjust" ? qty : Number(item.quantity) + delta;
      await supabase.from("inventory_items").update({ quantity: newQty }).eq("id", item.id);
    }
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Logged"); onClose();
  }
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{item.inv_code} · {item.name}</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Movement</Label>
          <Select value={movement} onValueChange={setMovement}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="in">Stock in</SelectItem>
              <SelectItem value="out">Used / out</SelectItem>
              <SelectItem value="adjust">Adjust to</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Quantity</Label><Input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} /></div>
        <div><Label>Reason / note</Label><Input value={reason} onChange={(e) => setReason(e.target.value)} /></div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Log movement"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
