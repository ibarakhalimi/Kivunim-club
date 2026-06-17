"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitContactInquiry(formData: FormData) {
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!subject || !message) {
    return { error: "יש לבחור נושא ולכתוב הודעה" };
  }

  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();

  if (!user) {
    return { error: "יש להתחבר כדי לשלוח פנייה" };
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
    .from("contact_inquiries")
    .insert({
      user_id: user.id,
      user_name,
      user_email,
      user_phone,
      subject,
      message,
    });

  if (error) {
    return { error: `שגיאה בשליחת הפנייה: ${error.message}` };
  }

  revalidatePath("/admin/inquiries");
  return { success: true };
}
