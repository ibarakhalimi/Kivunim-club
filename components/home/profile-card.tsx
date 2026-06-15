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
          gap: 16,
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          padding: "12px 14px",
          minHeight: 78,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            suppressHydrationWarning
            style={{
              margin: "0 0 6px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 21,
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
              fontSize: 13,
              color: "#64748B",
            }}
          >
            סטודנט
          </p>
        </div>

        <div
          style={{
            flexShrink: 0,
            minWidth: 96,
            borderRadius: 12,
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            padding: "9px 12px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 3 }}>
            <Sparkles size={14} strokeWidth={2.2} color="#1E40AF" />
            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#1E40AF" }}>
              נקודות
            </span>
          </div>
          <p
            suppressHydrationWarning
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 24,
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
