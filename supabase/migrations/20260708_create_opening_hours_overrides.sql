create table if not exists opening_hours_overrides (
  date date primary key,
  day_key text not null,
  day_label text not null,
  sort_order integer not null,
  is_open boolean not null default true,
  open_time time,
  close_time time,
  note text,
  updated_at timestamptz not null default now()
);

alter table opening_hours_overrides enable row level security;

drop policy if exists "anyone can read opening hour overrides" on opening_hours_overrides;
drop policy if exists "admins can manage opening hour overrides" on opening_hours_overrides;

create policy "anyone can read opening hour overrides"
  on opening_hours_overrides for select
  using (true);

create policy "admins can manage opening hour overrides"
  on opening_hours_overrides for all
  using (auth.role() = 'service_role');

notify pgrst, 'reload schema';
