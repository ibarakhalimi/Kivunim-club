"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import supabase from "@/lib/supabase/client";

export function TopBar() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const raw = data.user?.user_metadata?.name as string | undefined;
      setName(raw ?? null);
    });
  }, []);

  return (
    <header
      dir="rtl"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
      }}
    >
      {/* Right: logo + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image
          src="/logo-aguda.png"
          alt="לוגו"
          width={40}
          height={40}
          style={{ display: "block" }}
        />
        <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
          קלאב סטודנטיאלי
        </p>
      </div>

      {/* Left: profile chip */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#EEC84A",
          border: "2.5px solid #000",
          borderRadius: 99,
          padding: "6px 14px 6px 8px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#fff",
            border: "2px solid #000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <User size={15} strokeWidth={2} color="#111" />
        </div>
        <span
          suppressHydrationWarning
          style={{
            fontFamily: "var(--font-rubik)",
            fontWeight: 700,
            fontSize: 14,
            color: "#111",
            whiteSpace: "nowrap",
          }}
        >
          {name ?? "פרופיל"}
        </span>
      </div>
    </header>
  );
}
