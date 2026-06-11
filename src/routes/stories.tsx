import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Quote, Search } from "lucide-react";
import storyImg from "@/assets/landing-photo-3.jpg";
import storyImg2 from "@/assets/landing-photo.jpg";
import storyImg3 from "@/assets/landing-photo-2.jpg";

export const Route = createFileRoute("/stories")({
  component: StoriesPage,
  head: () => ({
    meta: [
      { title: "Stories — Child of Grace Foundation" },
      { name: "description", content: "Real stories of children, families and communities being restored through care, mentorship and education." },
      { property: "og:title", content: "Stories of Transformation" },
      { property: "og:description", content: "Children, families and communities — restored." },
    ],
  }),
});

const tags = ["All", "Care", "Education", "Mentorship", "Community"] as const;

function StoriesPage() {
  const [tag, setTag] = useState<string>("All");
  const [q, setQ] = useState("");

  const filtered = stories.filter((s) => (tag === "All" || s.tag === tag) && (!q || (s.title + s.excerpt + s.who).toLowerCase().includes(q.toLowerCase())));

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Stories"
        title="From wounded to thriving."
        subtitle="Every child has a story. Here are a few of the ones we've been honored to walk with."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories…" className="rounded-full pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${tag === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary-soft hover:text-primary"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Card key={s.title} className="group overflow-hidden rounded-3xl border-border/60 p-0 shadow-soft transition hover:shadow-glow">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{s.tag}</span>
                <h3 className="mt-3 font-display text-xl font-semibold leading-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.excerpt}</p>
                <p className="mt-3 text-xs text-muted-foreground">— {s.who}</p>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">No stories match that search yet.</p>
        )}
      </section>

      <section className="bg-primary-soft/30 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Quote className="mx-auto h-10 w-10 text-primary/40" />
          <blockquote className="mt-4 font-display text-2xl leading-snug sm:text-3xl">
            "Sponsoring with Child of Grace has changed our family. We've become part of something
            much bigger than ourselves."
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">— The Mensah family, sponsors since 2019</p>
        </div>
      </section>
    </SiteLayout>
  );
}

const stories = [
  { title: "Ama finds her voice", tag: "Education", excerpt: "From quiet first-grader to confident scholarship recipient, Ama is now studying to become a nurse.", who: "Ama, 17", img: storyImg },
  { title: "Kofi's first home", tag: "Care", excerpt: "After years on the street, Kofi found a family — and a future as a carpenter's apprentice.", who: "Kofi, 14", img: storyImg2 },
  { title: "The mentor who stayed", tag: "Mentorship", excerpt: "A weekly tutoring session became a six-year friendship and a turning point.", who: "Esi & Aunty Doris", img: storyImg3 },
  { title: "A village rebuilds", tag: "Community", excerpt: "A vocational training program is keeping families together across three communities.", who: "Volta Region", img: storyImg },
  { title: "From classroom to clinic", tag: "Education", excerpt: "Three of last year's scholarship graduates are now in their first year of nursing school.", who: "Class of 2024", img: storyImg2 },
  { title: "Healing takes time", tag: "Care", excerpt: "What trauma-informed care looks like over five years, told by one of our caregivers.", who: "Aunty Patience", img: storyImg3 },
];
