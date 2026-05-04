import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Package, HeartHandshake, ShieldCheck,
  Calendar, UserCog, Sprout, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Children", url: "/children", icon: Users },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Donations & Sponsors", url: "/donations", icon: HeartHandshake },
  { title: "Compliance", url: "/compliance", icon: ShieldCheck },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Staff & Volunteers", url: "/staff", icon: UserCog },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, roles, signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Sprout className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-xl font-bold text-sidebar-foreground">Havenlight</span>
              <span className="text-[10px] tracking-[0.18em] text-muted-foreground">ORPHANAGE OS</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Operations</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.url === "/" ? path === "/" : path.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} className="data-[active=true]:bg-primary-soft data-[active=true]:text-primary data-[active=true]:font-semibold">
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && user && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="rounded-xl bg-primary-soft/60 p-3">
            <p className="text-xs font-medium text-primary">Every child deserves a safe, hopeful home.</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="truncate">
              <p className="truncate font-medium">{user.email}</p>
              <p className="capitalize text-muted-foreground">{roles[0] ?? "member"}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={signOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
