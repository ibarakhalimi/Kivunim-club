alter table events
  add column if not exists is_paid boolean not null default false,
  add column if not exists price_amount numeric;
