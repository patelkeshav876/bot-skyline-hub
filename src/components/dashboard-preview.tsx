import { Activity, Users, Radio, TrendingUp } from "lucide-react";

const bars = [30, 45, 35, 60, 50, 75, 65, 85, 70, 95, 80, 100];

export function DashboardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className="bg-background rounded-2xl border border-border p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-1">[ Command Central ]</div>
          <div className="text-lg font-bold">User Growth · Last 12 months</div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Users, label: "Active Users", value: "4.2M", trend: "+12%" },
          { icon: Radio, label: "Live Bots", value: "6", trend: "All up" },
          { icon: Activity, label: "Groups", value: "12.8k", trend: "+340" },
          { icon: TrendingUp, label: "Msgs/24h", value: "8.4M", trend: "+8%" },
        ].map((s) => (
          <div key={s.label} className="p-4 bg-panel border border-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="size-4 text-accent" />
              <span className="text-[10px] font-mono text-emerald-400">{s.trend}</span>
            </div>
            <div className="text-xl font-display font-bold">{s.value}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1.5 h-48">
        {bars.map((h, i) => (
          <div key={i} className={`flex-1 rounded-t-sm transition-all ${i >= bars.length - 3 ? "bg-accent" : "bg-panel border-t border-x border-border"}`} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="grid grid-cols-12 gap-1.5 mt-2 text-[9px] font-mono text-muted-foreground">
        {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (<div key={i} className="text-center">{m}</div>))}
      </div>
      {!compact && (
        <div className="mt-8 pt-8 border-t border-border">
          <div className="text-sm font-bold mb-4">Bot Status</div>
          <div className="space-y-2">
            {[
              { name: "Axon Audio", status: "Operational", uptime: "99.98%" },
              { name: "Sentinel AI", status: "Operational", uptime: "99.99%" },
              { name: "Lumina AI", status: "Operational", uptime: "99.9%" },
              { name: "Pulse Analytics", status: "Operational", uptime: "99.95%" },
            ].map((b) => (
              <div key={b.name} className="flex items-center justify-between p-3 bg-panel border border-border rounded-lg text-sm">
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="font-medium">{b.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span>{b.status}</span><span className="text-foreground">{b.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
