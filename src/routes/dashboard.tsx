import { createFileRoute } from "@tanstack/react-router";
import { DashboardPreview } from "@/components/dashboard-preview";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Preview — AXON" },
      { name: "description", content: "A live preview of the AXON command center." },
      { property: "og:title", content: "Dashboard Preview — AXON" },
      { property: "og:description", content: "Manage every bot across every group from one unified dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ COMMAND CENTRAL ]</div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">One dashboard, every bot</h1>
          <p className="text-muted-foreground text-lg">Real-time analytics, granular permissions, and live status across every group you manage.</p>
        </div>
        <div className="border border-border rounded-3xl bg-panel p-4 md:p-6 shadow-2xl">
          <DashboardPreview />
        </div>
      </div>
    </div>
  );
}
