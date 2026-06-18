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
        background: "#181A23",
        padding: "18px 14px 104px",
      }}
    >
      <SwipeBackHome />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "-18px -14px 26px", background: "#111522", borderRadius: 0, padding: "26px 22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(52,211,153,0.15)",
              color: "#34D399",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gift size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#FFFFFF" }}>
              הטבות
            </p>
          </div>
        </div>
        <Link
          href="/"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#252836",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "#FFFFFF",
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
