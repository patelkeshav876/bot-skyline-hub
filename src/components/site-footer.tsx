import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-20 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="size-7 bg-accent rounded-md grid place-items-center">
              <div className="size-3 bg-background rounded-[2px] rotate-45" />
            </div>
            <span className="font-display font-bold tracking-tight text-xl">AXON</span>
          </Link>
          <p className="text-muted-foreground max-w-sm mb-8 text-sm">
            Next-generation infrastructure for Telegram-based communities. Scale your community with precision and automation.
          </p>
          <div className="flex gap-3">
            {["TG", "X", "GH"].map((s) => (
              <a
                key={s}
                href="#"
                className="size-10 rounded-lg bg-panel border border-border grid place-items-center text-xs font-mono text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-sm">Product</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/bots/$botId" params={{ botId: "axon-audio" }} className="hover:text-accent">Music Bot</Link></li>
            <li><Link to="/bots/$botId" params={{ botId: "sentinel-ai" }} className="hover:text-accent">Sentinel AI</Link></li>
            <li><Link to="/explore" className="hover:text-accent">Bot Directory</Link></li>
            <li><Link to="/features" className="hover:text-accent">Features</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-sm">Resources</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/pricing" className="hover:text-accent">Pricing</Link></li>
            <li><Link to="/dashboard" className="hover:text-accent">Dashboard</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><a href="#" className="hover:text-accent">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4">
        <p className="text-xs text-muted-foreground font-mono">© 2026 AXON ECOSYSTEM. ALL RIGHTS RESERVED.</p>
        <p className="text-xs text-muted-foreground font-mono">STAY CONNECTED // @AXON_PROTOCOL</p>
      </div>
    </footer>
  );
}