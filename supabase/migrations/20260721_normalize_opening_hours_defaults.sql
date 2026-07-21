update opening_hours
set
  is_open = day_key in ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday'),
  open_time = '08:00',
  close_time = '20:00',
  note = null,
  updated_at = now();

update opening_hours_overrides
set
  note = null,
  updated_at = now()
where note = 'ראש חג';
