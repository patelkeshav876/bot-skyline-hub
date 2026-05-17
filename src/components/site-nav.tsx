import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/explore", label: "Explore" },
  { to: "/features", label: "Features" },
  { to: "/player", label: "Player" },
  { to: "/pricing", label: "Pricing" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-8 bg-accent rounded-lg grid place-items-center">
            <div className="size-3.5 bg-background rounded-[2px] rotate-45" />
          </div>
          <span className="font-display font-bold tracking-tight text-xl">AXON</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => {
            const active = pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={
                  active
                    ? "text-accent transition-colors"
                    : "text-muted-foreground hover:text-foreground transition-colors"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-lg hover:bg-accent transition-colors"
          >
            Open Telegram
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden size-9 grid place-items-center rounded-lg border border-border"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-1">
          {links.map((l) => {
            const active = pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-3 rounded-lg text-sm font-medium ${
                  active ? "bg-panel text-accent" : "text-muted-foreground hover:bg-panel"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="block mt-2 px-3 py-3 rounded-lg text-sm font-semibold bg-accent text-accent-foreground text-center"
          >
            Open Telegram
          </a>
        </div>
      )}
    </nav>
  );
}