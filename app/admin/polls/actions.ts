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
  const option_3 = (formData.get("option_3") as string)?.trim();
  const option_4 = (formData.get("option_4") as string)?.trim();

  if (!question || !option_1 || !option_2 || !option_3 || !option_4)
    return { error: "יש למלא את כל השדות" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("polls")
    .insert({ question, option_1, option_2, option_3, option_4, is_active: true });

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
