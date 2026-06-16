alter table updates
add column if not exists is_active boolean not null default true;
