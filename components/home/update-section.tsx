import { createAdminClient } from "@/lib/supabase/admin";
import { UpdateList } from "./update-list";

export async function UpdateSection() {
  const supabase = createAdminClient();
  const { data: updates } = await supabase
    .from("updates")
    .select("*")
    .order("published_at", { ascending: false });

  return <UpdateList updates={updates ?? []} currentTime={new Date().toISOString()} />;
}
