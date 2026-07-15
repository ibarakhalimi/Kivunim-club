"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addUpdate(formData: FormData) {
  const tab_label = (formData.get("tab_label") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const button_link_url = (formData.get("button_link_url") as string)?.trim() || null;
  const button_text = (formData.get("button_text") as string)?.trim() || null;
  const is_active = formData.get("is_active") === "on";

  if (!tab_label || !title || !description) {
    return { error: "טאב עליון, כותרת ותוכן הם שדות חובה" };
  }

  if (tab_label.length > 32) {
    return { error: "הטאב העליון יכול להכיל עד 32 תווים" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("updates")
    .insert({ tab_label, title, description, button_link_url, button_text, is_active });

  if (error) {
    return { error: "שגיאה בשמירת העדכון" };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  return { success: true };
}

export async function updateUpdate(id: string, formData: FormData) {
  const tab_label = (formData.get("tab_label") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const button_link_url = (formData.get("button_link_url") as string)?.trim() || null;
  const button_text = (formData.get("button_text") as string)?.trim() || null;
  const is_active = formData.get("is_active") === "on";

  if (!tab_label || !title || !description) {
    return { error: "טאב עליון, כותרת ותוכן הם שדות חובה" };
  }

  if (tab_label.length > 32) {
    return { error: "הטאב העליון יכול להכיל עד 32 תווים" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("updates")
    .update({ tab_label, title, description, button_link_url, button_text, is_active })
    .eq("id", id);

  if (error) {
    return { error: "שגיאה בעדכון הרשומה" };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  return { success: true };
}

export async function setUpdateActive(id: string, isActive: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("updates")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: `שגיאה בעדכון מצב התצוגה: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  return { success: true };
}

export async function deleteUpdate(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("updates").delete().eq("id", id);

  if (error) {
    return { error: "שגיאה במחיקת העדכון" };
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  return { success: true };
}
