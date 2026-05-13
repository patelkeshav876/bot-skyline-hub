# AXON — Telegram Bot Ecosystem Platform

Build a premium multi-page site using the **Precision Obsidian** direction (dark obsidian background, cyan #00d1ff accent, Inter Tight display + Inter body + JetBrains Mono).

## Pages (TanStack file routes)

```
src/routes/
  __root.tsx              # shell + nav + footer + Outlet
  index.tsx               # Landing
  explore.tsx             # Bot directory with filters/search
  bots.$botId.tsx         # Individual bot detail
  features.tsx            # Features grid
  pricing.tsx             # 3-tier pricing
  dashboard.tsx           # Dashboard/admin preview
  about.tsx               # About + contact form
```

Each route gets unique `head()` metadata (title, description, og tags).

## Design tokens (src/styles.css)

Replace defaults with Precision Obsidian palette in `oklch`:
- `--background` obsidian black
- `--foreground` near-white
- `--accent` cyan #00d1ff
- `--panel` raised surface
- `--muted` zinc-500
- `--border` rgba white 8%
- Fonts: Inter Tight (display), Inter (body), JetBrains Mono (code/labels)
- Reveal-up keyframe + ease-out-expo easing

Load Google Fonts via `<link>` in `__root.tsx` head.

## Shared components (src/components/)

- `SiteNav.tsx` — sticky blur nav, mobile sheet menu, active-link highlighting via `useRouterState`
- `SiteFooter.tsx` — 4-col footer w/ socials
- `Section.tsx` — consistent vertical padding wrapper
- `BotCard.tsx` — used in explore + landing
- `StatStrip.tsx` — divided stats row
- `MusicPlayerShowcase.tsx` — Music Bot player UI mockup
- `DashboardPreview.tsx` — analytics mockup with bar chart + stat callout
- `Breadcrumbs.tsx` — for internal pages

## Landing page composition (mirrors prototype exactly)

1. Hero with status pill, headline "Powerful Telegram Bots for Modern Communities", 2 CTAs, radial gradient bg
2. Stats strip (4 metrics, divided)
3. Music Bot showcase (2-col: copy + player mockup with generated cover art)
4. Bot grid "The Ecosystem" (3 cards + filter pills)
5. Dashboard preview panel with cyan callout card
6. Footer

## Explore page

- Search input + category filter chips (All, Music, AI, Security, Utility)
- Responsive grid (1/2/3 cols) of `BotCard`s
- Client-side filter via `useState`
- Static bot data in `src/data/bots.ts` (6–8 bots seeded)

## Bot detail page (`/bots/$botId`)

- Breadcrumbs (Explore › Bot Name)
- Hero with logo, name, tagline, "Add to Telegram" CTA
- Feature list, command list (mono font), stats
- Back button

## Features page

- Grid of feature cards grouped by category (Audio, AI, Moderation, Analytics)

## Pricing page

- 3 tiers (Free / Pro / Enterprise) with cyan-highlighted middle tier

## Dashboard page

- Full-page version of `DashboardPreview` with multiple panels (active bots list, user growth chart, live status, group list)

## About page

- Mission statement, team values, simple contact form (frontend-only — no backend wired)

## Animations

- CSS `revealUp` keyframe applied via class to hero elements (prototype already specifies)
- Hover scale on CTAs, card border-glow on hover
- No motion library — keep token-efficient

## Out of scope

- No backend / Lovable Cloud (purely marketing site)
- No real auth, no real bot integration
- Contact form is UI-only with toast confirmation

## Image assets

Generate 2–3 images via `imagegen`:
- Music player cover art (square, cyberpunk neon wave)
- Dashboard mockup (16:10 dark UI screenshot style)
- Optional hero ambient texture (skip if radial gradient suffices)

Save under `src/assets/`, import as ES modules.
