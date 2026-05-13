import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Bot } from "@/data/bots";

export function BotCard({ bot }: { bot: Bot }) {
  return (
    <Link
      to="/bots/$botId"
      params={{ botId: bot.id }}
      className="group bg-panel border border-border p-8 rounded-2xl hover:border-accent/40 transition-all flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="size-12 rounded-xl bg-background border border-border grid place-items-center group-hover:bg-accent/10 group-hover:border-accent/40 transition-colors">
          <div className="size-5 border-2 border-foreground/30 group-hover:border-accent transition-colors rounded-sm" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2 py-1">
          {bot.category}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{bot.name}</h3>
      <p className="text-muted-foreground text-sm mb-6 flex-grow">{bot.tagline}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-muted-foreground">{bot.stats.users} users</span>
        <span className="text-accent font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
          View <ArrowUpRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}