-- Posts for the main home slider
create table if not exists posts (
  id                   uuid        primary key default gen_random_uuid(),
  background_image_url text        not null,
  title                text        not null,
  link_url             text        not null,
  button_text          text        not null,
  is_active            boolean     not null default true,
  sort_order           integer     not null default 0,
  created_at           timestamptz not null default now()
);

alter table posts enable row level security;

create policy "members can read posts"
  on posts for select
  using (true);

create policy "admins can manage posts"
  on posts for all
  using (auth.role() = 'service_role');

insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;
