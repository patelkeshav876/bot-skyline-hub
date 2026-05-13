import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { bots } from "@/data/bots";

export const Route = createFileRoute("/bots/$botId")({
  loader: ({ params }) => {
    const bot = bots.find((b) => b.id === params.botId);
    if (!bot) throw notFound();
    return { bot };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.bot.name} — AXON` },
      { name: "description", content: loaderData.bot.tagline },
      { property: "og:title", content: `${loaderData.bot.name} — AXON` },
      { property: "og:description", content: loaderData.bot.tagline },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="px-6 py-32 text-center">
      <h1 className="text-3xl font-display font-bold mb-4">Bot not found</h1>
      <Link to="/explore" className="text-accent">← Back to directory</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="px-6 py-32 text-center">
      <h1 className="text-2xl font-display font-bold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <button onClick={reset} className="text-accent">Try again</button>
    </div>
  ),
  component: BotDetail,
});

function BotDetail() {
  const { bot } = Route.useLoaderData();
  return (
    <div className="px-6 py-12 md:py-20">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={[{ label: "Explore", to: "/explore" }, { label: bot.name }]} />
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-8 transition-colors">
          <ArrowLeft className="size-4" /> Back to directory
        </Link>
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-16">
          <div className="size-20 rounded-2xl bg-panel border border-border grid place-items-center shrink-0">
            <div className="size-10 border-2 border-accent rounded-md rotate-45" />
          </div>
          <div className="flex-1">
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2 py-1 mb-3">{bot.category}</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{bot.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">{bot.tagline}</p>
            <a href="https://t.me" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform">
              Add to Telegram <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { label: "Active Users", value: bot.stats.users },
            { label: "Groups", value: bot.stats.groups },
            { label: "Uptime", value: bot.stats.uptime },
          ].map((s) => (
            <div key={s.label} className="bg-panel border border-border rounded-2xl p-6 text-center">
              <div className="text-2xl md:text-3xl font-display font-bold mb-1">{s.value}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">About</h2>
            <p className="text-muted-foreground leading-relaxed">{bot.description}</p>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Features</h2>
            <ul className="space-y-3">
              {bot.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <div className="size-5 rounded bg-accent/10 border border-accent/30 grid place-items-center">
                    <div className="size-1.5 bg-accent rounded-full" />
                  </div>{f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold mb-6">Commands</h2>
          <div className="bg-panel border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {bot.commands.map((c) => (
              <div key={c.cmd} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4">
                <code className="font-mono text-sm text-accent">{c.cmd}</code>
                <span className="text-sm text-muted-foreground">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
