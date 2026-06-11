import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-gradient-to-b from-background to-primary-soft/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-soft p-0.5">
                <img src={logo} alt="Child of Grace Foundation" className="h-full w-full object-contain" />
              </div>
              <div className="leading-tight">
                <p className="font-display text-base font-bold">Child of Grace</p>
                <p className="text-[9px] tracking-[0.22em] text-muted-foreground">FOUNDATION</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Healing hearts and shaping futures — restoring dignity, nurturing healing, and creating
              opportunities for vulnerable children to thrive.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:bg-primary-soft hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Explore" links={[
            { to: "/about", label: "About" },
            { to: "/programs", label: "Programs" },
            { to: "/stories", label: "Stories" },
            { to: "/events", label: "Events" },
          ]} />

          <FooterCol title="Get Involved" links={[
            { to: "/sponsorship", label: "Sponsor a Child" },
            { to: "/donate", label: "Donate" },
            { to: "/volunteer", label: "Volunteer" },
            { to: "/contact", label: "Partner With Us" },
          ]} />

          <div className="lg:col-span-4">
            <h4 className="font-display text-base font-semibold">Stay connected</h4>
            <p className="mt-2 text-xs text-muted-foreground">Monthly stories of transformation, straight to your inbox.</p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => { e.preventDefault(); toast.success("Thank you for subscribing!"); (e.target as HTMLFormElement).reset(); }}
            >
              <Input type="email" required placeholder="you@email.com" className="rounded-full" />
              <Button type="submit" className="rounded-full">Join</Button>
            </form>

            <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> Accra, Ghana</li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /> +233 (0) 000 000 000</li>
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /> hello@childofgrace.org</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Child of Grace Foundation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <Link to="/dashboard" className="hover:text-foreground">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div className="lg:col-span-2">
      <h4 className="font-display text-base font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-muted-foreground transition hover:text-primary">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
