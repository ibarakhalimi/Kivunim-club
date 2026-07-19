import { createAdminClient } from "@/lib/supabase/admin";
import { syncExpiredBenefits } from "@/lib/benefits/expiry";
import { AddBenefitForm } from "./add-benefit-form";
import { BenefitList } from "./benefit-list";

export default async function AdminBenefitsPage() {
  await syncExpiredBenefits();
  const supabase = createAdminClient();
  const { data: benefits } = await supabase
    .from("benefits")
    .select("*")
    .order("sort_order", { ascending: true });
  const benefitCategories = Array.from(new Set((benefits ?? []).map((benefit) => benefit.category).filter(Boolean)));

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-surface-muted)", padding: "24px 16px 40px", fontFamily: "var(--font-family-sans)", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <a href="/admin" style={{ fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: "var(--font-weight-medium)" }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-4xl)", color: "var(--color-admin-dark)" }}>
          הטבות
        </h1>
      </div>

      <AddBenefitForm categories={benefitCategories} />

      {benefits && benefits.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-dark)" }}>
            כל ההטבות
          </h2>
          <BenefitList benefits={benefits} />
        </div>
      )}
    </div>
  );
}
