import { createAdminClient } from "@/lib/supabase/admin";
import { syncExpiredBenefits } from "@/lib/benefits/expiry";
import { BenefitsSection } from "./benefits-section";

export async function BenefitsLoader() {
  await syncExpiredBenefits();
  const supabase = createAdminClient();
  const { data: benefits } = await supabase
    .from("benefits")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return <BenefitsSection benefits={benefits ?? []} />;
}
