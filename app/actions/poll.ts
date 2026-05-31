"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitVote(pollId: string, optionIndex: number) {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { error: "יש להתחבר כדי להצביע" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("poll_votes")
    .insert({ poll_id: pollId, user_id: user.id, option_index: optionIndex });

  if (error?.code === "23505") return { error: "כבר הצבעת בסקר זה" };
  if (error) return { error: "שגיאה בשמירת ההצבעה" };

  revalidatePath("/");
  return { success: true };
}
