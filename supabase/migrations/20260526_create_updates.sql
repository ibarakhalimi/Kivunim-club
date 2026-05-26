-- Updates table
create table if not exists updates (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  description text        not null,
  published_at timestamptz not null default now(),
  author      text        not null default 'צוות כיוונים',
  created_at  timestamptz not null default now()
);

-- Row Level Security
alter table updates enable row level security;

-- Members can read all updates
create policy "members can read updates"
  on updates for select
  using (auth.role() = 'authenticated');

-- Only admins can insert / update / delete
create policy "admins can manage updates"
  on updates for all
  using (
    exists (
      select 1 from members
      where members.id = auth.uid()
      and members.role = 'admin'
    )
  );
