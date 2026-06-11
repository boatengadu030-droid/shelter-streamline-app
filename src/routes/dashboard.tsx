import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NotificationsBell } from "@/components/notifications-bell";
import { AssistantWidget } from "@/components/assistant-widget";
import { AuthPage } from "@/components/auth-page";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/dashboard")({ component: DashboardLayout });

function DashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <img src={logo} alt="Child of Grace" className="h-8 w-8 animate-pulse" />
          <span>Loading dashboard…</span>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage onBack={() => navigate({ to: "/" })} />;

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
