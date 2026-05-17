import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Volume2,
  Plus,
  Trash2,
  Radio,
  Loader2,
  Users,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  addToQueue,
  getGroupState,
  listGroups,
  removeFromQueue,
  sendCommand,
  type GroupRow,
  type NowPlayingRow,
  type QueueRow,
} from "@/lib/control.functions";

export const Route = createFileRoute("/player")({
  head: () => ({
    meta: [
      { title: "Player — AXON Remote" },
      { name: "description", content: "Control your AXON Telegram music bot like Spotify." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlayerPage,
});

function fmt(s?: number | null) {
  if (!s || s < 0) return "--:--";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function PlayerPage() {
  const qc = useQueryClient();
  const fetchGroups = useServerFn(listGroups);
  const groupsQ = useQuery({ queryKey: ["groups"], queryFn: () => fetchGroups() });
  const groups = groupsQ.data?.groups ?? [];
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId && groups[0]) setActiveId(groups[0].id);
  }, [groups, activeId]);

  useEffect(() => {
    const ch = supabase
      .channel("axon-control")
      .on("postgres_changes", { event: "*", schema: "public", table: "queue" }, () => {
        qc.invalidateQueries({ queryKey: ["group-state"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "now_playing" }, () => {
        qc.invalidateQueries({ queryKey: ["group-state"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "groups" }, () => {
        qc.invalidateQueries({ queryKey: ["groups"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0 overflow-hidden">
        <Sidebar
          groups={groups}
          activeId={activeId}
          onPick={setActiveId}
          loading={groupsQ.isLoading}
          onRefresh={() => qc.invalidateQueries({ queryKey: ["groups"] })}
        />
        <MainPanel groupId={activeId} groups={groups} />
      </div>
      <NowPlayingBar groupId={activeId} />
    </div>
  );
}

function Sidebar({
  groups,
  activeId,
  onPick,
  loading,
  onRefresh,
}: {
  groups: GroupRow[];
  activeId: string | null;
  onPick: (id: string) => void;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <aside className="border-r border-border bg-panel/40 p-4 lg:p-6 lg:h-[calc(100vh-4rem-6rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent">
          <Users className="size-3.5" /> Your Groups
        </div>
        <button
          onClick={onRefresh}
          className="size-7 grid place-items-center rounded-md hover:bg-panel text-muted-foreground hover:text-foreground"
          aria-label="Refresh"
        >
          <RefreshCw className="size-3.5" />
        </button>
      </div>
      {loading ? (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <Loader2 className="size-3 animate-spin" /> Loading…
        </div>
      ) : groups.length === 0 ? (
        <div className="text-xs text-muted-foreground leading-relaxed border border-dashed border-border rounded-xl p-4">
          No groups yet. Add the bot to a Telegram group and send <code className="text-accent">/start</code> — it'll show up here automatically.
        </div>
      ) : (
        <ul className="space-y-1">
          {groups.map((g) => {
            const active = g.id === activeId;
            return (
              <li key={g.id}>
                <button
                  onClick={() => onPick(g.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                    active
                      ? "bg-accent/10 text-accent border border-accent/30"
                      : "hover:bg-panel text-foreground border border-transparent"
                  }`}
                >
                  <div className="size-8 rounded-md bg-accent/20 grid place-items-center text-[10px] font-mono">
                    {g.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{g.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{g.chat_id}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

function MainPanel({ groupId, groups }: { groupId: string | null; groups: GroupRow[] }) {
  const fetchState = useServerFn(getGroupState);
  const stateQ = useQuery({
    queryKey: ["group-state", groupId],
    queryFn: () => fetchState({ data: { groupId: groupId! } }),
    enabled: !!groupId,
    refetchInterval: 5000,
  });
  const active = groups.find((g) => g.id === groupId);
  const queue = stateQ.data?.queue ?? [];
  const np = stateQ.data?.nowPlaying ?? null;
  const playingId = np?.queue_id ?? null;
  const playing = queue.find((q) => q.id === playingId);
  const upcoming = queue.filter((q) => q.id !== playingId);

  if (!groupId) {
    return (
      <section className="flex-1 grid place-items-center p-10">
        <div className="text-center max-w-md">
          <Radio className="size-12 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Pick a group to start</h2>
          <p className="text-sm text-muted-foreground">
            Once you add the AXON bot to a Telegram group, it'll appear in the sidebar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 overflow-y-auto lg:h-[calc(100vh-4rem-6rem)]">
      <div className="relative">
        <div className="absolute inset-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(0,209,255,0.18),transparent_60%)] pointer-events-none" />
        <div className="relative px-6 md:px-10 pt-10 pb-8">
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent mb-2">
            Now Controlling
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-1">{active?.title}</h1>
          <p className="text-sm text-muted-foreground font-mono">
            chat_id {active?.chat_id} · {queue.length} in queue
          </p>
        </div>
      </div>

      <AddTrackForm groupId={groupId} />

      <div className="px-6 md:px-10 pb-10">
        {playing && (
          <div className="mb-8">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Playing now
            </div>
            <TrackRow track={playing} highlight />
          </div>
        )}
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
          Up next ({upcoming.length})
        </div>
        {upcoming.length === 0 ? (
          <div className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-6 text-center">
            Queue is empty. Add a track above or use <code className="text-accent">/play</code> in the group.
          </div>
        ) : (
          <ul className="space-y-1">
            {upcoming.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i + 1} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function AddTrackForm({ groupId }: { groupId: string }) {
  const qc = useQueryClient();
  const add = useServerFn(addToQueue);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setBusy(true);
    try {
      const title = url.length > 80 ? url.slice(0, 77) + "…" : url;
      await add({ data: { groupId, url: url.trim(), title, requestedBy: "web" } });
      setUrl("");
      toast.success("Queued");
      qc.invalidateQueries({ queryKey: ["group-state", groupId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to queue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="px-6 md:px-10 pb-6 flex flex-col sm:flex-row gap-2 items-stretch"
    >
      <div className="relative flex-1">
        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="url"
          placeholder="Paste a track URL (YouTube, SoundCloud, direct MP3…)"
          className="w-full pl-10 pr-4 h-12 bg-panel border border-border rounded-xl text-sm focus:outline-none focus:border-accent transition-colors"
        />
      </div>
      <button
        disabled={busy}
        className="h-12 px-6 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : "Add to queue"}
      </button>
    </form>
  );
}

function TrackRow({
  track,
  index,
  highlight,
}: {
  track: QueueRow;
  index?: number;
  highlight?: boolean;
}) {
  const qc = useQueryClient();
  const remove = useServerFn(removeFromQueue);
  return (
    <li
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
        highlight
          ? "border-accent/40 bg-accent/5"
          : "border-transparent hover:bg-panel hover:border-border"
      }`}
    >
      <div className="w-6 text-center text-xs font-mono text-muted-foreground">
        {highlight ? <Radio className="size-4 text-accent mx-auto" /> : index}
      </div>
      <div className="size-10 rounded-md bg-panel border border-border grid place-items-center overflow-hidden shrink-0">
        {track.thumbnail_url ? (
          <img src={track.thumbnail_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] font-mono text-muted-foreground">URL</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{track.title}</div>
        <div className="text-xs text-muted-foreground truncate">
          {track.artist ?? new URL(track.url).hostname} · {track.requested_by}
        </div>
      </div>
      <div className="text-xs font-mono text-muted-foreground tabular-nums">
        {fmt(track.duration_sec)}
      </div>
      <button
        onClick={async () => {
          try {
            await remove({ data: { trackId: track.id } });
            qc.invalidateQueries({ queryKey: ["group-state"] });
          } catch (e) {
            toast.error("Couldn't remove");
          }
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity size-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
        aria-label="Remove"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

function NowPlayingBar({ groupId }: { groupId: string | null }) {
  const cmd = useServerFn(sendCommand);
  const fetchState = useServerFn(getGroupState);
  const stateQ = useQuery({
    queryKey: ["group-state", groupId],
    queryFn: () => fetchState({ data: { groupId: groupId! } }),
    enabled: !!groupId,
  });
  const np: NowPlayingRow | null = stateQ.data?.nowPlaying ?? null;
  const queue = stateQ.data?.queue ?? [];
  const playing = queue.find((q) => q.id === np?.queue_id);

  const [localVol, setLocalVol] = useState<number | null>(null);
  const volume = localVol ?? np?.volume ?? 100;

  type CmdType =
    | "play" | "pause" | "resume" | "skip" | "prev"
    | "seek" | "volume" | "stop" | "reload" | "join" | "leave";
  async function send(type: CmdType, payload?: Record<string, unknown>) {
    if (!groupId) return;
    try {
      await cmd({ data: { groupId, type, payload } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Command failed");
    }
  }

  const paused = np?.is_paused ?? false;
  const progress = useMemo(() => {
    if (!playing?.duration_sec || !np?.position_sec) return 0;
    return Math.min(100, (np.position_sec / playing.duration_sec) * 100);
  }, [playing, np]);

  return (
    <div className="sticky bottom-0 border-t border-border bg-panel/95 backdrop-blur-md px-4 md:px-6 py-3 h-24 flex items-center gap-4 z-40">
      <div className="flex items-center gap-3 min-w-0 w-64">
        <div className="size-12 rounded-md bg-accent/20 border border-accent/30 grid place-items-center overflow-hidden shrink-0">
          {playing?.thumbnail_url ? (
            <img src={playing.thumbnail_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <Radio className="size-5 text-accent" />
          )}
        </div>
        <div className="min-w-0 hidden sm:block">
          <div className="text-sm font-medium truncate">
            {playing?.title ?? (groupId ? "Nothing playing" : "Pick a group")}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
            {playing ? (paused ? "Paused" : "Live") : "Idle"}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
        <div className="flex items-center gap-2">
          <CtrlBtn onClick={() => send("prev")} disabled={!groupId} label="Previous">
            <SkipBack className="size-4" />
          </CtrlBtn>
          <button
            onClick={() => send(paused ? "resume" : "pause")}
            disabled={!groupId || !playing}
            className="size-11 rounded-full bg-accent text-accent-foreground grid place-items-center hover:scale-105 transition-transform disabled:opacity-40 disabled:scale-100"
            aria-label={paused ? "Resume" : "Pause"}
          >
            {paused ? <Play className="size-5 fill-current ml-0.5" /> : <Pause className="size-5 fill-current" />}
          </button>
          <CtrlBtn onClick={() => send("skip")} disabled={!groupId} label="Skip">
            <SkipForward className="size-4" />
          </CtrlBtn>
          <CtrlBtn onClick={() => send("stop")} disabled={!groupId} label="Stop">
            <Square className="size-3.5 fill-current" />
          </CtrlBtn>
        </div>
        <div className="w-full max-w-xl flex items-center gap-2 text-[10px] font-mono text-muted-foreground tabular-nums">
          <span>{fmt(np?.position_sec)}</span>
          <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{fmt(playing?.duration_sec)}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 w-44">
        <Volume2 className="size-4 text-muted-foreground" />
        <input
          type="range"
          min={0}
          max={150}
          value={volume}
          onChange={(e) => setLocalVol(Number(e.target.value))}
          onPointerUp={() => {
            if (localVol !== null) {
              send("volume", { volume: localVol });
              setLocalVol(null);
            }
          }}
          className="flex-1 accent-[var(--accent)]"
          aria-label="Volume"
          disabled={!groupId}
        />
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-8 text-right">
          {volume}
        </span>
      </div>
    </div>
  );
}

function CtrlBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="size-9 grid place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors disabled:opacity-30"
    >
      {children}
    </button>
  );
}