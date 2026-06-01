"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

type Profile = {
  name: string | null;
  email: string | null;
  phone: string | null;
  institution: string | null;
  study_year: string | null;
  region: string | null;
};

export function TopBar() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ name: null, email: null, phone: null, institution: null, study_year: null, region: null });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const m = u.user_metadata ?? {};
      setProfile({
        name: m.name ?? null,
        email: u.email ?? null,
        phone: m.phone ?? u.phone ?? null,
        institution: m.institution ?? null,
        study_year: m.study_year ?? null,
        region: m.region ?? null,
      });
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/welcome");
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        dir="rtl"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}
      >
        {/* Right: logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/logo-aguda.png" alt="לוגו" width={40} height={40} style={{ display: "block" }} />
          <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
            קלאב סטודנטיאלי
          </p>
        </div>

        {/* Left: profile chip */}
        <div
          onClick={() => setOpen(true)}
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
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fff", border: "2px solid #000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <User size={15} strokeWidth={2} color="#111" />
          </div>
          <span suppressHydrationWarning style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, color: "#111", whiteSpace: "nowrap" }}>
            {profile.name ?? "פרופיל"}
          </span>
        </div>
      </header>

      {/* Off-canvas */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 101,
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              border: "3px solid #000",
              borderBottom: "none",
              boxShadow: "0 -5px 0 #000",
              direction: "rtl",
              padding: "24px 20px 48px",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{ position: "absolute", top: 14, left: 16, width: 34, height: 34, background: "#fff", border: "2.5px solid #000", borderRadius: "50%", boxShadow: "2px 2px 0 #000", fontSize: 16, cursor: "pointer", fontWeight: 900 }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EEC84A", border: "3px solid #000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User size={26} strokeWidth={2} color="#111" />
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
                  {profile.name ?? "משתמש"}
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, color: "#888" }}>
                  {profile.email ?? ""}
                </p>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { label: "טלפון", value: profile.phone },
                { label: "מוסד לימוד", value: profile.institution },
                { label: "שנתון", value: profile.study_year },
                { label: "אזור", value: profile.region },
              ].filter(r => r.value).map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f5f5f5", borderRadius: 10, border: "2px solid #e0e0e0" }}>
                  <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, color: "#555" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 14, color: "#111" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "14px 0",
                background: "#fff",
                color: "#111",
                border: "3px solid #000",
                borderRadius: 12,
                boxShadow: "4px 4px 0 #000",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 16,
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
