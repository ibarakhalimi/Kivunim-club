import { createAdminClient } from "@/lib/supabase/admin";
import { AddBenefitForm } from "./add-benefit-form";
import { BenefitList } from "./benefit-list";

export default async function AdminBenefitsPage() {
  const supabase = createAdminClient();
  const { data: benefits } = await supabase
    .from("benefits")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg-primary)", padding: "24px 16px 40px", fontFamily: "var(--font-heebo)", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <a href="/admin" style={{ fontSize: 13, color: "var(--color-text-muted)", textDecoration: "none", fontWeight: 500 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 26, color: "var(--color-text-primary)" }}>
          הטבות
        </h1>
      </div>

      <AddBenefitForm />

      {benefits && benefits.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "var(--color-text-primary)" }}>
            כל ההטבות
          </h2>
          <BenefitList benefits={benefits} />
        </div>
      )}
    </div>
  );
}
