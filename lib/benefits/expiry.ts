import { createAdminClient } from "@/lib/supabase/admin";

export function isPastBenefitExpiry(expiresAt: string | null | undefined) {
  if (!expiresAt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
}

export async function syncExpiredBenefits() {
  const supabase = createAdminClient();
  await supabase
    .from("benefits")
    .update({ is_active: false })
    .lt("expires_at", new Date().toISOString().slice(0, 10))
    .eq("is_active", true);
}
