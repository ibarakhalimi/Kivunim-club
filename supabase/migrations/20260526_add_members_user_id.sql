-- Add user_id to members and link to auth.users
alter table if exists members
  add column if not exists user_id uuid;

alter table if exists members
  add constraint members_user_id_fkey foreign key (user_id)
  references auth.users(id);
