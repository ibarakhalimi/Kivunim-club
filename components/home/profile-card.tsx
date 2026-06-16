"use client";

import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
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
          background: "transparent",
          border: "none",
          borderRadius: 14,
          boxShadow: "none",
          padding: "5px 2px",
          minHeight: 64,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 1px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 12,
              color: "#64748B",
            }}
          >
            וולקאם
          </p>
          <p
            suppressHydrationWarning
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 900,
              fontSize: 20,
              lineHeight: 1.15,
              color: "#0F172A",
              overflowWrap: "anywhere",
            }}
          >
            {profile.name}
          </p>
        </div>

        <div
          style={{
            flexShrink: 0,
            minWidth: 78,
            borderRadius: 20,
            background: "#FCE7F3",
            border: "none",
            padding: "7px 9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <Coins size={18} strokeWidth={2.2} color="#DB2777" />
          <p
            suppressHydrationWarning
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 20,
              lineHeight: 1,
              color: "#DB2777",
            }}
          >
            {(57).toLocaleString("he-IL")}
          </p>
        </div>
      </div>
    </section>
  );
}
