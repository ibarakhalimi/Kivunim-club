create table if not exists contact_inquiries (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete set null,
  user_name   text,
  user_email  text,
  user_phone  text,
  subject     text        not null,
  message     text        not null,
  created_at  timestamptz not null default now()
);

alter table contact_inquiries enable row level security;

create policy "admins can manage contact inquiries"
  on contact_inquiries for all
  using (auth.role() = 'service_role');
