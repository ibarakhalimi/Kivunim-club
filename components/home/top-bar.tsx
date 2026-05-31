"use client";

import { useEffect, useState } from "react";
import { Menu, User } from "lucide-react";
import supabase from "@/lib/supabase/client";

export function TopBar() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const raw = data.user?.user_metadata?.name as string | undefined;
      setName(raw ? raw.split(" ")[0] : null);
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
      {/* Right: greeting chip */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "var(--color-accent-primary)",
          color: "#fff",
          borderRadius: "var(--radius-full)",
          padding: "6px 16px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 16 }}>👋</span>
        {name ? `שלום, ${name}` : "שלום!"}
      </div>

      {/* Left: icon buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Profile */}
        <button
          aria-label="פרופיל"
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            background: "var(--color-bg-card)",
            border: "1.5px solid var(--color-border)",
            display: "grid",
            placeItems: "center",
            color: "var(--color-text-primary)",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <User size={20} strokeWidth={1.8} />
        </button>

        {/* Menu */}
        <button
          aria-label="תפריט"
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            background: "var(--color-bg-card)",
            border: "1.5px solid var(--color-border)",
            display: "grid",
            placeItems: "center",
            color: "var(--color-text-primary)",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
