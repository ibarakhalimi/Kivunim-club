import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PollSection } from "./poll-section";

export async function PollLoader() {
  const supabase = createAdminClient();

  const { data: poll } = await supabase
    .from("polls")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!poll) return null;

  // Vote counts per option
  const { data: votes } = await supabase
    .from("poll_votes")
    .select("option_index")
    .eq("poll_id", poll.id);

  const counts = [0, 0, 0, 0];
  votes?.forEach((v) => { if (v.option_index >= 1 && v.option_index <= 4) counts[v.option_index - 1]++; });

  // Current user's vote
  let userVote: number | null = null;
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (user) {
    const { data: myVote } = await supabase
      .from("poll_votes")
      .select("option_index")
      .eq("poll_id", poll.id)
      .eq("user_id", user.id)
      .single();
    userVote = myVote?.option_index ?? null;
  }

  return <PollSection poll={poll} voteCounts={counts} userVote={userVote} />;
}
