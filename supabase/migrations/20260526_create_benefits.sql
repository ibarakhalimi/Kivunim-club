-- Benefits table
create table if not exists benefits (
  id          uuid        primary key default gen_random_uuid(),
  business    text        not null,
  category    text        not null,
  deal        text        not null,
  description text        not null,
  image_url   text,
  bg_color    text        not null default 'var(--color-card-peach)',
  is_active   boolean     not null default true,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

-- Row Level Security
alter table benefits enable row level security;

create policy "members can read benefits"
  on benefits for select
  using (true);

create policy "admins can manage benefits"
  on benefits for all
  using (auth.role() = 'service_role');
