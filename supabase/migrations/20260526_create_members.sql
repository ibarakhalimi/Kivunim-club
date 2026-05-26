-- Members table (extends auth.users)
create table if not exists members (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  email      text,
  name       text,
  phone      text,
  role            text        not null default 'member',
  institution     text,
  degree          text,
  study_year      text,
  region          text,
  birth_date      date,
  privacy_consent boolean     not null default false,
  created_at      timestamptz not null default now()
);

-- Row Level Security
alter table members enable row level security;

create policy "members can read own row"
  on members for select
  using (auth.uid() = user_id);

create policy "members can update own row"
  on members for update
  using (auth.uid() = user_id);

create policy "admins can manage members"
  on members for all
  using (auth.role() = 'service_role');

-- Auto-create member row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.members (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
