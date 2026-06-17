"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CheckInInput = {
  source?: "qr" | "manual";
  qrPayload?: string | null;
};

export async function checkIn(input: CheckInInput = {}) {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { error: "יש להתחבר כדי לאשר הגעה" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("check_ins")
    .insert({
      user_id: user.id,
      source: input.source ?? "manual",
      qr_payload: input.qrPayload ?? null,
    });

  if (error) return { error: "שגיאה בשמירת ההגעה" };
  return { success: true };
}

export async function getMyCheckInCount() {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { count: 0 };

  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("check_ins")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) return { count: 0 };
  return { count: count ?? 0 };
}
