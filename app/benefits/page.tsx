import Link from "next/link";
import { Gift } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BottomNav } from "@/components/home/bottom-nav";
import { SwipeBackHome } from "@/app/updates/swipe-back-home";
import { BenefitsList } from "./benefits-list";

export const dynamic = "force-dynamic";

type BenefitItem = {
  id: string;
  business: string;
  category: string | null;
  deal: string;
  description: string | null;
  business_description: string | null;
  location: string | null;
  expires_at: string | null;
  image_url: string | null;
  created_at: string;
};

export default async function BenefitsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("benefits")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const benefits = (data ?? []) as BenefitItem[];

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "18px 14px 104px",
      }}
    >
      <SwipeBackHome />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: "#FCE7F3",
              color: "#DB2777",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gift size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#0F172A" }}>
              הטבות
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#64748B" }}>
              כל ההטבות שמחכות לך
            </p>
          </div>
        </div>
        <Link
          href="/"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#fff",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "#0F172A",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
          }}
        >
          ←
        </Link>
      </header>

      <BenefitsList benefits={benefits} />
      <BottomNav activeKey="benefits" alwaysOpen />
    </main>
  );
}
