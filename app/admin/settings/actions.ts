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

function readTime(formData: FormData, key: string) {
  const value = (formData.get(key) as string | null)?.trim();
  return value || null;
}

export async function updateOpeningHours(formData: FormData) {
  const supabase = createAdminClient();

  const rows = DAYS.map((day) => ({
    day_key: day.day_key,
    day_label: day.day_label,
    sort_order: day.sort_order,
    is_open: formData.get(`${day.day_key}_is_open`) === "on",
    open_time: readTime(formData, `${day.day_key}_open_time`),
    close_time: readTime(formData, `${day.day_key}_close_time`),
    note: ((formData.get(`${day.day_key}_note`) as string | null)?.trim() || null),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("opening_hours")
    .upsert(rows, { onConflict: "day_key" });

  if (error) {
    return { error: "שגיאה בשמירת שעות הפתיחה" };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}
