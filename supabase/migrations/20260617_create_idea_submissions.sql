create table if not exists idea_submissions (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete set null,
  user_name   text,
  user_email  text,
  user_phone  text,
  idea_text   text        not null,
  created_at  timestamptz not null default now()
);

alter table idea_submissions enable row level security;

create policy "admins can manage idea submissions"
  on idea_submissions for all
  using (auth.role() = 'service_role');
