import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Contact — AXON" },
      { name: "description", content: "Learn about the team building AXON." },
      { property: "og:title", content: "About & Contact — AXON" },
      { property: "og:description", content: "Premium Telegram bot infrastructure for modern communities." },
    ],
  }),
  component: About,
});

const values = [
  { title: "Precision", desc: "Every detail engineered, every interaction considered." },
  { title: "Resilience", desc: "99.99% uptime backed by multi-region infrastructure." },
  { title: "Openness", desc: "Open APIs, transparent pricing, and clear changelogs." },
];

function About() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Message sent! We'll be in touch within 24 hours.");
    setForm({ name: "", email: "", message: "" });
  }
  return (
    <div className="px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ ABOUT AXON ]</div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Building the future of community infrastructure</h1>
          <p className="text-muted-foreground text-lg">We believe Telegram is the most important platform for modern communities — and it deserves world-class tooling.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {values.map((v) => (
            <div key={v.title} className="bg-panel border border-border p-8 rounded-2xl">
              <div className="text-accent font-mono text-xs mb-3 tracking-widest">[ {v.title.toUpperCase()} ]</div>
              <h3 className="text-xl font-display font-bold mb-3">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-panel border border-border rounded-3xl p-8 md:p-12">
          <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ CONTACT ]</div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Get in touch</h2>
          <p className="text-muted-foreground mb-8">Questions, partnerships, or enterprise inquiries — we read everything.</p>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="grid md:grid-cols-2 gap-4">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-colors" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you need..." rows={5} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-colors resize-none" />
            <button type="submit" className="px-8 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
