create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checked_in_at timestamptz not null default now()
);

alter table check_ins
add column if not exists source text not null default 'manual',
add column if not exists qr_payload text;

alter table check_ins enable row level security;

drop policy if exists "admins can manage check ins" on check_ins;

create policy "admins can manage check ins"
  on check_ins for all
  using (auth.role() = 'service_role');

notify pgrst, 'reload schema';
