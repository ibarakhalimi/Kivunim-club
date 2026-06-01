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

const BG = "#e7e3da";
const DOTS = "radial-gradient(circle, rgba(0,0,0,0.1) 1.2px, transparent 1.2px)";

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

    // All profile fields are passed as user metadata so the DB trigger
    // can insert them into members in one atomic operation — no session required.
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

  if (step === "intro") {
    return (
      <div
        style={{
          height: "100dvh",
          background: BG,
          backgroundImage: DOTS,
          backgroundSize: "18px 18px",
          direction: "rtl",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar — fixed height */}
        <div style={{ padding: "40px 24px 0", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, position: "relative" }}>
          <Link href="/welcome" style={{ position: "absolute", top: 44, right: 24, textDecoration: "none", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, color: "#111" }}>
            → חזרה
          </Link>
          <Image src="/logo-aguda.png" alt="לוגו האגודה" width={110} height={110} style={{ display: "block" }} />
          <span style={{
            background: "#A8D464",
            border: "2.5px solid #000",
            borderRadius: 99,
            padding: "4px 16px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 14,
            color: "#111",
          }}>
            הרשמה
          </span>
          <h1 style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 36,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#111",
            textAlign: "center",
          }}>
            הקלאב הסטודנטיאלי
          </h1>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 0" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>

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
            <div style={{ ...boxStyle, marginTop: 16 }}>
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
            background: "linear-gradient(to top, #e7e3da 60%, transparent 100%)",
          }}
        >
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <button
              onClick={() => setStep("form")}
              style={{
                width: "100%",
                padding: "16px 0",
                background: "#5250DB",
                color: "#fff",
                border: "3px solid #000",
                borderRadius: "var(--radius-md)",
                boxShadow: "4px 4px 0px #000",
                fontFamily: "'Comic Sans MS', cursive, sans-serif",
                fontWeight: 800,
                fontSize: 18,
                cursor: "pointer",
              }}
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
        background: BG,
        backgroundImage: DOTS,
        backgroundSize: "18px 18px",
        padding: "48px 24px 56px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Same header as intro */}
      <div style={{ padding: "0 0 28px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, position: "relative", width: "100%", maxWidth: 480 }}>
        <button
          onClick={() => setStep("intro")}
          style={{ position: "absolute", top: 0, right: 24, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, color: "#111" }}
        >
          → חזרה
        </button>
        <Image src="/logo-aguda.png" alt="לוגו האגודה" width={110} height={110} style={{ display: "block" }} />
        <span style={{
          background: "#A8D464",
          border: "2.5px solid #000",
          borderRadius: 99,
          padding: "4px 16px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 14,
          color: "#111",
        }}>
          הרשמה
        </span>
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-rubik)",
          fontWeight: 900,
          fontSize: 36,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "#111",
          textAlign: "center",
        }}>
          הקלאב הסטודנטיאלי
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="אימייל *">
            <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" style={inputStyle} />
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
        </div>

        {/* Privacy */}
        <div style={{ marginTop: 20 }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.privacy_consent}
              onChange={(e) => set("privacy_consent", e.target.checked)}
              style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, cursor: "pointer", accentColor: "#5250DB" }}
            />
            <span style={{ fontSize: 15, lineHeight: 1.6, color: "#333", fontFamily: "var(--font-rubik)" }}>
              קראתי ואני מסכים/ה{" "}
              <button type="button" onClick={() => setTermsOpen(true)} style={{ textDecoration: "underline", color: "#111", fontWeight: 700, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-rubik)", fontSize: 15 }}>לתנאי השימוש ומדיניות הפרטיות</button>{" "}
              של מועדון כיוונים.
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
            background: loading ? "#aaa" : "#5250DB",
            color: "#fff",
            border: "3px solid #000",
            borderRadius: "var(--radius-md)",
            boxShadow: loading ? "none" : "4px 4px 0px #000",
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            fontWeight: 800,
            fontSize: 18,
            cursor: loading ? "not-allowed" : "pointer",
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

      {/* Terms modal */}
      {termsOpen && (
        <>
          <div onClick={() => setTermsOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100 }} />
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
              maxHeight: "85dvh",
              overflowY: "auto",
              padding: "24px 24px 48px",
            }}
          >
            <button
              onClick={() => setTermsOpen(false)}
              style={{ position: "absolute", top: 14, left: 16, width: 34, height: 34, background: "#fff", border: "2.5px solid #000", borderRadius: "50%", boxShadow: "2px 2px 0 #000", fontSize: 16, cursor: "pointer", fontWeight: 900 }}
            >
              ✕
            </button>

            <h2 style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#111" }}>
              תנאי שימוש ומדיניות פרטיות
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "var(--font-rubik)", fontSize: 15, lineHeight: 1.75, color: "#333" }}>
              <div>
                <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 16, color: "#111" }}>1. מטרת השירות</p>
                <p style={{ margin: 0 }}>מועדון כיוונים הוא מועדון הטבות ופעילויות לסטודנטים בעיר אשדוד. ההרשמה מאפשרת גישה להטבות, אירועים ועדכונים הרלוונטיים לחיי הסטודנט.</p>
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 16, color: "#111" }}>2. איסוף מידע</p>
                <p style={{ margin: 0 }}>במסגרת ההרשמה נאסף מידע אישי הכולל: שם, כתובת אימייל, מספר טלפון, מוסד לימוד, תואר, שנתון, אזור מגורים ותאריך לידה. המידע נשמר בצורה מאובטחת ומשמש לצורך ניהול החברות במועדון בלבד.</p>
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 16, color: "#111" }}>3. שימוש במידע</p>
                <p style={{ margin: 0 }}>המידע שנאסף ישמש לצורך: שליחת עדכונים ומידע על אירועים, הפעלת מועדון ההטבות, יצירת קשר עם חברי המועדון ושיפור השירותים המוצעים. לא יועבר מידע לגורמים שלישיים ללא הסכמתך.</p>
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 16, color: "#111" }}>4. אבטחת מידע</p>
                <p style={{ margin: 0 }}>המידע מאוחסן בצורה מוצפנת ומאובטחת באמצעות Supabase. אנו נוקטים בכל האמצעים הסבירים להגן על פרטיותך.</p>
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 16, color: "#111" }}>5. זכויות המשתמש</p>
                <p style={{ margin: 0 }}>יש לך הזכות לעיין במידע שנשמר עליך, לתקנו או לבקש את מחיקתו בכל עת על ידי פנייה אלינו ישירות.</p>
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 16, color: "#111" }}>6. יצירת קשר</p>
                <p style={{ margin: 0 }}>לכל שאלה בנוגע לתנאי השימוש ומדיניות הפרטיות ניתן לפנות אלינו דרך פרטי הקשר באתר.</p>
              </div>
            </div>

            <button
              onClick={() => setTermsOpen(false)}
              style={{ marginTop: 28, width: "100%", padding: "14px 0", background: "#111", color: "#fff", border: "3px solid #000", borderRadius: 12, boxShadow: "4px 4px 0 #000", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, cursor: "pointer" }}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontSize: 16, fontWeight: 800, color: "#111", fontFamily: "var(--font-rubik)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "13px 16px",
  fontSize: 16,
  fontFamily: "var(--font-rubik)",
  border: "3px solid #000",
  borderRadius: 12,
  boxShadow: "4px 4px 0px #000",
  background: "#fff",
  color: "#111",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
  fontWeight: 500,
};

const boxStyle: React.CSSProperties = {
  padding: "18px 16px",
  background: "#fff",
  borderRadius: 16,
  border: "3px solid #000",
  boxShadow: "5px 5px 0px #000",
};
