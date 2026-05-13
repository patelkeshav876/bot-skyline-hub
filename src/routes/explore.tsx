import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { BotCard } from "@/components/bot-card";
import { bots, categories } from "@/data/bots";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Bots — AXON" },
      { name: "description", content: "Browse the full AXON ecosystem of Telegram bots — music, AI, security, analytics, and utility." },
      { property: "og:title", content: "Explore Bots — AXON" },
      { property: "og:description", content: "Browse the full AXON ecosystem of Telegram bots." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(() => bots.filter((b) => {
    const matchCat = cat === "All" || b.category === cat;
    const matchQ = !query || b.name.toLowerCase().includes(query.toLowerCase()) || b.tagline.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  }), [query, cat]);

  return (
    <div className="px-6 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ BOT DIRECTORY ]</div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Explore the AXON ecosystem</h1>
          <p className="text-muted-foreground text-lg">Six production-grade bots and counting. Find the right one for your community.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bots..." className="w-full pl-11 pr-4 py-3 bg-panel border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${cat === c ? "bg-accent text-accent-foreground" : "bg-panel border border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-border rounded-2xl">No bots match your search.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((b) => (<BotCard key={b.id} bot={b} />))}
          </div>
        )}
      </div>
    </div>
  );
}
