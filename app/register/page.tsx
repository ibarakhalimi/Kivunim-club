"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

const STUDY_YEARS = ["שנה א׳", "שנה ב׳", "שנה ג׳", "שנה ד׳", "אחר"];
const REGIONS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳", "יא׳", "יב׳", "יג׳", "יד׳", "טו׳", "טז׳", "סיטי", "מע״ר"];
const INSTITUTIONS = [
  "שנקר", "המכללה למנהל - ראשל״צ", "ספיר", "אונו - המכללה האקדמית", "מכללת פרס",
  "סמי שמעון - אשדוד", "האוניברסיטה הפתוחה", "גבעת וושינגטון", "אונ׳ בר אילן",
  "אונ׳ תל אביב", "מכללת אחווה", "מכללת אשקלון", "המכללה האקדמית לוינסקי וינגייט",
  "Hit חולון", "רייכמן", "אונ׳ עברית ירושלים", "המרכז החרדי להכשרה מקצועית",
  "המכללה למינהל אשדוד", "אפקה", "אונ׳ בן גוריון", "בית ספר לאחיות ע״ש זיוה טל",
  "אונ׳ חיפה", "המרכז האקדמי הרב תחומי ירושלים", "כללי", "המכללה האקדמית חמדת",
  "מכללת הדסה", "האקדמית רמת גן", "אונ׳ אריאל", "האקדמית תל אביב-יפו", "בצלאל",
  "הטכניון", "המוסד האקדמי למשפט ועסקים", "מכללת אורות", "מכללת קיי", "מכללת תלפיות",
  "סמינר בנות אלישבע", "המכללה החרדית", "בראודה", "אחר",
];

