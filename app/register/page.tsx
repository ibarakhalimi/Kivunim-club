"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

const DEGREES = ["תואר ראשון", "תואר שני", "תואר שלישי", "עמיתות מחקר", "אחר"];
const STUDY_YEARS = ["שנה א׳", "שנה ב׳", "שנה ג׳", "שנה ד׳", "שנה ה׳", "בוגר"];
const REGIONS = [
  "תל אביב והמרכז",
  "ירושלים",
  "חיפה והצפון",
  "באר שבע והדרום",
  "השרון",
  "השפלה",
  "אחר",
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    institution: "",
    degree: "",
    study_year: "",
    region: "",
    birth_date: "",
    privacy_consent: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!form.privacy_consent) {
      setError("יש לאשר את תנאי הפרטיות כדי להמשיך");
      return;
    }

    setLoading(true);
    setError(null);

    // All profile fields are passed as user metadata so the DB trigger
    // can insert them into members in one atomic operation — no session required.
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name || null,
          phone: form.phone || null,
          institution: form.institution || null,
          degree: form.degree || null,
          study_year: form.study_year || null,
          region: form.region || null,
          birth_date: form.birth_date || null,
          privacy_consent: form.privacy_consent,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg-primary)",
        padding: "32px 16px 48px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 24 }}>
        <Link href="/welcome" style={{ fontSize: 13, color: "var(--color-text-muted)", textDecoration: "none", fontWeight: 500 }}>
          ← חזרה
        </Link>
        <h1
          style={{
            margin: "16px 0 4px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 32,
            color: "var(--color-text-primary)",
          }}
        >
          הרשמה לכיוונים
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: "var(--color-text-muted)", fontFamily: "var(--font-heebo)" }}>
          מלאו את הפרטים כדי להצטרף למועדון
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "24px 20px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* ── Account ── */}
        <Section label="פרטי התחברות">
          <Field label="אימייל *">
            <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" style={inputStyle} />
          </Field>
          <Field label="סיסמה * (לפחות 6 תווים)">
            <input type="password" required minLength={6} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••" style={inputStyle} />
          </Field>
        </Section>

        <Divider />

        {/* ── Personal ── */}
        <Section label="פרטים אישיים">
          <Field label="שם מלא">
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="שם פרטי ומשפחה" style={inputStyle} />
          </Field>
          <Field label="טלפון">
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="05X-XXXXXXX" style={inputStyle} />
          </Field>
          <Field label="תאריך לידה">
            <input type="date" value={form.birth_date} onChange={(e) => set("birth_date", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="אזור מגורים">
            <select value={form.region} onChange={(e) => set("region", e.target.value)} style={inputStyle}>
              <option value="">בחר אזור...</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
        </Section>

        <Divider />

        {/* ── Academic ── */}
        <Section label="פרטי לימודים">
          <Field label="מוסד לימוד">
            <input type="text" value={form.institution} onChange={(e) => set("institution", e.target.value)} placeholder="שם האוניברסיטה / המכללה" style={inputStyle} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="תואר">
              <select value={form.degree} onChange={(e) => set("degree", e.target.value)} style={inputStyle}>
                <option value="">בחר...</option>
                {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="שנתון">
              <select value={form.study_year} onChange={(e) => set("study_year", e.target.value)} style={inputStyle}>
                <option value="">בחר...</option>
                {STUDY_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        <Divider />

        {/* ── Privacy ── */}
        <div style={{ padding: "16px 0 4px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.privacy_consent}
              onChange={(e) => set("privacy_consent", e.target.checked)}
              style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, cursor: "pointer", accentColor: "#0F0F0F" }}
            />
            <span style={{ fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)", fontFamily: "var(--font-heebo)" }}>
              קראתי ואני מסכים/ה{" "}
              <span style={{ textDecoration: "underline", color: "var(--color-text-primary)" }}>לתנאי השימוש ומדיניות הפרטיות</span>{" "}
              של מועדון כיוונים. הפרטים שמסרתי ישמשו לצורכי חברות במועדון בלבד.
            </span>
          </label>
        </div>

        {/* Error */}
        {error && (
          <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--color-error)", fontWeight: 600, fontFamily: "var(--font-heebo)" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "15px 0",
            background: loading ? "#ccc" : "#0F0F0F",
            color: loading ? "#888" : "var(--color-accent-highlight)",
            border: "2px solid #0F0F0F",
            borderRadius: 0,
            boxShadow: loading ? "none" : "3px 3px 0 0 #555",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 17,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.01em",
          }}
        >
          {loading ? "נרשם..." : "הירשם למועדון"}
        </button>

        <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-heebo)" }}>
          כבר יש לך חשבון?{" "}
          <Link href="/login" style={{ color: "var(--color-text-primary)", fontWeight: 700, textDecoration: "underline" }}>
            כניסה
          </Link>
        </p>
      </form>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#E0E0E0", margin: "0 -20px" }} />;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "var(--font-heebo)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "11px 13px",
  fontSize: 15,
  fontFamily: "var(--font-heebo)",
  border: "2px solid #0F0F0F",
  borderRadius: 0,
  background: "#FAFAFA",
  color: "var(--color-text-primary)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
};
