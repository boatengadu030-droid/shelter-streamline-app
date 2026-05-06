import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider, useAuth } from "@/lib/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/logo.png";
import { AuthPage } from "@/components/auth-page";
import { LandingPage } from "@/components/landing-page";
import { NotificationsBell } from "@/components/notifications-bell";
import { AssistantWidget } from "@/components/assistant-widget";
import { useEffect, useState } from "react";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-2 text-muted-foreground">That page is not in our care.</p>
        <Link to="/" className="mt-4 inline-block text-primary underline">Back home</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Havenlight — Orphanage Management" },
      { name: "description", content: "Care, dignity and hope — the operations OS for modern orphanages." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Shell />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

function Shell() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  useEffect(() => { if (!user) setShowAuth(false); }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <img src={logo} alt="Havenlight" className="h-8 w-8 animate-pulse" />
          <span>Loading Havenlight…</span>
        </div>
      </div>
    );
  }

  if (!user) return showAuth
    ? <AuthPage onBack={() => setShowAuth(false)} />
    : <LandingPage onEnter={() => setShowAuth(true)} />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="live-dot inline-block h-2 w-2 rounded-full bg-success" />
                Live data
              </span>
              <NotificationsBell />
            </div>
          </header>
          <main className="flex-1"><Outlet /></main>
        </div>
      </div>
      <AssistantWidget />
    </SidebarProvider>
  );
}
