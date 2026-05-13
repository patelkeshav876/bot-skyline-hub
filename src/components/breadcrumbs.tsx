import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

type Item = { label: string; to?: "/explore" | "/features" | "/pricing" | "/dashboard" | "/about" | "/" };

export function Breadcrumbs({ items }: { items: Item[] }) {
  return (
    <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="size-3" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-accent transition-colors">{item.label}</Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
