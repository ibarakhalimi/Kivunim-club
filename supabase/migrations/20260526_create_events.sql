-- Events table
create table if not exists events (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  description text        not null,
  event_date  date        not null,
  start_hour  text        not null,
  location    text        not null,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- Row Level Security
alter table events enable row level security;

-- Members can read all events
create policy "members can read events"
  on events for select
  using (true);

-- Only service role can insert / update / delete
create policy "admins can manage events"
  on events for all
  using (auth.role() = 'service_role');
