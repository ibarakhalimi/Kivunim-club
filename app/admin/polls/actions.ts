"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/polls");
}

export async function addPoll(formData: FormData) {
  const question = (formData.get("question") as string)?.trim();
  const option_1 = (formData.get("option_1") as string)?.trim();
  const option_2 = (formData.get("option_2") as string)?.trim();
  const option_3 = (formData.get("option_3") as string)?.trim() || null;
  const option_4 = (formData.get("option_4") as string)?.trim() || null;
  const expires_at = (formData.get("expires_at") as string)?.trim() || null;

  if (!question || !option_1 || !option_2)
    return { error: "יש למלא שאלה ולפחות 2 אופציות" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("polls")
    .insert({ question, option_1, option_2, option_3, option_4, expires_at, is_active: true });

  if (error) return { error: "שגיאה בשמירת הסקר" };
  revalidate();
  return { success: true };
}

export async function togglePoll(id: string, current: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("polls").update({ is_active: !current }).eq("id", id);
  if (error) return { error: "שגיאה בעדכון" };
  revalidate();
  return { success: true };
}

export async function deletePoll(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("polls").delete().eq("id", id);
  if (error) return { error: "שגיאה במחיקה" };
  revalidate();
  return { success: true };
}
