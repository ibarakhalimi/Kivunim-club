import { createAdminClient } from "@/lib/supabase/admin";
import { UpdateList } from "./update-list";

export async function UpdateSection() {
  const supabase = createAdminClient();
  const { data: updates } = await supabase
    .from("updates")
    .select("*")
    .order("published_at", { ascending: false });

  if (!updates || updates.length === 0) return null;

  return <UpdateList updates={updates} />;
}
