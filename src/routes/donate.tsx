import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Utensils, GraduationCap, Stethoscope, Gift } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/donate")({
  component: DonatePage,
  head: () => ({
    meta: [
      { title: "Donate — Child of Grace Foundation" },
      { name: "description", content: "Give once or monthly to fund care, education, and health for vulnerable children." },
      { property: "og:title", content: "Donate — Child of Grace Foundation" },
      { property: "og:description", content: "Your gift becomes care, school fees, meals, and hope." },
    ],
  }),
});

const presets = [25, 50, 100, 250, 500];

function DonatePage() {
  const [freq, setFreq] = useState<"one" | "monthly">("monthly");
  const [fund, setFund] = useState("general");
  const [amount, setAmount] = useState(60);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Thank you! Your gift is being processed.", {
      description: "A confirmation email is on its way.",
    });
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Give"
        title="Your gift becomes care, school fees, meals, and hope."
        subtitle="100% of every donation is stewarded with transparency. Choose where you'd like your gift to go."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="rounded-3xl border-border/60 p-8 shadow-soft lg:col-span-3">
            <form onSubmit={submit} className="space-y-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Frequency</p>
                <div className="mt-2 inline-flex rounded-full border border-border p-1">
                  {(["monthly", "one"] as const).map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setFreq(f)}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition ${freq === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      {f === "monthly" ? "Monthly" : "One-time"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Direct your gift</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {funds.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFund(f.id)}
                      className={`rounded-2xl border p-3 text-left text-xs transition ${fund === f.id ? "border-primary bg-primary-soft" : "border-border hover:bg-muted"}`}
                    >
                      <f.icon className="h-5 w-5 text-primary" />
                      <p className="mt-2 font-semibold">{f.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Amount</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(p)}
                      className={`rounded-full border px-5 py-2 text-sm font-medium transition ${amount === p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                    >
                      ${p}
                    </button>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      className="w-28 rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input required placeholder="Your full name" className="rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input required type="email" placeholder="you@email.com" className="rounded-full" />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2 rounded-full">
                <Heart className="h-4 w-4" /> Give ${amount} {freq === "monthly" ? "/ month" : ""}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Secure payment processing — coming soon. Your details are kept private.
              </p>
            </form>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <Card className="rounded-3xl border-border/60 bg-primary-soft/40 p-6 shadow-soft">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Your impact</p>
              <p className="mt-2 font-display text-2xl leading-snug">{impactCopy(amount)}</p>
            </Card>
            <Card className="rounded-3xl border-border/60 p-6 shadow-soft">
              <p className="font-display text-base font-semibold">Other ways to give</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Bank transfer — contact us for details</li>
                <li>• Workplace giving / employer match</li>
                <li>• In-kind donations (books, clothing, supplies)</li>
                <li>• Legacy giving &amp; wills</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function impactCopy(amount: number) {
  if (amount >= 250) return `$${amount} fully funds a child's term at school — books, uniforms, and meals.`;
  if (amount >= 100) return `$${amount} provides a month of complete care for one child.`;
  if (amount >= 50) return `$${amount} covers a full week of meals and supplies for two children.`;
  if (amount >= 25) return `$${amount} provides school supplies and a hot meal each day for a week.`;
  return `Every dollar matters — thank you for giving.`;
}

const funds = [
  { id: "general", label: "General Support", icon: Gift },
  { id: "education", label: "Education Fund", icon: GraduationCap },
  { id: "health", label: "Health Fund", icon: Stethoscope },
  { id: "meals", label: "Meals & Care", icon: Utensils },
];
