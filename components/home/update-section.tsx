import { createAdminClient } from "@/lib/supabase/admin";
import { UpdateList } from "./update-list";

export async function UpdateSection() {
  const supabase = createAdminClient();
  const { data: updates } = await supabase
    .from("updates")
    .select("*")
    .order("published_at", { ascending: false });

  if (!updates || updates.length === 0) return null;

  return (
    <section style={{ padding: "4px 16px 8px" }}>
      <UpdateList updates={updates} />
    </section>
  );
}
