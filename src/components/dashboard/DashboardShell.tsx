import { type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BookMarked,
  BookOpen,
  Briefcase,
  LayoutDashboard,
  Lock,
  LogOut,
  Settings,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/site/Header";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useSession } from "@/lib/auth/session";

const nav = [
  { label: "Overview", to: "/dashboard" as const, icon: LayoutDashboard },
  { label: "My Courses", to: "/dashboard/courses" as const, icon: BookOpen },
  { label: "Progress", to: "/dashboard/progress" as const, icon: TrendingUp },
  { label: "Certificates", to: "/dashboard/certificates" as const, icon: Award },
  {
    label: "Career Toolkit",
    to: "/dashboard/career-toolkit" as const,
    icon: Briefcase,
    locked: true,
  },
  { label: "Career eBook", to: "/dashboard/ebook" as const, icon: BookMarked, locked: true },
  { label: "Profile", to: "/dashboard/profile" as const, icon: UserCircle },
  { label: "Settings", to: "/dashboard/settings" as const, icon: Settings },
];

export function DashboardShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = useSession();
  const navigate = useNavigate();

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="px-3 py-4">
          <Link to="/">
            <Logo />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={pathname === item.to}>
                      <Link to={item.to} className="justify-between">
                        <span className="flex items-center gap-2">
                          <item.icon className="size-4" />
                          {item.label}
                        </span>
                        {item.locked && <Lock className="size-3.5 text-muted-foreground" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent px-3 py-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {(session?.profile.display_name ?? "?").slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold">{session?.profile.display_name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{session?.email}</p>
            </div>
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center gap-3 border-b border-border px-5 py-4">
          <SidebarTrigger />
          <h1 className="text-[17px] font-bold tracking-tight">{title}</h1>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
