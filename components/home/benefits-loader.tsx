import { createAdminClient } from "@/lib/supabase/admin";
import { BenefitsSection } from "./benefits-section";

export async function BenefitsLoader() {
  const supabase = createAdminClient();
  const { data: benefits } = await supabase
    .from("benefits")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return <BenefitsSection benefits={benefits ?? []} />;
}
