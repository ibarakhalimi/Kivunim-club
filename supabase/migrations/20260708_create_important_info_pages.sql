create table if not exists important_info_pages (
  id text primary key,
  title text not null,
  subtitle text not null default '',
  content_html text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

insert into important_info_pages (id, title, subtitle, content_html, is_active, sort_order)
values
  ('scholarships', 'זכאות למלגות', 'מידע על תנאי זכאות, מועדים וטפסים להגשה.', '<p>מידע על תנאי זכאות, מועדים וטפסים להגשה.</p>', true, 1),
  ('opening-hours', 'שעות פעילות המרכז', 'פירוט שעות פתיחה, זמינות שירותים וימים מיוחדים.', '<p>פירוט שעות פתיחה, זמינות שירותים וימים מיוחדים.</p>', true, 2),
  ('study-spaces', 'מרחבי למידה', 'חדרים שקטים, עמדות עבודה והנחיות שימוש.', '<p>חדרים שקטים, עמדות עבודה והנחיות שימוש.</p>', true, 3),
  ('academic-support', 'סיוע אקדמי', 'ליווי, שיעורי תגבור ותמיכה בתקופת מבחנים.', '<p>ליווי, שיעורי תגבור ותמיכה בתקופת מבחנים.</p>', true, 4),
  ('documents', 'הנפקת אישורים', 'מסמכים נפוצים, אישורי לימודים ופניות מנהלתיות.', '<p>מסמכים נפוצים, אישורי לימודים ופניות מנהלתיות.</p>', true, 5),
  ('benefits-rules', 'הטבות ושיתופי פעולה', 'כללים לשימוש בהטבות ומימוש מול עסקים.', '<p>כללים לשימוש בהטבות ומימוש מול עסקים.</p>', true, 6),
  ('event-guidelines', 'נהלי השתתפות באירועים', 'הרשמה, ביטולים, הגעה ועדכונים חשובים.', '<p>הרשמה, ביטולים, הגעה ועדכונים חשובים.</p>', true, 7)
on conflict (id) do nothing;

alter table important_info_pages enable row level security;

drop policy if exists "anyone can read important info pages" on important_info_pages;
drop policy if exists "admins can manage important info pages" on important_info_pages;

create policy "anyone can read important info pages"
  on important_info_pages for select
  using (true);

create policy "admins can manage important info pages"
  on important_info_pages for all
  using (auth.role() = 'service_role');

notify pgrst, 'reload schema';
