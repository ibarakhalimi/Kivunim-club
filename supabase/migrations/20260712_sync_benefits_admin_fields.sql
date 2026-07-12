alter table benefits
add column if not exists business_description text,
add column if not exists location text,
add column if not exists contact_phone text,
add column if not exists expires_at date;

create or replace function set_expired_benefit_inactive()
returns trigger
language plpgsql
as $$
begin
  if new.expires_at is not null and new.expires_at < current_date then
    new.is_active := false;
  end if;

  return new;
end;
$$;

drop trigger if exists benefits_set_expired_inactive on benefits;

create trigger benefits_set_expired_inactive
before insert or update on benefits
for each row
execute function set_expired_benefit_inactive();

update benefits
set is_active = false
where expires_at is not null
  and expires_at < current_date
  and is_active = true;
