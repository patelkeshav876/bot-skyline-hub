import { Link } from "@tanstack/react-router";
import { Play, SkipBack, SkipForward, Radio } from "lucide-react";
import musicCover from "@/assets/music-cover.jpg";

const features = [
  "Multi-Group Syncing & Queuing",
  "Lossless Voice Chat Quality",
  "YouTube · Spotify · SoundCloud",
  "Advanced Visualizer Dashboard",
];

export function MusicShowcase() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-accent font-mono text-xs mb-4 tracking-widest">[ FEATURED RELEASE ]</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Studio-grade audio in any group</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Axon Audio is a high-fidelity streaming engine with native YouTube, Spotify, and direct SoundCloud integration — built for communities that take music seriously.
            </p>
            <ul className="space-y-3 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <div className="size-5 rounded bg-accent/10 border border-accent/30 grid place-items-center">
                    <div className="size-1.5 bg-accent rounded-full" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/bots/$botId" params={{ botId: "axon-audio" }} className="text-accent font-bold inline-flex items-center gap-2 group">
              Explore the Music Engine
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="bg-panel rounded-3xl border border-border p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-accent/20 border border-accent/40 grid place-items-center">
                  <Radio className="size-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-bold">Axon Audio v4.0</div>
                  <div className="text-[10px] text-accent uppercase font-mono tracking-widest">Now Streaming</div>
                </div>
              </div>
              <div className="text-[10px] font-mono bg-background border border-border px-2 py-1 rounded">@ALPHA_SQUAD</div>
            </div>
            <div className="aspect-square mb-6 overflow-hidden rounded-2xl border border-border">
              <img src={musicCover} alt="Album art" width={800} height={800} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-lg font-bold">Midnight Circuit</div>
                <div className="text-sm text-muted-foreground">Axon Original Soundtrack</div>
              </div>
              <div className="h-1 bg-background rounded-full relative">
                <div className="absolute top-0 left-0 h-full w-2/3 bg-accent rounded-full" />
                <div className="absolute top-1/2 -translate-y-1/2 left-2/3 size-3 bg-foreground rounded-full border-2 border-accent" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                <span>02:45</span><span>04:12</span>
              </div>
              <div className="flex items-center justify-center gap-6 pt-2">
                <button className="size-9 grid place-items-center rounded-full hover:bg-background transition-colors" aria-label="Previous"><SkipBack className="size-4 text-muted-foreground" /></button>
                <button className="size-12 rounded-full bg-accent text-accent-foreground grid place-items-center hover:scale-105 transition-transform" aria-label="Play"><Play className="size-5 fill-current" /></button>
                <button className="size-9 grid place-items-center rounded-full hover:bg-background transition-colors" aria-label="Next"><SkipForward className="size-4 text-muted-foreground" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
