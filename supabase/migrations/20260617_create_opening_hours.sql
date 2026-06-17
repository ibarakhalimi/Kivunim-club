create table if not exists opening_hours (
  day_key text primary key,
  day_label text not null,
  sort_order integer not null,
  is_open boolean not null default true,
  open_time time,
  close_time time,
  note text,
  updated_at timestamptz not null default now()
);

insert into opening_hours (day_key, day_label, sort_order, is_open, open_time, close_time, note)
values
  ('sunday', 'ראשון', 1, true, '08:00', '20:00', null),
  ('monday', 'שני', 2, true, '08:00', '20:00', null),
  ('tuesday', 'שלישי', 3, true, '08:00', '20:00', null),
  ('wednesday', 'רביעי', 4, true, '08:00', '20:00', null),
  ('thursday', 'חמישי', 5, true, '08:00', '18:00', null),
  ('friday', 'שישי', 6, false, null, null, null),
  ('saturday', 'שבת', 7, false, null, null, null)
on conflict (day_key) do nothing;

alter table opening_hours enable row level security;

drop policy if exists "anyone can read opening hours" on opening_hours;
drop policy if exists "admins can manage opening hours" on opening_hours;

create policy "anyone can read opening hours"
  on opening_hours for select
  using (true);

create policy "admins can manage opening hours"
  on opening_hours for all
  using (auth.role() = 'service_role');

notify pgrst, 'reload schema';
