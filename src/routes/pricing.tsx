import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AXON" },
      { name: "description", content: "Simple, transparent pricing for AXON Telegram bots." },
      { property: "og:title", content: "Pricing — AXON" },
      { property: "og:description", content: "Free, Pro, and Enterprise plans for the AXON ecosystem." },
    ],
  }),
  component: Pricing,
});

const tiers = [
  { name: "Free", price: "$0", desc: "Everything you need to get started.", features: ["1 bot", "Up to 3 groups", "Basic analytics", "Community support"], cta: "Start Free", highlight: false },
  { name: "Pro", price: "$19", desc: "For growing communities that need more.", features: ["All bots unlocked", "Unlimited groups", "Advanced analytics", "Priority support", "Custom commands", "API access"], cta: "Start Pro Trial", highlight: true },
  { name: "Enterprise", price: "Custom", desc: "White-glove deployment at scale.", features: ["Everything in Pro", "Dedicated infra", "SSO + RBAC", "99.99% SLA", "Dedicated CSM", "Custom integrations"], cta: "Contact Sales", highlight: false },
];

function Pricing() {
  return (
    <div className="px-6 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ PRICING ]</div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Simple, transparent pricing</h1>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you outgrow it. No surprises.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-3xl p-8 flex flex-col ${t.highlight ? "bg-accent/5 border-2 border-accent relative" : "bg-panel border border-border"}`}>
              {t.highlight && (<span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-[10px] font-mono uppercase tracking-widest rounded-full">Most Popular</span>)}
              <h3 className="text-2xl font-display font-bold mb-2">{t.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t.desc}</p>
              <div className="mb-8">
                <span className="text-5xl font-display font-bold">{t.price}</span>
                {t.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 text-accent shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/explore" className={`text-center py-3 rounded-xl font-bold transition-all ${t.highlight ? "bg-accent text-accent-foreground hover:scale-[1.02]" : "bg-background border border-border hover:border-accent/40"}`}>{t.cta}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
