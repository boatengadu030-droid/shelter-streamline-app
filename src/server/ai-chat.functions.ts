import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { messages: ChatMessage[] }) => {
    if (!Array.isArray(input?.messages)) throw new Error("messages required");
    return { messages: input.messages.slice(-20) };
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    // Pull lightweight live context from the database
    const today = new Date().toISOString().slice(0, 10);
    const in14 = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

    const [ch, sp, inv, comp, ev, don] = await Promise.all([
      supabase.from("children").select("id", { count: "exact", head: true }),
      supabase.from("sponsors").select("id", { count: "exact", head: true }),
      supabase.from("inventory_items").select("name, quantity, low_stock_threshold, expiry_date"),
      supabase.from("compliance_records").select("title, status, due_date").in("status", ["overdue", "pending"]).limit(20),
      supabase.from("events").select("title, start_at, location").gte("start_at", new Date().toISOString()).order("start_at").limit(10),
      supabase.from("donations").select("amount, currency, donation_date").gte("donation_date", today.slice(0, 8) + "01"),
    ]);

    const lowStock = (inv.data ?? []).filter((i: any) => Number(i.quantity) <= Number(i.low_stock_threshold));
    const expiring = (inv.data ?? []).filter((i: any) => i.expiry_date && i.expiry_date <= in14);
    const monthTotal = (don.data ?? []).reduce((s: number, d: any) => s + Number(d.amount || 0), 0);

    const systemContext = `You are Havenlight's helpful assistant for an orphanage management system. Answer concisely and warmly. Use markdown when helpful. Live snapshot:
- Children in care: ${ch.count ?? 0}
- Active sponsors: ${sp.count ?? 0}
- Donations this month: GHS ${monthTotal.toLocaleString()}
- Low-stock items (${lowStock.length}): ${lowStock.slice(0, 8).map((i: any) => `${i.name} (${i.quantity})`).join(", ") || "none"}
- Expiring within 14 days (${expiring.length}): ${expiring.slice(0, 8).map((i: any) => i.name).join(", ") || "none"}
- Pending/overdue compliance (${comp.data?.length ?? 0}): ${(comp.data ?? []).slice(0, 6).map((c: any) => `${c.title} [${c.status}]`).join("; ") || "none"}
- Upcoming events (${ev.data?.length ?? 0}): ${(ev.data ?? []).slice(0, 6).map((e: any) => `${e.title} on ${e.start_at?.slice(0, 10)}`).join("; ") || "none"}

The system has modules: Children, Sponsors, Donations, Inventory, Compliance, Events, Staff. If asked how to do something, give clear step-by-step guidance referencing those modules. If a question is outside the system, answer briefly and stay helpful.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemContext }, ...data.messages],
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Add funds in Settings → Workspace → Usage.");
      const text = await resp.text();
      throw new Error(`AI gateway error: ${text.slice(0, 200)}`);
    }

    const json = await resp.json();
    const reply = json?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a reply.";
    return { reply: reply as string };
  });
