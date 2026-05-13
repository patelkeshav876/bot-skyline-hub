export type Bot = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "Music" | "AI" | "Security" | "Utility" | "Analytics";
  features: string[];
  commands: { cmd: string; desc: string }[];
  stats: { users: string; groups: string; uptime: string };
  accent: string;
};

export const bots: Bot[] = [
  {
    id: "axon-audio",
    name: "Axon Audio",
    tagline: "Studio-grade music streaming for Telegram voice chats.",
    description:
      "Low-latency, high-fidelity audio engine with native YouTube, Spotify, and SoundCloud integration. Multi-group queues, synchronized lyrics, and 24/7 broadcast capability.",
    category: "Music",
    features: [
      "Lossless voice chat streaming",
      "Multi-group synced playlists",
      "YouTube / Spotify / SoundCloud",
      "Smart queue management",
      "Live status & visualizer",
      "24/7 broadcast mode",
    ],
    commands: [
      { cmd: "/play <query>", desc: "Search and play a track" },
      { cmd: "/queue", desc: "Show the current queue" },
      { cmd: "/skip", desc: "Skip the current song" },
      { cmd: "/playlist <name>", desc: "Load a saved playlist" },
    ],
    stats: { users: "1.8M", groups: "8.2k", uptime: "99.98%" },
    accent: "cyan",
  },
  {
    id: "sentinel-ai",
    name: "Sentinel AI",
    tagline: "AI moderation that stops raids before they start.",
    description:
      "Real-time NLP detects spam, scams, raids, and toxicity. CAPTCHA verification, automated bans, and detailed audit logs.",
    category: "Security",
    features: [
      "Real-time NLP filtering",
      "Anti-raid automation",
      "CAPTCHA verification",
      "Audit log dashboard",
      "Custom rule engine",
    ],
    commands: [
      { cmd: "/verify", desc: "Trigger member verification" },
      { cmd: "/warn @user", desc: "Issue a formal warning" },
      { cmd: "/audit", desc: "View moderation history" },
    ],
    stats: { users: "920k", groups: "12.4k", uptime: "99.99%" },
    accent: "cyan",
  },
  {
    id: "lumina",
    name: "Lumina AI",
    tagline: "GPT-4 and Claude inside every group chat.",
    description:
      "Bring the latest frontier models directly into your community. Context-aware responses, image generation, and multilingual translation.",
    category: "AI",
    features: [
      "GPT-4 + Claude 3 access",
      "Image generation",
      "Context-aware threads",
      "60+ language translation",
    ],
    commands: [
      { cmd: "/ask <prompt>", desc: "Query the AI model" },
      { cmd: "/image <prompt>", desc: "Generate an image" },
      { cmd: "/translate <lang>", desc: "Translate the previous message" },
    ],
    stats: { users: "640k", groups: "5.1k", uptime: "99.9%" },
    accent: "cyan",
  },
  {
    id: "pulse",
    name: "Pulse Analytics",
    tagline: "Deep insight into community growth and sentiment.",
    description:
      "Track member growth, peak activity hours, message sentiment, and engagement leaders across your entire network.",
    category: "Analytics",
    features: [
      "Growth & retention charts",
      "Sentiment analysis",
      "Top contributor leaderboards",
      "Weekly summary reports",
    ],
    commands: [
      { cmd: "/stats", desc: "Show group analytics" },
      { cmd: "/top", desc: "Top contributors this week" },
      { cmd: "/report", desc: "Email a PDF report" },
    ],
    stats: { users: "412k", groups: "3.8k", uptime: "99.95%" },
    accent: "cyan",
  },
  {
    id: "lore-keeper",
    name: "Lore Keeper",
    tagline: "Searchable group docs and custom commands.",
    description:
      "Manage community FAQs, documentation, and custom commands in a clean, searchable interface accessible from any chat.",
    category: "Utility",
    features: [
      "Markdown-rich FAQs",
      "Custom slash commands",
      "Inline search",
      "Permission tiers",
    ],
    commands: [
      { cmd: "/faq <topic>", desc: "Look up an FAQ entry" },
      { cmd: "/learn <key>", desc: "Save a new entry" },
    ],
    stats: { users: "280k", groups: "2.4k", uptime: "99.97%" },
    accent: "cyan",
  },
  {
    id: "ledger-node",
    name: "Ledger Node",
    tagline: "Multi-chain crypto alerts and wallet tracking.",
    description:
      "Real-time price alerts, wallet activity notifications, and on-chain transaction tracking across 12 chains.",
    category: "Utility",
    features: [
      "12-chain wallet tracking",
      "Price alerts",
      "Whale movement alerts",
      "Portfolio dashboard",
    ],
    commands: [
      { cmd: "/price <ticker>", desc: "Get live price" },
      { cmd: "/watch <wallet>", desc: "Track a wallet" },
    ],
    stats: { users: "510k", groups: "4.6k", uptime: "99.92%" },
    accent: "cyan",
  },
];

export const categories = ["All", "Music", "AI", "Security", "Utility", "Analytics"] as const;