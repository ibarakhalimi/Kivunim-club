alter table polls
alter column option_3 drop not null,
alter column option_4 drop not null;

alter table polls
add column if not exists expires_at date;
