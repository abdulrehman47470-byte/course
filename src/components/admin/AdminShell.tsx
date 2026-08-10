import { type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BookMarked,
  BookOpen,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Percent,
  Receipt,
  Settings,
  Sparkles,
  Users,
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
  { label: "Overview", to: "/admin" as const, icon: LayoutDashboard },
  { label: "Users", to: "/admin/users" as const, icon: Users },
  { label: "Courses", to: "/admin/courses" as const, icon: BookOpen },
  { label: "Enrollments", to: "/admin/enrollments" as const, icon: Percent },
  { label: "Payments", to: "/admin/payments" as const, icon: Receipt, locked: true },
  { label: "Certificates", to: "/admin/certificates" as const, icon: Award, locked: true },
  { label: "eBooks", to: "/admin/ebooks" as const, icon: BookMarked, locked: true },
  {
    label: "Resume Templates",
    to: "/admin/resume-templates" as const,
    icon: FileText,
    locked: true,
  },
  { label: "Analytics", to: "/admin/analytics" as const, icon: Sparkles, locked: true },
  { label: "Settings", to: "/admin/settings" as const, icon: Settings },
];

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
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
          <div className="flex items-center gap-2">
            <Link to="/">
              <Logo />
            </Link>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
              Admin
            </span>
          </div>
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
