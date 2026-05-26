"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addUpdate(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || "צוות כיוונים";

  if (!title || !description) {
    return { error: "כותרת ותוכן הם שדות חובה" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("updates")
    .insert({ title, description, author });

  if (error) {
    return { error: "שגיאה בשמירת העדכון" };
  }

  revalidatePath("/");
  revalidatePath("/admin/updates");
  return { success: true };
}
