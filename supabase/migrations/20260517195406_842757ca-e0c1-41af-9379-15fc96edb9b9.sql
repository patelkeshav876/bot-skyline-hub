
-- Groups the bot is in
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  chat_id bigint unique not null,
  title text not null,
  added_at timestamptz not null default now()
);

-- Queue of tracks per group
create table public.queue (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  position integer not null default 0,
  title text not null,
  artist text,
  url text not null,
  thumbnail_url text,
  duration_sec integer,
  requested_by text,
  status text not null default 'queued' check (status in ('queued','playing','played','skipped','failed')),
  added_at timestamptz not null default now()
);
create index queue_group_pos_idx on public.queue(group_id, position);
create index queue_group_status_idx on public.queue(group_id, status);

-- Now-playing snapshot per group (one row per group)
create table public.now_playing (
  group_id uuid primary key references public.groups(id) on delete cascade,
  queue_id uuid references public.queue(id) on delete set null,
  started_at timestamptz,
  position_sec integer not null default 0,
  is_paused boolean not null default false,
  volume integer not null default 100 check (volume between 0 and 200),
  updated_at timestamptz not null default now()
);

-- Command queue consumed by the audio worker
create table public.commands (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  type text not null check (type in ('play','pause','resume','skip','prev','seek','volume','stop','reload','join','leave')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','consumed','failed')),
  created_at timestamptz not null default now(),
  consumed_at timestamptz
);
create index commands_pending_idx on public.commands(group_id, status, created_at);

-- updated_at trigger for now_playing
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

create trigger trg_now_playing_touch
before update on public.now_playing
for each row execute function public.touch_updated_at();

-- Enable RLS with permissive policies (single-owner control plane; tighten after auth)
alter table public.groups enable row level security;
alter table public.queue enable row level security;
alter table public.now_playing enable row level security;
alter table public.commands enable row level security;

create policy "open read groups"      on public.groups       for select using (true);
create policy "open write groups"     on public.groups       for all    using (true) with check (true);
create policy "open read queue"       on public.queue        for select using (true);
create policy "open write queue"      on public.queue        for all    using (true) with check (true);
create policy "open read now_playing" on public.now_playing  for select using (true);
create policy "open write now_playing"on public.now_playing  for all    using (true) with check (true);
create policy "open read commands"    on public.commands     for select using (true);
create policy "open write commands"   on public.commands     for all    using (true) with check (true);

-- Realtime
alter publication supabase_realtime add table public.groups;
alter publication supabase_realtime add table public.queue;
alter publication supabase_realtime add table public.now_playing;
alter publication supabase_realtime add table public.commands;
