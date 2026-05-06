import type { ReactNode } from "react";

export function PageHeader({
  eyebrow, title, description, actions,
}: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="border-b border-border/60 bg-background px-6 py-8 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="float-in">
          {eyebrow && (
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] lg:text-5xl">{title}</h1>
          {description && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
