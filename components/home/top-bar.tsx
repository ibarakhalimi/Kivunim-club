"use client";

import { useEffect, useState } from "react";
import { Menu, User } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    function openProfileDrawer() {
      setOpen(true);
    }

    window.addEventListener("open-profile-drawer", openProfileDrawer);
    return () => window.removeEventListener("open-profile-drawer", openProfileDrawer);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 6);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: scrolled
            ? "linear-gradient(to bottom, color-mix(in srgb, var(--color-surface-muted) 78%, transparent) 0%, color-mix(in srgb, var(--color-surface-muted) 62%, transparent) 68%, transparent 100%)"
            : "transparent",
          borderBottom: "1px solid transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(1.25)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(1.25)" : "none",
          position: "sticky",
          top: 0,
          zIndex: 10,
          transition: "background 0.18s ease, border-color 0.18s ease, backdrop-filter 0.18s ease",
        }}
      >
        {/* Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/logo-aguda.png" alt="לוגו" width={36} height={36} style={{ display: "block" }} />
          <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-xl)", color: "var(--color-ink)" }}>
            קלאב סטודנטיאלי
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setOpen(true)}
            aria-label="פרופיל"
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--shape-radius-circle)",
              background: "var(--color-blue-100)",
              border: "1px solid var(--color-blue-200)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <User size={18} strokeWidth={2} color="var(--color-brand-blue)" />
          </button>
          <button
            onClick={() => setOpen(true)}
            aria-label="תפריט"
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--shape-radius-circle)",
              background: "var(--color-surface-soft)",
              border: "1px solid var(--color-border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Menu size={19} strokeWidth={2} color="var(--color-admin-dark)" />
          </button>
        </div>
      </header>

      {/* Profile drawer */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--color-overlay) 3%, transparent)", zIndex: 100 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 101,
              background: "var(--color-surface-raised)",
              borderRadius: "var(--shape-radius-sheet-compact)",
              border: "1px solid var(--color-border-subtle)",
              borderBottom: "none",
              direction: "rtl",
              padding: "24px 20px 48px",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 14, left: 16,
                width: 32, height: 32,
                background: "var(--color-surface-soft)",
                border: "none",
                borderRadius: "var(--shape-radius-circle)",
                fontSize: "var(--font-size-base)",
                cursor: "pointer",
                color: "var(--color-text-secondary)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            {/* Profile header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--shape-radius-circle)",
                  background: "var(--color-blue-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <User size={24} strokeWidth={1.8} color="var(--color-brand-blue)" />
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-2xl)", color: "var(--color-ink)" }}>
                  {profile.name ?? "משתמש"}
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-regular)", fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)" }}>
                  {profile.email ?? ""}
                </p>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {[
                { label: "טלפון", value: profile.phone },
                { label: "מוסד לימוד", value: profile.institution },
                { label: "שנתון", value: profile.study_year },
                { label: "אזור", value: profile.region },
              ].filter(r => r.value).map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "var(--color-surface-muted)",
                    borderRadius: "var(--shape-radius-sm)",
                    border: "1px solid var(--color-surface-soft)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-base)", color: "var(--color-ink)" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "13px 0",
                background: "var(--color-surface-raised)",
                color: "var(--color-danger)",
                border: "1px solid var(--color-red-200)",
                borderRadius: "var(--shape-radius-md)",
                fontFamily: "var(--font-family-sans)",
                fontWeight: "var(--font-weight-bold)",
                fontSize: "var(--font-size-lg)",
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
