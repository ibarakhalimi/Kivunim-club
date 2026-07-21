"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const DAYS = [
  { day_key: "sunday", day_label: "ראשון", sort_order: 1 },
  { day_key: "monday", day_label: "שני", sort_order: 2 },
  { day_key: "tuesday", day_label: "שלישי", sort_order: 3 },
  { day_key: "wednesday", day_label: "רביעי", sort_order: 4 },
  { day_key: "thursday", day_label: "חמישי", sort_order: 5 },
  { day_key: "friday", day_label: "שישי", sort_order: 6 },
  { day_key: "saturday", day_label: "שבת", sort_order: 7 },
] as const;

export type OpeningHourWithDate = {
  date: string;
  day_key: string;
  day_label: string;
  sort_order: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  note: string | null;
};

export type ContactSettings = {
  mobile_phone: string | null;
  whatsapp: string | null;
  email: string | null;
};

export type AppSettings = {
  test_mode: boolean;
};

export type ContactInquiry = {
  id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  subject: string;
  message: string;
  created_at: string;
};

export type ImportantInfoPage = {
  id: string;
  title: string;
  subtitle: string;
  content_html: string;
  is_active: boolean;
  sort_order: number;
};

const FALLBACK_ROWS: Omit<OpeningHourWithDate, "date">[] = [
  { day_key: "sunday", day_label: "ראשון", sort_order: 1, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "monday", day_label: "שני", sort_order: 2, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "tuesday", day_label: "שלישי", sort_order: 3, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "wednesday", day_label: "רביעי", sort_order: 4, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "thursday", day_label: "חמישי", sort_order: 5, is_open: true, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "friday", day_label: "שישי", sort_order: 6, is_open: false, open_time: "08:00", close_time: "20:00", note: null },
  { day_key: "saturday", day_label: "שבת", sort_order: 7, is_open: false, open_time: "08:00", close_time: "20:00", note: null },
];

const FALLBACK_INFO_PAGES: ImportantInfoPage[] = [
  { id: "scholarships", title: "זכאות למלגות", subtitle: "מידע על תנאי זכאות, מועדים וטפסים להגשה.", content_html: "<p>מידע על תנאי זכאות, מועדים וטפסים להגשה.</p>", is_active: true, sort_order: 1 },
  { id: "opening-hours", title: "שעות פעילות המרכז", subtitle: "פירוט שעות פתיחה, זמינות שירותים וימים מיוחדים.", content_html: "<p>פירוט שעות פתיחה, זמינות שירותים וימים מיוחדים.</p>", is_active: true, sort_order: 2 },
  { id: "study-spaces", title: "מרחבי למידה", subtitle: "חדרים שקטים, עמדות עבודה והנחיות שימוש.", content_html: "<p>חדרים שקטים, עמדות עבודה והנחיות שימוש.</p>", is_active: true, sort_order: 3 },
  { id: "academic-support", title: "סיוע אקדמי", subtitle: "ליווי, שיעורי תגבור ותמיכה בתקופת מבחנים.", content_html: "<p>ליווי, שיעורי תגבור ותמיכה בתקופת מבחנים.</p>", is_active: true, sort_order: 4 },
  { id: "documents", title: "הנפקת אישורים", subtitle: "מסמכים נפוצים, אישורי לימודים ופניות מנהלתיות.", content_html: "<p>מסמכים נפוצים, אישורי לימודים ופניות מנהלתיות.</p>", is_active: true, sort_order: 5 },
  { id: "benefits-rules", title: "הטבות ושיתופי פעולה", subtitle: "כללים לשימוש בהטבות ומימוש מול עסקים.", content_html: "<p>כללים לשימוש בהטבות ומימוש מול עסקים.</p>", is_active: true, sort_order: 6 },
  { id: "event-guidelines", title: "נהלי השתתפות באירועים", subtitle: "הרשמה, ביטולים, הגעה ועדכונים חשובים.", content_html: "<p>הרשמה, ביטולים, הגעה ועדכונים חשובים.</p>", is_active: true, sort_order: 7 },
];

function readTime(formData: FormData, key: string) {
  const value = (formData.get(key) as string | null)?.trim();
  return value || null;
}

function readOptionalText(formData: FormData, key: string) {
  const value = (formData.get(key) as string | null)?.trim();
  return value || null;
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u0590-\u05ff]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `info-${Date.now()}`;
}

function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function datesForWeek(weekStart: string) {
  const start = parseLocalDate(weekStart);
  return DAYS.map((day, index) => ({ ...day, date: toDateString(addDays(start, index)) }));
}

export async function getCurrentWeekStart() {
  const current = new Date();
  current.setHours(0, 0, 0, 0);
  current.setDate(current.getDate() - current.getDay());
  return toDateString(current);
}

