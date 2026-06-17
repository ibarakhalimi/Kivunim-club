alter table posts
alter column background_image_url drop not null,
alter column link_url drop not null,
alter column button_text drop not null;

alter table posts
add column if not exists post_type text not null default 'link',
add column if not exists body_text text;
