"use client";

import { useEffect, useState } from "react";
import { Coins, User } from "lucide-react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { getMyCheckInCount } from "@/app/actions/check-in";

type ProfileCardState = {
  name: string;
  points: number;
  email: string | null;
  phone: string | null;
  institution: string | null;
  study_year: string | null;
  region: string | null;
};

export function ProfileCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileCardState>({
    name: "משתמש",
    points: 0,
    email: null,
    phone: null,
    institution: null,
    study_year: null,
    region: null,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;

      const metadata = user.user_metadata ?? {};
      setProfile({
        name: typeof metadata.name === "string" && metadata.name.trim() ? metadata.name : "משתמש",
        points: 0,
        email: user.email ?? null,
        phone: typeof metadata.phone === "string" ? metadata.phone : user.phone ?? null,
        institution: typeof metadata.institution === "string" ? metadata.institution : null,
        study_year: typeof metadata.study_year === "string" ? metadata.study_year : null,
        region: typeof metadata.region === "string" ? metadata.region : null,
      });
    });

    async function refreshCheckInCount() {
      const result = await getMyCheckInCount();
      setProfile((current) => ({ ...current, points: result.count }));
    }

    refreshCheckInCount();
    window.addEventListener("check-in-created", refreshCheckInCount);
    return () => window.removeEventListener("check-in-created", refreshCheckInCount);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/welcome");
  }

  return (
    <>
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
        <div style={{ minWidth: 0, minHeight: 42, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 13,
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
              fontSize: 26,
              lineHeight: 1.04,
              letterSpacing: 0,
              color: "#0F172A",
              overflowWrap: "anywhere",
            }}
          >
            {profile.name}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setOpen(true)}
            aria-label="פרופיל משתמש"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#FFEDD5",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#EA580C",
              flexShrink: 0,
            }}
          >
            <User size={19} strokeWidth={2.15} />
          </button>

          <div
            style={{
              minWidth: 78,
              height: 42,
              borderRadius: 24,
              background: "#FCE7F3",
              border: "none",
              padding: "0 11px",
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
              {profile.points.toLocaleString("he-IL")}
            </p>
          </div>
        </div>
      </div>
    </section>
    {open && (
      <>
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }}
        />
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 101,
            background: "#fff",
            borderRadius: "16px 16px 0 0",
            border: "1px solid #E2E8F0",
            borderBottom: "none",
            direction: "rtl",
            padding: "24px 20px 48px",
          }}
        >
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              width: 32,
              height: 32,
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              fontSize: 14,
              cursor: "pointer",
              color: "#64748B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#FFEDD5",
                color: "#EA580C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <User size={24} strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 18, color: "#0F172A" }}>
                {profile.name}
              </p>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 13, color: "#64748B" }}>
                {profile.email ?? ""}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {[
              { label: "טלפון", value: profile.phone },
              { label: "מוסד לימוד", value: profile.institution },
              { label: "שנתון", value: profile.study_year },
              { label: "אזור", value: profile.region },
            ].filter((row) => row.value).map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "#F8FAFC",
                  borderRadius: 8,
                  border: "1px solid #F1F5F9",
                }}
              >
                <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 13, color: "#64748B" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "#fff",
              color: "#DC2626",
              border: "1px solid #FECACA",
              borderRadius: 10,
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            התנתקות
          </button>
        </div>
      </>
    )}
    </>
  );
}
