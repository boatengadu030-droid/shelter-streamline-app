import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/site-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, GraduationCap, Stethoscope, BookOpen, Users, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/programs")({
  component: ProgramsPage,
  head: () => ({
    meta: [
      { title: "Programs — Child of Grace Foundation" },
      { name: "description", content: "Care, education, health, mentorship, and community programs designed to help vulnerable children thrive." },
      { property: "og:title", content: "Programs — Child of Grace Foundation" },
      { property: "og:description", content: "How we care for children — from safe homes to scholarships." },
    ],
  }),
});

function ProgramsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="What We Do"
        title="Programs designed for real lives."
        subtitle="Every child who enters our care is met with a plan — for their healing, learning, health, and future."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {programs.map((p, i) => (
            <Card key={p.title} className="overflow-hidden rounded-[2rem] border-border/60 p-0 shadow-soft">
              <div className={`grid items-stretch gap-0 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>:first-child]:order-2" : ""}`}>
                <div className="flex items-center justify-center bg-linear-to-br from-primary-soft to-primary/15 p-12">
                  <p.icon className="h-24 w-24 text-primary/60" />
                </div>
                <div className="p-8 sm:p-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{p.eyebrow}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{p.title}</h2>
                  <p className="mt-3 text-muted-foreground">{p.body}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {p.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-6 text-sm">
                    {p.stats.map((s) => (
                      <div key={s.label}>
                        <p className="font-display text-2xl font-bold text-primary">{s.value}</p>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/sponsorship">Sponsor a program <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/donate">Fund a project</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

const programs = [
  { icon: HomeIcon, eyebrow: "Care", title: "Child Care & Protection", body: "Safe, loving homes for children who have nowhere else to turn. Trauma-informed care led by trained guardians and social workers.", outcomes: ["24/7 protective care", "Trauma-informed parenting", "Family reunification when safe"], stats: [{ value: "240+", label: "Children in care" }, { value: "12 yrs", label: "Avg length of care" }] },
  { icon: GraduationCap, eyebrow: "Learn", title: "Education Support", body: "School fees, uniforms, supplies, tutoring, and scholarships from primary school all the way to university and trades.", outcomes: ["Full school enrollment", "Daily homework support", "Tertiary scholarships"], stats: [{ value: "92", label: "Scholarships" }, { value: "94%", label: "Stay in school" }] },
  { icon: Stethoscope, eyebrow: "Wellness", title: "Health & Wellness", body: "Regular check-ups, vaccinations, nutrition, mental health counselling, and emergency medical care for every child.", outcomes: ["Routine medical visits", "On-call counselling", "Daily nutritious meals"], stats: [{ value: "100%", label: "Annual check-ups" }, { value: "3", label: "Partner clinics" }] },
  { icon: BookOpen, eyebrow: "Mentor", title: "Mentorship & Life Skills", body: "One-on-one mentoring pairs, life-skills workshops, leadership development, and career coaching.", outcomes: ["Matched adult mentors", "Monthly life-skills labs", "Career & internship pipeline"], stats: [{ value: "180", label: "Mentors" }, { value: "48", label: "Workshops / yr" }] },
  { icon: Users, eyebrow: "Community", title: "Family & Community Support", body: "Family strengthening programs, vocational training for caregivers, and local partnerships that prevent separation in the first place.", outcomes: ["Vocational training grants", "Caregiver coaching", "Community outreach"], stats: [{ value: "320", label: "Families supported" }, { value: "18", label: "Community programs" }] },
];
