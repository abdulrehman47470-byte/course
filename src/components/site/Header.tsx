import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Search, User, X } from "lucide-react";
import { useSession } from "@/lib/auth/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/careerbooster-logo.png" alt="CareerBooster" className="h-11 w-auto shrink-0" />
      <div
        className={`whitespace-nowrap text-[22px] font-bold tracking-tight ${
          tone === "dark" ? "text-foreground" : "text-forest-foreground"
        }`}
      >
        CareerBooster
      </div>
    </div>
  );
}

const nav = [
  { label: "Home", to: "/" as const, caret: false },
  { label: "Courses", to: "/courses" as const, caret: true },
  { label: "How It Works", to: "/" as const, hash: "how-it-works", caret: false },
  { label: "Certifications", to: "/certifications" as const, caret: false },
  { label: "Career Services", to: "/career-services" as const, caret: true },
  { label: "Resources", to: "/resources" as const, caret: true },
  { label: "About Us", to: "/about" as const, caret: false },
];

function UserMenu() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!session) return null;

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/" });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-primary"
        aria-label="Account menu"
      >
        {session.profile.display_name.slice(0, 1).toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 rounded-lg border border-border bg-card p-2 shadow-float">
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-[13px] font-semibold">{session.profile.display_name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{session.email}</p>
          </div>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-secondary"
          >
            <LayoutDashboard className="size-4" /> Dashboard
          </Link>
          <Link
            to="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-secondary"
          >
            <User className="size-4" /> Profile
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13px] font-medium text-destructive transition-colors hover:bg-secondary"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const session = useSession();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/courses", search: query.trim() ? { q: query.trim() } : {} });
  }

  async function mobileSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setMobileOpen(false);
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 py-4 lg:py-5">
        <Link to="/" aria-label="CareerBooster home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              {...("hash" in item ? { hash: item.hash } : {})}
              className="flex items-center gap-1 whitespace-nowrap text-[13.5px] font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
              {item.caret && <ChevronDown className="size-3.5" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div ref={searchRef} className="relative hidden sm:block">
            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="h-10 w-48 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary lg:w-64"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="ml-1.5 grid size-10 shrink-0 place-items-center rounded-md text-foreground/70 transition-colors hover:bg-secondary"
                >
                  <X className="size-4" />
                </button>
              </form>
            ) : (
              <button
                aria-label="Search courses"
                onClick={() => setSearchOpen(true)}
                className="flex size-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-secondary"
              >
                <Search className="size-[18px]" />
              </button>
            )}
          </div>

          {session ? (
            <div className="hidden sm:block">
              <UserMenu />
            </div>
          ) : (
            <div className="hidden items-center gap-2.5 sm:flex">
              <Link
                to="/sign-in"
                className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Log In
              </Link>
              <Link
                to="/sign-up"
                className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-opacity hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-10 shrink-0 place-items-center rounded-md text-foreground/80 transition-colors hover:bg-secondary lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-5 pb-5 pt-2 lg:hidden">
          <form onSubmit={submitSearch} className="mb-3 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <button
              aria-label="Search"
              className="grid size-11 shrink-0 place-items-center rounded-md border border-border text-foreground/70"
            >
              <Search className="size-4" />
            </button>
          </form>
          <nav className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                {...("hash" in item ? { hash: item.hash } : {})}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between border-b border-border py-3.5 text-[15px] font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.label}
                {item.caret && <ChevronDown className="size-4" />}
              </Link>
            ))}
          </nav>
          {session ? (
            <div className="mt-4 space-y-2.5">
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
              >
                <LayoutDashboard className="size-4" /> Dashboard
              </Link>
              <button
                onClick={mobileSignOut}
                className="flex w-full items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          ) : (
            <div className="mt-4 flex gap-2.5">
              <Link
                to="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-md border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Log In
              </Link>
              <Link
                to="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-card transition-opacity hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
