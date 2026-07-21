"use client";

import { useEffect, useState } from "react";
import { Coins, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { getMyCheckInCount } from "@/app/actions/check-in";

type ProfileCardState = {
  name: string;
  points: number;
  email: string | null;
  phone: string | null;
  institution: string | null;
  degree: string | null;
  study_year: string | null;
  region: string | null;
  birth_date: string | null;
  privacy_consent: boolean | null;
  role: string | null;
  created_at: string | null;
  last_check_in: string | null;
  user_id: string | null;
};

function formatBirthDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}.${month}.${year}` : value;
}

function formatCreatedAt(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCheckIn(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function ProfileCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pointsOpen, setPointsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<ProfileCardState>({
    name: "שם מלא",
    points: 0,
    email: null,
    phone: null,
    institution: null,
    degree: null,
    study_year: null,
    region: null,
    birth_date: null,
    privacy_consent: null,
    role: null,
    created_at: null,
    last_check_in: null,
    user_id: null,
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      setIsAuthenticated(Boolean(user));
      if (!user) return;

      const metadata = user.user_metadata ?? {};
      const { data: member } = await supabase
        .from("members")
        .select("user_id, name, email, phone, institution, degree, study_year, region, birth_date, privacy_consent, role, created_at")
        .eq("user_id", user.id)
        .maybeSingle();

      const metadataName = typeof metadata.name === "string" ? metadata.name.trim() : "";

      setProfile((current) => ({
        name: member?.name?.trim() || metadataName || "משתמש",
        points: current.points,
        email: member?.email ?? user.email ?? null,
        phone: member?.phone ?? (typeof metadata.phone === "string" ? metadata.phone : user.phone ?? null),
        institution: member?.institution ?? (typeof metadata.institution === "string" ? metadata.institution : null),
        degree: member?.degree ?? (typeof metadata.degree === "string" ? metadata.degree : null),
        study_year: member?.study_year ?? (typeof metadata.study_year === "string" ? metadata.study_year : null),
        region: member?.region ?? (typeof metadata.region === "string" ? metadata.region : null),
        birth_date: member?.birth_date ?? (typeof metadata.birth_date === "string" ? metadata.birth_date : null),
        privacy_consent: member?.privacy_consent ?? (typeof metadata.privacy_consent === "boolean" ? metadata.privacy_consent : null),
        role: member?.role ?? null,
        created_at: member?.created_at ?? null,
        last_check_in: current.last_check_in,
        user_id: member?.user_id ?? user.id,
      }));
    });

    async function refreshCheckInCount() {
      const result = await getMyCheckInCount();
      setProfile((current) => ({ ...current, points: result.count, last_check_in: result.lastCheckIn }));
    }

    refreshCheckInCount();
    window.addEventListener("check-in-created", refreshCheckInCount);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => {
      window.removeEventListener("check-in-created", refreshCheckInCount);
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || pointsOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, pointsOpen]);

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
          borderRadius: "var(--shape-radius-xl)",
          boxShadow: "none",
          padding: "5px 2px",
          minHeight: 64,
        }}
      >
        <div style={{ minWidth: 0, flex: 1, minHeight: 42, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-family-sans)",
              fontWeight: "var(--font-weight-black)",
              fontSize: "var(--font-size-2xl)",
              lineHeight: 1.1,
              letterSpacing: 0,
              color: "var(--color-ink)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            הקלאב הסטודנטיאלי
          </p>
          <p
            style={{
              margin: "3px 0 0",
              fontFamily: "var(--font-family-sans)",
              fontWeight: "var(--font-weight-bold)",
              fontSize: "var(--font-size-sm)",
              lineHeight: 1.15,
              color: "color-mix(in srgb, var(--color-ink) 70%, transparent)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            אגודת הסטודנטים העירונית אשדוד
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setOpen(true)}
            aria-label={isAuthenticated ? "פרופיל משתמש מחובר" : "פרופיל משתמש לא מחובר"}
            title={isAuthenticated ? "משתמש מחובר" : "משתמש לא מחובר"}
            style={{
              width: 42,
              height: 42,
              borderRadius: "var(--shape-radius-circle)",
              background: "var(--color-neutral-blue)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-brand)",
              flexShrink: 0,
            }}
          >
            <User size={19} strokeWidth={2.15} />
          </button>

          <button
            type="button"
            onClick={() => setPointsOpen(true)}
            aria-label={`יש לך ${profile.points} נקודות`}
            style={{
              minWidth: 78,
              height: 42,
              borderRadius: "var(--shape-radius-6xl)",
              background: "color-mix(in srgb, var(--color-brand) 15%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-brand) 25%, transparent)",
              padding: "0 11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              cursor: "pointer",
              fontFamily: "var(--font-family-sans)",
            }}
          >
            <Coins size={18} strokeWidth={2.2} color="var(--color-brand)" />
            <p
              suppressHydrationWarning
              style={{
                margin: 0,
                fontFamily: "var(--font-family-sans)",
                fontWeight: "var(--font-weight-black)",
                fontSize: "var(--font-size-3xl)",
                lineHeight: 1,
                color: "var(--color-brand)",
              }}
            >
              {profile.points.toLocaleString("he-IL")}
            </p>
          </button>
        </div>
      </div>
    </section>
    {pointsOpen && (
      <>
        <div
          onClick={() => setPointsOpen(false)}
          style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--color-overlay) 58%, transparent)", zIndex: 100 }}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="הנקודות שלי"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 101,
            width: "min(calc(100% - 32px), 380px)",
            background: "var(--color-surface)",
            border: "1px solid color-mix(in srgb, var(--color-brand) 28%, transparent)",
            borderRadius: "var(--shape-radius-5xl)",
            padding: "28px 22px 24px",
            boxSizing: "border-box",
            direction: "rtl",
            textAlign: "center",
            boxShadow: "0 24px 70px color-mix(in srgb, var(--color-overlay) 45%, transparent)",
          }}
        >
          <button
            type="button"
            onClick={() => setPointsOpen(false)}
            aria-label="סגירת חלון הנקודות"
            style={{ position: "absolute", top: 12, left: 12, width: 32, height: 32, border: "none", borderRadius: "var(--shape-radius-circle)", background: "var(--color-neutral-dark)", color: "var(--color-text-disabled)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={18} />
          </button>

          <Coins size={30} strokeWidth={2.15} color="var(--color-brand)" />
          <p style={{ margin: "12px 0 2px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-7xl)", lineHeight: 1, color: "var(--color-brand)" }}>
            {profile.points.toLocaleString("he-IL")}
          </p>
          <p style={{ margin: "0 0 18px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-lg)", color: "var(--color-ink)" }}>
            נקודות
          </p>
          <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-base)", lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
            על כל הגעה יומית מקבלים נקודה. בקרוב נספר לכם כיצד משתמשים בהן
          </p>
        </div>
      </>
    )}
    {open && (
      <>
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--color-overlay) 50%, transparent)", zIndex: 100 }}
        />
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 101,
            background: "var(--color-surface)",
            borderRadius: "var(--shape-radius-sheet)",
            border: "1px solid color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
            borderBottom: "none",
            direction: "rtl",
            padding: "24px 20px 48px",
            maxHeight: "85dvh",
            overflowY: "auto",
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
              background: "transparent",
              border: "none",
              borderRadius: "var(--shape-radius-circle)",
              fontSize: "var(--font-size-base)",
              cursor: "pointer",
              color: "var(--color-warm-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--shape-radius-circle)",
                background: "var(--color-neutral-dark)",
                color: "var(--color-text-disabled)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <User size={24} strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-2xl)", color: "var(--color-ink)" }}>
                {profile.name}
              </p>
              <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-regular)", fontSize: "var(--font-size-md)", color: "var(--color-text-disabled)" }}>
                {isAuthenticated ? profile.email ?? "פרטי חבר המועדון" : "משתמש לא מחובר"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {[
              { label: "מס׳ נייד", value: profile.phone },
              { label: "תאריך לידה", value: formatBirthDate(profile.birth_date) },
              { label: "מוסד לימוד", value: profile.institution },
              { label: "תואר", value: profile.degree },
              { label: "תאריך הרשמה", value: formatCreatedAt(profile.created_at) },
              { label: "הגעה אחרונה", value: formatCheckIn(profile.last_check_in) },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "var(--color-stone-border)",
                  borderRadius: "var(--shape-radius-sm)",
                  border: "none",
                  gap: 16,
                }}
              >
                <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-md)", color: "var(--color-warm-ink)", flexShrink: 0 }}>{label}</span>
                <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-base)", color: value ? "var(--color-ink)" : "var(--color-text-disabled)", textAlign: "left", overflowWrap: "anywhere" }}>{value || "—"}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "color-mix(in srgb, var(--color-ios-danger) 10%, transparent)",
              color: "var(--color-ios-danger)",
              border: "1px solid color-mix(in srgb, var(--color-ios-danger) 30%, transparent)",
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
