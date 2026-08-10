import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminUpdateUserRole, listUsers } from "@/lib/admin/server-fns";
import { useSession } from "@/lib/auth/session";
import type { UserRole } from "@/lib/supabase/types";

export const Route = createFileRoute("/_authed-admin/admin/users")({
  loader: () => listUsers(),
  component: AdminUsersPage,
});

const roleBadgeClass: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  instructor: "bg-accent text-primary",
  student: "bg-secondary text-foreground/70",
};

const roles: UserRole[] = ["student", "instructor", "admin"];

function RoleSelect({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: UserRole;
  disabled: boolean;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onChange(next: UserRole) {
    if (next === role) return;
    setPending(true);
    try {
      await adminUpdateUserRole({ data: { userId, role: next } });
      toast.success(`Role updated to ${next}`);
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update role.");
    } finally {
      setPending(false);
    }
  }

  if (disabled) {
    return (
      <span
        title="You can't change your own role — use a different admin account."
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${roleBadgeClass[role]}`}
      >
        {role}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as UserRole)}
        className={`rounded-full border-0 px-2.5 py-1 text-[10px] font-bold uppercase outline-none disabled:opacity-60 ${roleBadgeClass[role]}`}
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
    </div>
  );
}

function AdminUsersPage() {
  const users = Route.useLoaderData();
  const session = useSession();

  return (
    <AdminShell title="Users">
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-5 py-3.5 font-semibold">Email</th>
              <th className="px-5 py-3.5 font-semibold">Role</th>
              <th className="px-5 py-3.5 font-semibold">Joined</th>
              <th className="px-5 py-3.5 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 font-medium">{u.display_name}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{u.email ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <RoleSelect userId={u.id} role={u.role} disabled={u.id === session?.id} />
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    to="/admin/students/$studentId"
                    params={{ studentId: u.id }}
                    className="text-[12px] font-semibold text-primary"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
