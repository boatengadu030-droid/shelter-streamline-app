import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary-soft/60 via-primary-soft/20 to-background">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-32 h-[420px] w-[420px] rounded-full bg-warning/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {eyebrow && (
          <span className="inline-block rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
