"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

const DEGREES = ["תואר ראשון", "תואר שני", "תואר שלישי", "עמיתות מחקר", "אחר"];
const STUDY_YEARS = ["שנה א׳", "שנה ב׳", "שנה ג׳"];
const REGIONS = ["א׳", "ב׳", "ג׳", "ד׳", "סיטי", "ה׳"];
const INSTITUTIONS = ["המכללה למנהל", "סמי שמעון", "אונ׳ תל אביב"];

const BENEFITS = [
  { emoji: "📅", text: "להתעדכן באירועים סטודנטיאליים בעיר" },
  { emoji: "🎁", text: "לקבל הטבות מועדון שוות" },
  { emoji: "🌱", text: "לפתח ולהצטרף ליוזמות בעיר" },
  { emoji: "💬", text: "להציע רעיונות" },
  { emoji: "📢", text: "לקבל מידע חשוב" },
  { emoji: "🎓", text: "ובקיצור כ-ל מה שצריך כדי לעבור את התואר בשלום" },
];

const BG = "linear-gradient(160deg, #FFE4CC 0%, #EDE8FF 35%, #C6F0DE 70%, #FAFAF5 100%)";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "form">("intro");
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
    router.push("/register/success");
  }

  if (step === "intro") {
    return (
      <div
        style={{
          height: "100dvh",
          background: BG,
          direction: "rtl",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar — fixed height */}
        <div style={{ padding: "48px 24px 0", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Image src="/logo-aguda.png" alt="לוגו האגודה" width={80} height={80} style={{ display: "block" }} />
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px 0" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            {/* Heading */}
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <h1
                style={{
                  margin: "0 0 10px",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 800,
                  fontSize: 38,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary)",
                }}
              >
                וולקאם למועדון
              </h1>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 500,
                  fontSize: 18,
                  lineHeight: 1.5,
                  color: "var(--color-text-secondary)",
                }}
              >
                מועדון ההטבות והפעילויות<br />הסטודנטיאלי של אשדוד
              </p>
            </div>

            {/* Box 1 — About */}
            <div style={boxStyle}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  marginBottom: 10,
                }}
              >
                מי אנחנו
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary)",
                }}
              >
                אגודת הסטודנטים העירונית באשדוד הוקמה על ידי קבוצת ׳בקטע מקומי׳ במרכז כיוונים כדי לייצג את כלל הסטודנטים והסטודנטיות בעיר ללא הבדלי מוסד, תואר או שנתון. במטרה לייצג את כל ענייניהם בתחומי אקדמיה, תרבות, חיי היום יום בעיר, הקמת מועדון הטבות והגשמה של רעיונות שבאים מתוך הסטודנטים. ועוד ועוד ועוד.
              </p>
            </div>

            {/* Box 2 — Benefits list */}
            <div style={{ ...boxStyle, marginTop: 12 }}>
              <p
                style={{
                  margin: "0 0 12px",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                }}
              >
                למה להצטרף?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {BENEFITS.map(({ emoji, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 20, lineHeight: 1.4, flexShrink: 0 }}>{emoji}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-rubik)",
                        fontSize: 15,
                        lineHeight: 1.55,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* bottom spacer so last box clears the sticky button */}
            <div style={{ height: 24 }} />
          </div>
        </div>

        {/* Sticky bottom CTA */}
        <div
          style={{
            flexShrink: 0,
            padding: "16px 24px 44px",
            background: "linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 100%)",
          }}
        >
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => setStep("form")}
              style={{
                width: "100%",
                padding: "16px 0",
                background: "var(--color-accent-primary)",
                color: "#fff",
                border: "2px solid var(--color-accent-primary)",
                borderRadius: "var(--radius-md)",
                boxShadow: "none",
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 18,
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              הרשמה למועדון
            </button>
            <Link href="/welcome" style={{ textDecoration: "none" }}>
              <div
                style={{
                  width: "100%",
                  padding: "15px 0",
                  background: "rgba(255,255,255,0.75)",
                  color: "var(--color-text-primary)",
                  border: "2px solid var(--color-accent-primary)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "none",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 700,
                  fontSize: 16,
                  textAlign: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                }}
              >
                ← חזרה
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: BG,
        padding: "48px 24px 56px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 28 }}>
        <Image src="/logo-aguda.png" alt="לוגו האגודה" width={80} height={80} style={{ display: "block" }} />
      </div>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 24 }}>
        <button
          onClick={() => setStep("intro")}
          style={{ fontSize: 13, color: "var(--color-text-muted)", background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: 600, fontFamily: "var(--font-rubik)" }}
        >
          ← חזרה
        </button>
        <h1
          style={{
            margin: "16px 0 6px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 32,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
          }}
        >
          הרשמה לכיוונים
        </h1>
        <p style={{ margin: 0, fontSize: 16, color: "var(--color-text-secondary)", fontFamily: "var(--font-rubik)", fontWeight: 500 }}>
          מלאו את הפרטים כדי להצטרף למועדון
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "24px 20px 28px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(8px)",
          borderRadius: "var(--radius-md)",
          border: "1.5px solid rgba(255,255,255,0.6)",
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
            <InstitutionInput value={form.institution} onChange={(v) => set("institution", v)} />
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
              style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, cursor: "pointer", accentColor: "var(--color-accent-primary)" }}
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
            padding: "16px 0",
            background: loading ? "rgba(0,0,0,0.2)" : "var(--color-accent-primary)",
            color: "#fff",
            border: "2px solid " + (loading ? "rgba(0,0,0,0.1)" : "var(--color-accent-primary)"),
            borderRadius: "var(--radius-md)",
            boxShadow: "none",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 18,
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

function InstitutionInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const matches = value.length >= 2 ? INSTITUTIONS.filter((i) => i.includes(value)) : [];

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="הקלידו שם מוסד..."
        style={inputStyle}
        autoComplete="off"
      />
      {open && matches.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            left: 0,
            background: "rgba(255,255,255,0.97)",
            border: "1.5px solid rgba(0,0,0,0.12)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            zIndex: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {matches.map((inst) => (
            <div
              key={inst}
              onMouseDown={() => { onChange(inst); setOpen(false); }}
              style={{
                padding: "11px 14px",
                fontSize: 15,
                fontFamily: "var(--font-rubik)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {inst}
            </div>
          ))}
        </div>
      )}
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
  return <div style={{ height: 1, background: "rgba(0,0,0,0.08)", margin: "0 -20px" }} />;
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
  border: "1.5px solid rgba(0,0,0,0.15)",
  borderRadius: "var(--radius-md)",
  background: "rgba(255,255,255,0.9)",
  color: "var(--color-text-primary)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
};

const boxStyle: React.CSSProperties = {
  padding: "18px 16px",
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(8px)",
  borderRadius: "var(--radius-md)",
  border: "1.5px solid rgba(255,255,255,0.6)",
};
