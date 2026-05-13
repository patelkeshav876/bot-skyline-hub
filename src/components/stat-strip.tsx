const stats = [
  { value: "4.2M", label: "Active Users" },
  { value: "12.8k", label: "Connected Groups" },
  { value: "0.8s", label: "Avg Latency" },
  { value: "99.99%", label: "Uptime SLA" },
];

export function StatStrip() {
  return (
    <section className="border-y border-border bg-panel/50">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 md:divide-x divide-border">
        {stats.map((s) => (
          <div key={s.label} className="p-8 text-center">
            <div className="text-3xl md:text-4xl font-display font-bold mb-1">{s.value}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}