"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import supabase from "@/lib/supabase/client";

type ProfileCardState = {
  name: string;
  points: number;
};

function readPoints(metadata: Record<string, unknown>): number {
  const value = metadata.points ?? metadata.score;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

export function ProfileCard() {
  const [profile, setProfile] = useState<ProfileCardState>({
    name: "משתמש",
    points: 0,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;

      const metadata = user.user_metadata ?? {};
      setProfile({
        name: typeof metadata.name === "string" && metadata.name.trim() ? metadata.name : "משתמש",
        points: readPoints(metadata),
      });
    });
  }, []);

  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          boxShadow: "none",
          padding: "9px 11px",
          minHeight: 64,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            suppressHydrationWarning
            style={{
              margin: "0 0 3px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 18,
              lineHeight: 1.15,
              color: "#0F172A",
              overflowWrap: "anywhere",
            }}
          >
            {profile.name}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 600,
              fontSize: 12,
              color: "#64748B",
            }}
          >
            סטודנט
          </p>
        </div>

        <div
          style={{
            flexShrink: 0,
            minWidth: 74,
            borderRadius: 10,
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            padding: "7px 9px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 2 }}>
            <Sparkles size={12} strokeWidth={2.2} color="#1E40AF" />
            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 10, color: "#1E40AF" }}>
              נקודות
            </span>
          </div>
          <p
            suppressHydrationWarning
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 20,
              lineHeight: 1,
              color: "#1E40AF",
            }}
          >
            {profile.points.toLocaleString("he-IL")}
          </p>
        </div>
      </div>
    </section>
  );
}
