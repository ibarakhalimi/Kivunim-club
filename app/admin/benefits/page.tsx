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
    <div style={{ minHeight: "100dvh", background: "#F8FAFC", padding: "24px 16px 40px", fontFamily: "var(--font-rubik)", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 24, color: "#0F172A" }}>
          הטבות
        </h1>
      </div>

      <AddBenefitForm />

      {benefits && benefits.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>
            כל ההטבות
          </h2>
          <BenefitList benefits={benefits} />
        </div>
      )}
    </div>
  );
}
