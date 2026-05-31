"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function checkIn() {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { error: "יש להתחבר כדי לאשר הגעה" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("check_ins")
    .insert({ user_id: user.id });

  if (error) return { error: "שגיאה בשמירת ההגעה" };
  return { success: true };
}
