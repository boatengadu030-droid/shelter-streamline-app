import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const Route = createFileRoute("/events")({
  component: PublicEventsPage,
  head: () => ({
    meta: [
      { title: "Events — Child of Grace Foundation" },
      { name: "description", content: "Upcoming fundraisers, outreach programs, and volunteer activities." },
      { property: "og:title", content: "Events — Child of Grace Foundation" },
      { property: "og:description", content: "Join us in person — fundraisers, outreach, and volunteer days." },
    ],
  }),
});

type EventRow = { id: string; title: string; description: string | null; start_at: string; end_at: string | null; location: string | null; status: string };

function PublicEventsPage() {
  const [upcoming, setUpcoming] = useState<EventRow[]>([]);
  const [past, setPast] = useState<EventRow[]>([]);

  useEffect(() => {
    async function load() {
      const now = new Date().toISOString();
      const { data: up } = await supabase.from("events").select("*").gte("start_at", now).order("start_at", { ascending: true }).limit(12);
      const { data: pa } = await supabase.from("events").select("*").lt("start_at", now).order("start_at", { ascending: false }).limit(6);
      setUpcoming((up as any) ?? []);
      setPast((pa as any) ?? []);
    }
    load();
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Events"
        title="Come and be part of the story."
        subtitle="Fundraisers, outreach days, and volunteer opportunities throughout the year."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-primary-soft/40 p-8 text-center text-muted-foreground">
            New events are being planned. Check back soon, or join our newsletter to be the first to know.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mt-16 font-display text-3xl font-bold sm:text-4xl">Past events</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <EventCard key={e.id} e={e} muted />
              ))}
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
}

function EventCard({ e, muted }: { e: EventRow; muted?: boolean }) {
  return (
    <Card className={`overflow-hidden rounded-3xl border-border/60 p-0 shadow-soft ${muted ? "opacity-80" : ""}`}>
      <div className="flex items-center gap-4 bg-gradient-to-br from-primary-soft to-primary/15 p-6">
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-white text-primary shadow-soft">
          <span className="text-[10px] uppercase">{format(new Date(e.start_at), "MMM")}</span>
          <span className="font-display text-2xl font-bold leading-none">{format(new Date(e.start_at), "d")}</span>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{e.status}</p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{e.title}</h3>
        </div>
      </div>
      <div className="space-y-2 p-6 text-sm text-muted-foreground">
        {e.description && <p>{e.description}</p>}
        <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {format(new Date(e.start_at), "PPP p")}</div>
        {e.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.location}</div>}
      </div>
    </Card>
  );
}