const BENEFITS = [
  { emoji: "📅", text: "להתעדכן באירועים סטודנטיאליים בעיר" },
  { emoji: "🎁", text: "לקבל הטבות מועדון שוות" },
  { emoji: "🌱", text: "לפתח ולהצטרף ליוזמות בעיר" },
  { emoji: "💬", text: "להציע רעיונות" },
  { emoji: "📢", text: "לקבל מידע חשוב" },
  { emoji: "🎓", text: "ובקיצור כ-ל מה שצריך כדי לעבור את התואר בשלום" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);

  const [form, setForm] = useState({
    email: "",
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

    const { error: signUpError } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
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

  const headerBlock = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "48px 0 24px",
        position: "relative",
      }}
    >
      {step === "intro" ? (
        <Link
          href="/welcome"
          style={{
            position: "absolute",
            top: 52,
            right: 0,
            textDecoration: "none",
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 14,
            color: "#64748B",
          }}
        >
          → חזרה
        </Link>
      ) : (
        <button
          onClick={() => setStep("intro")}
          style={{
            position: "absolute",
            top: 52,
            right: 0,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 14,
            color: "#64748B",
          }}
        >
          → חזרה
        </button>
      )}
      <Image src="/logo-aguda.png" alt="לוגו האגודה" width={80} height={80} style={{ display: "block" }} />
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            background: "#DCFCE7",
            borderRadius: 20,
            padding: "3px 14px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 13,
            color: "#16A34A",
            marginBottom: 8,
          }}
        >
          הרשמה
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 28,
            lineHeight: 1.2,
            color: "#0F172A",
          }}
        >
          הקלאב הסטודנטיאלי
        </h1>
      </div>
    </div>
  );

  if (step === "intro") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#F8FAFC",
          direction: "rtl",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            {headerBlock}

            {/* About box */}
            <div style={infoCardStyle}>
              <p style={sectionLabelStyle}>מי אנחנו</p>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 15, lineHeight: 1.7, color: "#475569" }}>
                אגודת הסטודנטים העירונית באשדוד הוקמה על ידי קבוצת ׳בקטע מקומי׳ במרכז כיוונים כדי לייצג את כלל הסטודנטים והסטודנטיות בעיר ללא הבדלי מוסד, תואר או שנתון.
              </p>
            </div>

            {/* Benefits box */}
            <div style={{ ...infoCardStyle, marginTop: 12 }}>
              <p style={{ ...sectionLabelStyle, marginBottom: 12 }}>למה להצטרף?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {BENEFITS.map(({ emoji, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 18, lineHeight: 1.5, flexShrink: 0 }}>{emoji}</span>
                    <span style={{ fontFamily: "var(--font-rubik)", fontSize: 15, lineHeight: 1.55, color: "#475569" }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 24 }} />
          </div>
        </div>

        {/* Sticky CTA */}
        <div
          style={{
            flexShrink: 0,
            padding: "16px 24px 44px",
            background: "linear-gradient(to top, #F8FAFC 70%, transparent 100%)",
          }}
        >
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <button
              onClick={() => setStep("form")}
              style={primaryBtnStyle}
            >
              הרשמה למועדון
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "0 24px 56px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        {headerBlock}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="אימייל *">
            <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="כתובת אימייל" style={inputStyle} />
          </Field>
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
          <Field label="מוסד לימוד">
            <InstitutionInput value={form.institution} onChange={(v) => set("institution", v)} />
          </Field>
          <Field label="תואר לימוד">
            <input type="text" value={form.degree} onChange={(e) => set("degree", e.target.value)} placeholder="לדוגמה: תקשורת, מנהל עסקים" style={inputStyle} />
          </Field>
          <Field label="שנתון">
            <select value={form.study_year} onChange={(e) => set("study_year", e.target.value)} style={inputStyle}>
              <option value="">בחר...</option>
              {STUDY_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>

          {/* Privacy */}
          <div style={{ marginTop: 4 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.privacy_consent}
                onChange={(e) => set("privacy_consent", e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0, cursor: "pointer", accentColor: "#1E40AF" }}
              />
              <span style={{ fontSize: 14, lineHeight: 1.6, color: "#475569", fontFamily: "var(--font-rubik)" }}>
                קראתי ואני מסכים/ה{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  style={{ textDecoration: "underline", color: "#1E40AF", fontWeight: 600, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-rubik)", fontSize: 14 }}
                >
                  לתנאי השימוש ומדיניות הפרטיות
                </button>{" "}
                של מועדון כיוונים.
              </span>
            </label>
          </div>

          {error && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#DC2626", fontWeight: 600, fontFamily: "var(--font-rubik)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...primaryBtnStyle, marginTop: 8, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "נרשם..." : "הירשם למועדון"}
          </button>

          <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: 14, color: "#64748B", fontFamily: "var(--font-rubik)" }}>
            כבר יש לך חשבון?{" "}
            <Link href="/login" style={{ color: "#1E40AF", fontWeight: 700, textDecoration: "none" }}>
              כניסה
            </Link>
          </p>
        </form>
      </div>

      {/* Terms modal */}
      {termsOpen && (
        <>
          <div onClick={() => setTermsOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 101,
              background: "#fff",
              borderRadius: "16px 16px 0 0",
              border: "1px solid #E2E8F0",
              borderBottom: "none",
              direction: "rtl",
              maxHeight: "85dvh",
              overflowY: "auto",
              padding: "24px 24px 48px",
            }}
          >
            <button
              onClick={() => setTermsOpen(false)}
              style={{
                position: "absolute", top: 14, left: 16,
                width: 32, height: 32,
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                fontSize: 15,
                cursor: "pointer",
                color: "#64748B",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            <h2 style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 20, color: "#0F172A" }}>
              תנאי שימוש ומדיניות פרטיות
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "var(--font-rubik)", fontSize: 15, lineHeight: 1.75, color: "#475569" }}>
              {[
                { title: "1. מטרת השירות", body: "מועדון כיוונים הוא מועדון הטבות ופעילויות לסטודנטים בעיר אשדוד. ההרשמה מאפשרת גישה להטבות, אירועים ועדכונים הרלוונטיים לחיי הסטודנט." },
                { title: "2. איסוף מידע", body: "במסגרת ההרשמה נאסף מידע אישי הכולל: שם, כתובת אימייל, מספר טלפון, מוסד לימוד, תואר, שנתון, אזור מגורים ותאריך לידה. המידע נשמר בצורה מאובטחת ומשמש לצורך ניהול החברות במועדון בלבד." },
                { title: "3. שימוש במידע", body: "המידע שנאסף ישמש לצורך: שליחת עדכונים ומידע על אירועים, הפעלת מועדון ההטבות, יצירת קשר עם חברי המועדון ושיפור השירותים המוצעים. לא יועבר מידע לגורמים שלישיים ללא הסכמתך." },
                { title: "4. אבטחת מידע", body: "המידע מאוחסן בצורה מוצפנת ומאובטחת באמצעות Supabase. אנו נוקטים בכל האמצעים הסבירים להגן על פרטיותך." },
                { title: "5. זכויות המשתמש", body: "יש לך הזכות לעיין במידע שנשמר עליך, לתקנו או לבקש את מחיקתו בכל עת על ידי פנייה אלינו ישירות." },
                { title: "6. יצירת קשר", body: "לכל שאלה בנוגע לתנאי השימוש ומדיניות הפרטיות ניתן לפנות אלינו דרך פרטי הקשר באתר." },
              ].map(({ title, body }) => (
                <div key={title}>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{title}</p>
                  <p style={{ margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTermsOpen(false)}
              style={{ ...primaryBtnStyle, marginTop: 24 }}
            >
              הבנתי, סגור
            </button>
          </div>
        </>
      )}
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
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            overflow: "hidden",
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {matches.map((inst) => (
            <div
              key={inst}
              onMouseDown={() => { onChange(inst); setOpen(false); }}
              style={{
                padding: "10px 14px",
                fontSize: 14,
                fontFamily: "var(--font-rubik)",
                color: "#0F172A",
                cursor: "pointer",
                borderBottom: "1px solid #F1F5F9",
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", fontFamily: "var(--font-rubik)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "11px 14px",
  fontSize: 15,
  fontFamily: "var(--font-rubik)",
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  background: "#fff",
  color: "#0F172A",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
  fontWeight: 400,
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 0",
  background: "#1E40AF",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
};

const infoCardStyle: React.CSSProperties = {
  padding: "16px",
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const sectionLabelStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#94A3B8",
};