export async function getOpeningHoursWeek(weekStart: string): Promise<OpeningHourWithDate[]> {
  const supabase = createAdminClient();
  const weekDates = datesForWeek(weekStart);
  const firstDate = weekDates[0].date;
  const lastDate = weekDates[weekDates.length - 1].date;

  const { data: baseRows } = await supabase
    .from("opening_hours")
    .select("day_key, day_label, sort_order, is_open, open_time, close_time, note")
    .order("sort_order", { ascending: true });

  const baseByDay = new Map(
    (baseRows?.length === 7 ? baseRows : FALLBACK_ROWS).map((row) => [row.day_key, row])
  );

  const { data: overrides } = await supabase
    .from("opening_hours_overrides")
    .select("date, day_key, day_label, sort_order, is_open, open_time, close_time, note")
    .gte("date", firstDate)
    .lte("date", lastDate)
    .order("date", { ascending: true });

  const overridesByDate = new Map((overrides ?? []).map((row) => [row.date, row]));

  return weekDates.map((day) => {
    const base = baseByDay.get(day.day_key) ?? FALLBACK_ROWS[day.sort_order - 1];
    const override = overridesByDate.get(day.date);
    const source = override ?? base;

    return {
      date: day.date,
      day_key: day.day_key,
      day_label: source.day_label,
      sort_order: source.sort_order,
      is_open: source.is_open,
      open_time: source.open_time,
      close_time: source.close_time,
      note: source.note,
    };
  });
}

export async function getContactSettings(): Promise<ContactSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_settings")
    .select("mobile_phone, whatsapp, email")
    .eq("id", "main")
    .maybeSingle();

  return {
    mobile_phone: data?.mobile_phone ?? null,
    whatsapp: data?.whatsapp ?? null,
    email: data?.email ?? null,
  };
}

export async function getAppSettings(): Promise<AppSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("app_settings")
    .select("test_mode")
    .eq("id", "main")
    .maybeSingle();

  return {
    test_mode: data?.test_mode ?? true,
  };
}

export async function getContactInquiries(): Promise<ContactInquiry[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_inquiries")
    .select("id, user_name, user_email, user_phone, subject, message, created_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getImportantInfoPages({ activeOnly = false } = {}): Promise<ImportantInfoPage[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("important_info_pages")
    .select("id, title, subtitle, content_html, is_active, sort_order")
    .order("sort_order", { ascending: true });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data } = await query;
  const rows = data?.length ? data : FALLBACK_INFO_PAGES;

  return activeOnly ? rows.filter((page) => page.is_active) : rows;
}

export async function updateAppSettings(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("app_settings")
    .upsert({
      id: "main",
      test_mode: formData.get("test_mode") === "on",
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

  if (error) {
    return { error: "שגיאה בשמירת הגדרות האפליקציה" };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateContactSettings(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("contact_settings")
    .upsert({
      id: "main",
      mobile_phone: readOptionalText(formData, "mobile_phone"),
      whatsapp: readOptionalText(formData, "whatsapp"),
      email: readOptionalText(formData, "email"),
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

  if (error) {
    return { error: "שגיאה בשמירת פרטי יצירת הקשר" };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateImportantInfoPage(formData: FormData) {
  const supabase = createAdminClient();
  const id = readOptionalText(formData, "id");
  const title = readOptionalText(formData, "title");
  const subtitle = readOptionalText(formData, "subtitle") ?? "";
  const content_html = readOptionalText(formData, "content_html");
  const sortOrderValue = Number(readOptionalText(formData, "sort_order") ?? 0);

  if (!id || !title || !content_html) {
    return { error: "יש למלא כותרת ותוכן" };
  }

  const { error } = await supabase
    .from("important_info_pages")
    .upsert({
      id,
      title,
      subtitle,
      content_html,
      sort_order: Number.isFinite(sortOrderValue) ? sortOrderValue : 0,
      is_active: formData.get("is_active") === "on",
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

  if (error) {
    return { error: "שגיאה בשמירת עמוד המידע" };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function createImportantInfoPage(formData: FormData) {
  const supabase = createAdminClient();
  const title = readOptionalText(formData, "title");
  const subtitle = readOptionalText(formData, "subtitle") ?? "";
  const content_html = readOptionalText(formData, "content_html");
  const sortOrderValue = Number(readOptionalText(formData, "sort_order") ?? 0);

  if (!title || !content_html) {
    return { error: "יש למלא כותרת ותוכן" };
  }

  const { error } = await supabase
    .from("important_info_pages")
    .insert({
      id: `${slugify(title)}-${Date.now()}`,
      title,
      subtitle,
      content_html,
      sort_order: Number.isFinite(sortOrderValue) ? sortOrderValue : 0,
      is_active: formData.get("is_active") === "on",
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: "שגיאה ביצירת עמוד המידע" };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function deleteImportantInfoPage(formData: FormData) {
  const supabase = createAdminClient();
  const id = readOptionalText(formData, "id");

  if (!id) {
    return { error: "חסר מזהה עמוד מידע" };
  }

  const { error } = await supabase
    .from("important_info_pages")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "שגיאה במחיקת עמוד המידע" };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateOpeningHours(formData: FormData) {
  const supabase = createAdminClient();

  const rows = DAYS.map((day) => {
    const date = (formData.get(`${day.day_key}_date`) as string | null)?.trim();

    return {
      date,
      day_key: day.day_key,
      day_label: day.day_label,
      sort_order: day.sort_order,
      is_open: formData.get(`${day.day_key}_is_open`) === "on",
      open_time: readTime(formData, `${day.day_key}_open_time`),
      close_time: readTime(formData, `${day.day_key}_close_time`),
      note: ((formData.get(`${day.day_key}_note`) as string | null)?.trim() || null),
      updated_at: new Date().toISOString(),
    };
  });

  if (rows.some((row) => !row.date)) {
    return { error: "חסר תאריך לאחד מימי השבוע" };
  }

  const { error } = await supabase
    .from("opening_hours_overrides")
    .upsert(rows as Array<(typeof rows)[number] & { date: string }>, { onConflict: "date" });

  if (error) {
    return { error: "שגיאה בשמירת שעות הפתיחה" };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}
