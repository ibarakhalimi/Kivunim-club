create table if not exists app_settings (
  id text primary key default 'main',
  test_mode boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into app_settings (id, test_mode)
values ('main', true)
on conflict (id) do nothing;

alter table app_settings enable row level security;

drop policy if exists "anyone can read app settings" on app_settings;
drop policy if exists "admins can manage app settings" on app_settings;

create policy "anyone can read app settings"
  on app_settings for select
  using (true);

create policy "admins can manage app settings"
  on app_settings for all
  using (auth.role() = 'service_role');

notify pgrst, 'reload schema';
