-- Keep one check-in per member per calendar day in Israel.
delete from check_ins duplicate
using check_ins keeper
where duplicate.user_id = keeper.user_id
  and (duplicate.checked_in_at at time zone 'Asia/Jerusalem')::date =
      (keeper.checked_in_at at time zone 'Asia/Jerusalem')::date
  and (
    duplicate.checked_in_at > keeper.checked_in_at
    or (duplicate.checked_in_at = keeper.checked_in_at and duplicate.id::text > keeper.id::text)
  );

create unique index if not exists check_ins_one_per_user_per_israel_day_idx
on check_ins (
  user_id,
  ((checked_in_at at time zone 'Asia/Jerusalem')::date)
);
