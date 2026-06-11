import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/sponsorship", label: "Sponsorship" },
  { to: "/stories", label: "Stories" },
  { to: "/events", label: "Events" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-soft p-0.5">
            <img src={logo} alt="Child of Grace Foundation" className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold tracking-tight">Child of Grace</p>
            <p className="text-[9px] tracking-[0.22em] text-muted-foreground">FOUNDATION</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-primary-soft text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm" className="gap-1.5 rounded-full shadow-soft">
            <Link to="/donate"><Heart className="h-3.5 w-3.5" /> Donate</Link>
          </Button>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium",
                    active ? "bg-primary-soft text-primary" : "text-foreground/80 hover:bg-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-2 gap-1.5 rounded-full">
              <Link to="/donate" onClick={() => setOpen(false)}><Heart className="h-4 w-4" /> Donate</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
