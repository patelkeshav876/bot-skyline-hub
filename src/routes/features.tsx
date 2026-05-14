import { createFileRoute } from "@tanstack/react-router";
import { Music, Shield, Brain, BarChart3, Zap, Globe, Lock, Headphones, Bot, Layers, Code, Bell } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — AXON" },
      { name: "description", content: "Every feature across the AXON Telegram bot ecosystem." },
      { property: "og:title", content: "Features — AXON" },
      { property: "og:description", content: "Audio, AI, moderation, analytics, and developer tools." },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: Features,
});

const groups = [
  { title: "Audio", icon: Music, features: [
    { icon: Headphones, name: "Lossless Streaming", desc: "Studio-grade voice chat audio with adaptive bitrate." },
    { icon: Layers, name: "Multi-group Sync", desc: "Play the same queue across dozens of groups simultaneously." },
    { icon: Globe, name: "Source Aggregation", desc: "Native YouTube, Spotify, and SoundCloud integration." },
  ]},
  { title: "Intelligence", icon: Brain, features: [
    { icon: Bot, name: "Frontier AI Models", desc: "Direct access to GPT-4 and Claude 3 inside any chat." },
    { icon: Zap, name: "Context Awareness", desc: "Threaded conversations that remember your group history." },
    { icon: Globe, name: "60+ Languages", desc: "Real-time translation between 60+ languages." },
  ]},
  { title: "Moderation", icon: Shield, features: [
    { icon: Lock, name: "Anti-raid", desc: "Detect coordinated raids before they hit your group." },
    { icon: Shield, name: "CAPTCHA Verify", desc: "Block bots and scrapers with one-tap verification." },
    { icon: Bell, name: "Smart Alerts", desc: "Get pinged only when something needs your attention." },
  ]},
  { title: "Analytics & Dev", icon: BarChart3, features: [
    { icon: BarChart3, name: "Growth Charts", desc: "Track member growth, retention, and peak hours." },
    { icon: Code, name: "REST API", desc: "Build on top of AXON with our typed REST API." },
    { icon: Layers, name: "Webhooks", desc: "Subscribe to any group event in real-time." },
  ]},
];

function Features() {
  return (
    <div className="px-6 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ CAPABILITIES ]</div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Everything your community needs</h1>
          <p className="text-muted-foreground text-lg">Twelve flagship capabilities across audio, intelligence, moderation, and analytics.</p>
        </div>
        <div className="space-y-20">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-accent/10 border border-accent/30 grid place-items-center">
                  <g.icon className="size-5 text-accent" />
                </div>
                <h2 className="text-3xl font-display font-bold">{g.title}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {g.features.map((f) => (
                  <div key={f.name} className="bg-panel border border-border rounded-2xl p-6 hover:border-accent/40 transition-colors">
                    <f.icon className="size-5 text-accent mb-4" />
                    <h3 className="font-bold mb-2">{f.name}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
