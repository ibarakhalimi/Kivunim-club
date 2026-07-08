delete from storage.objects
where bucket_id = 'posts';

delete from storage.buckets
where id = 'posts';

drop table if exists posts cascade;
