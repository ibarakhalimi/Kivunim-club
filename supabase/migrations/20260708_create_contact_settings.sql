create table if not exists contact_settings (
  id text primary key default 'main',
  mobile_phone text,
  whatsapp text,
  email text,
  updated_at timestamptz not null default now()
);

insert into contact_settings (id, mobile_phone, whatsapp, email)
values ('main', null, null, null)
on conflict (id) do nothing;

alter table contact_settings enable row level security;

drop policy if exists "anyone can read contact settings" on contact_settings;
drop policy if exists "admins can manage contact settings" on contact_settings;

create policy "anyone can read contact settings"
  on contact_settings for select
  using (true);

create policy "admins can manage contact settings"
  on contact_settings for all
  using (auth.role() = 'service_role');

notify pgrst, 'reload schema';
