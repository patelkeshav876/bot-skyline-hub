import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BotCard } from "@/components/bot-card";
import { StatStrip } from "@/components/stat-strip";
import { MusicShowcase } from "@/components/music-showcase";
import { DashboardPreview } from "@/components/dashboard-preview";
import { bots } from "@/data/bots";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AXON — Powerful Telegram Bots for Modern Communities" },
      { name: "description", content: "AXON is the enterprise-grade ecosystem for Telegram bots: studio-grade music streaming, AI moderation, and deep community analytics." },
      { property: "og:title", content: "AXON — Powerful Telegram Bots for Modern Communities" },
      { property: "og:description", content: "Studio-grade music, AI moderation, and analytics for serious Telegram communities." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AXON",
          url: "/",
          description: "Premium ecosystem of Telegram bots for music, AI moderation, and community analytics.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "AXON",
          url: "/",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = bots.slice(0, 3);
  return (
    <>
      <header className="relative pt-24 pb-32 overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,209,255,0.18),transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-panel text-[10px] font-mono uppercase tracking-widest text-accent mb-8 animate-reveal">
            <span className="size-1.5 bg-accent rounded-full animate-pulse" />
            Status: All Systems Operational
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-balance mb-8 animate-reveal [animation-delay:100ms]">
            Powerful Telegram Bots for{" "}
            <span className="text-accent">Modern Communities</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-reveal [animation-delay:200ms]">
            The enterprise-grade ecosystem for music streaming, AI moderation, and community analytics. Built for the next billion users.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal [animation-delay:300ms]">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform inline-flex items-center justify-center gap-2"
            >
              Explore Bot Directory <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-panel border border-border font-bold rounded-xl hover:bg-panel/60 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </header>

      <StatStrip />
      <MusicShowcase />

      <section className="py-24 md:py-32 px-6 bg-panel/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ THE ECOSYSTEM ]</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                More bots from our production
              </h2>
              <p className="text-muted-foreground max-w-lg">
                A specialized suite of agents — each engineered for a specific community need.
              </p>
            </div>
            <Link
              to="/explore"
              className="text-accent font-bold inline-flex items-center gap-2 group whitespace-nowrap"
            >
              View all bots <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((b) => (
              <BotCard key={b.id} bot={b} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ COMMAND CENTRAL ]</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Manage every bot from one place
            </h2>
            <p className="text-muted-foreground text-lg">
              Real-time analytics, granular permissions, and live status across every group — all from a unified dashboard.
            </p>
          </div>
          <div className="border border-border rounded-3xl bg-panel p-4 md:p-6 shadow-2xl">
            <DashboardPreview compact />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border bg-panel/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">
            Trusted by serious communities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Axon Audio replaced three bots and the audio quality is night and day. Our 24/7 lounge has never sounded better.", author: "Mira K.", role: "Community Lead, Synth Collective" },
              { quote: "Sentinel killed our raid problem in the first week. The audit log alone is worth it.", author: "David O.", role: "Mod, Crypto Forum 30k" },
              { quote: "The dashboard is the cleanest analytics product I've used in years. Genuinely premium.", author: "Lin T.", role: "Founder, Indie Devs Hub" },
            ].map((t) => (
              <figure key={t.author} className="bg-panel border border-border p-8 rounded-2xl">
                <blockquote className="text-foreground mb-6 leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-accent/20 border border-accent/40" />
                  <div>
                    <div className="font-bold text-sm">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center bg-panel border border-border rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,209,255,0.15),transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to upgrade your community?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Add any AXON bot to your Telegram group in under 30 seconds. No credit card required.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Start Exploring <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
