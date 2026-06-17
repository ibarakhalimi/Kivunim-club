"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitIdea(formData: FormData) {
  const idea_text = (formData.get("idea_text") as string)?.trim();

  if (!idea_text) {
    return { error: "יש לכתוב רעיון לפני השליחה" };
  }

  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();

  if (!user) {
    return { error: "יש להתחבר כדי לשלוח רעיון" };
  }

  const supabase = createAdminClient();
  const { data: member } = await supabase
    .from("members")
    .select("name, email, phone")
    .eq("user_id", user.id)
    .maybeSingle();

  const metadata = user.user_metadata ?? {};
  const user_name =
    member?.name ||
    (typeof metadata.name === "string" ? metadata.name : null) ||
    user.email ||
    "משתמש";
  const user_email = member?.email || user.email || null;
  const user_phone =
    member?.phone ||
    (typeof metadata.phone === "string" ? metadata.phone : null) ||
    null;

  const { error } = await supabase
    .from("idea_submissions")
    .insert({
      user_id: user.id,
      user_name,
      user_email,
      user_phone,
      idea_text,
    });

  if (error) {
    return { error: `שגיאה בשליחת הרעיון: ${error.message}` };
  }

  revalidatePath("/admin/ideas");
  return { success: true };
}
