import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Check } from "lucide-react";

export const Route = createFileRoute("/sponsorship")({
  component: SponsorshipPage,
  head: () => ({
    meta: [
      { title: "Sponsor a Child — Child of Grace Foundation" },
      { name: "description", content: "Change one life, transform a future. Sponsor a child and walk with them through care, school, and beyond." },
      { property: "og:title", content: "Sponsor a Child — Child of Grace Foundation" },
      { property: "og:description", content: "Change one life. Transform a future." },
    ],
  }),
});

function SponsorshipPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Sponsorship"
        title="Change one life. Transform a future."
        subtitle="Sponsorship is a long-term partnership with a child. You'll receive updates, photos, and the joy of knowing your support is shaping a story of healing."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Choose a sponsorship</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {packages.map((p) => (
            <Card key={p.name} className={`relative rounded-3xl border-border/60 p-7 shadow-soft ${p.featured ? "ring-2 ring-primary" : ""}`}>
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Most loved</span>
              )}
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{p.name}</p>
              <p className="mt-3 font-display text-4xl font-bold">{p.price}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.includes.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full gap-2 rounded-full">
                <Link to="/donate"><Heart className="h-4 w-4" /> Sponsor now</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary-soft/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">How sponsorship works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {steps.map((s, i) => (
              <Card key={s.title} className="rounded-3xl border-border/60 bg-white p-6 shadow-soft">
                <p className="font-display text-4xl font-bold text-primary/30">0{i + 1}</p>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-display text-base font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}

const packages = [
  { name: "Friend", price: "$25", body: "Provide meals, school supplies, and basic care.", includes: ["Quarterly child update", "Annual photo", "Thank-you letter"] },
  { name: "Guardian", price: "$60", body: "Cover education, healthcare, and daily needs.", includes: ["Monthly updates", "Annual photo & report", "Mentor matching", "Invitation to events"], featured: true },
  { name: "Champion", price: "$120", body: "Full sponsorship including extracurriculars.", includes: ["All Guardian benefits", "Personal video update", "Optional in-person visit"] },
];

const steps = [
  { title: "Choose a level", body: "Pick the sponsorship that fits your heart and budget." },
  { title: "Get matched", body: "We pair you with a child whose story you'll help shape." },
  { title: "Receive updates", body: "Stories, photos, and milestones throughout the year." },
  { title: "Watch them thrive", body: "Walk with your sponsored child for the long term." },
];

const faqs = [
  { q: "Where does my money go?", a: "Every gift is split across care, education, health, and program operations. We publish detailed annual reports on the Transparency section of our About page." },
  { q: "Can I write to my sponsored child?", a: "Yes! Letters and small notes are welcomed and reviewed by our care team before being delivered." },
  { q: "What happens when my child finishes school?", a: "Sponsorship continues through tertiary education or vocational training. We never drop a child mid-journey." },
  { q: "Can I cancel anytime?", a: "Yes. We ask for a heads-up so we can transition the child to another sponsor without disruption." },
];
