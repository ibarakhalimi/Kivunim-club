"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerMember } from "@/app/actions/register";

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
  const [duplicatePhoneOpen, setDuplicatePhoneOpen] = useState(false);

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

  const isFormComplete = [
    form.email,
    form.name,
    form.institution,
    form.degree,
    form.study_year,
    form.region,
    form.birth_date,
  ].every((value) => value.trim().length > 0) && /^05\d{8}$/.test(form.phone) && form.privacy_consent;

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!isFormComplete) {
      setError("יש למלא את כל הפרטים ולאשר את תנאי הפרטיות כדי להמשיך");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await registerMember(form);

    if ("duplicatePhone" in result) {
      setLoading(false);
      setDuplicatePhoneOpen(true);
      return;
    }

    if ("error" in result) {
      setError(result.error);
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
        padding: "38px 0 26px",
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
            color: "#9CA0AE",
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
            color: "#9CA0AE",
          }}
        >
          → חזרה
        </button>
      )}
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: 28,
          background: "#F7F8FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src="/logo-aguda.png" alt="לוגו האגודה" width={72} height={72} style={{ display: "block" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            background: "rgba(89, 52, 237, 0.14)",
            borderRadius: 20,
            padding: "3px 14px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 13,
            color: "#5934ED",
            marginBottom: 8,
          }}
        >
          הרשמה
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 31,
            lineHeight: 1.12,
            color: "#290800",
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
          background: "#DFDBD3",
          direction: "rtl",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: "0 28px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            {headerBlock}

            {/* About */}
            <section>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, lineHeight: 1.6, color: "#683633" }}>
                אגודת הסטודנטים העירונית באשדוד הוקמה על ידי קבוצת ׳בקטע מקומי׳ במרכז כיוונים כדי לייצג את כלל הסטודנטים והסטודנטיות בעיר ללא הבדלי מוסד, תואר או שנתון.
              </p>
            </section>

            {/* Benefits */}
            <section style={{ marginTop: 26 }}>
              <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 21, lineHeight: 1.25, color: "#5934ED" }}>
                למה להצטרף?
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {BENEFITS.map(({ emoji, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 28, lineHeight: 1.15, flexShrink: 0 }}>{emoji}</span>
                    <span style={{ fontFamily: "var(--font-rubik)", fontSize: 17, fontWeight: 800, lineHeight: 1.5, color: "#683633" }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ height: 24 }} />
          </div>
        </div>

        {/* Sticky CTA */}
        <div
          style={{
            flexShrink: 0,
            padding: "16px 14px 44px",
            background: "linear-gradient(to top, #DFDBD3 70%, rgba(223, 219, 211, 0) 100%)",
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
        background: "#DFDBD3",
        padding: "0 14px 124px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        {headerBlock}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="אימייל">
            <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="כתובת אימייל" style={inputStyle} />
          </Field>
          <Field label="שם מלא">
            <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="שם פרטי ומשפחה" style={inputStyle} />
          </Field>
          <Field label="טלפון">
            <input
              type="tel"
              required
              inputMode="numeric"
              pattern="05[0-9]{8}"
              maxLength={10}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="05XXXXXXXX"
              style={inputStyle}
            />
          </Field>
          <Field label="תאריך לידה">
            <input type="date" required value={form.birth_date} onChange={(e) => set("birth_date", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="אזור מגורים">
            <select required value={form.region} onChange={(e) => set("region", e.target.value)} style={inputStyle}>
              <option value="">בחר אזור...</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="מוסד לימוד">
            <InstitutionInput value={form.institution} onChange={(v) => set("institution", v)} />
          </Field>
          <Field label="תואר לימוד">
            <input type="text" required value={form.degree} onChange={(e) => set("degree", e.target.value)} placeholder="לדוגמה: תקשורת, מנהל עסקים" style={inputStyle} />
          </Field>
          <Field label="שנתון">
            <select required value={form.study_year} onChange={(e) => set("study_year", e.target.value)} style={inputStyle}>
              <option value="">בחר...</option>
              {STUDY_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>

          {/* Privacy */}
          <div style={{ marginTop: 4 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                required
                checked={form.privacy_consent}
                onChange={(e) => set("privacy_consent", e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0, cursor: "pointer", accentColor: "#683633" }}
              />
              <span style={{ fontSize: 14, lineHeight: 1.6, color: "#683633", fontFamily: "var(--font-rubik)", fontWeight: 600 }}>
                קראתי ואני מסכים/ה{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  style={{ textDecoration: "underline", color: "#5934ED", fontWeight: 900, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-rubik)", fontSize: 14 }}
                >
                  לתנאי השימוש ומדיניות הפרטיות
                </button>{" "}
                של מועדון כיוונים.
              </span>
            </label>
          </div>

          {error && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#FFB4C8", fontWeight: 800, fontFamily: "var(--font-rubik)" }}>
              {error}
            </p>
          )}

          <div
            style={{
              position: "fixed",
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 20,
              padding: "16px 14px calc(16px + env(safe-area-inset-bottom))",
              background: "linear-gradient(to top, #DFDBD3 72%, rgba(223, 219, 211, 0) 100%)",
            }}
          >
            <div style={{ maxWidth: 480, margin: "0 auto" }}>
              <button
                type="submit"
                disabled={loading || !isFormComplete}
                style={{
                  ...primaryBtnStyle,
                  opacity: isFormComplete && !loading ? 1 : 0.45,
                  cursor: loading || !isFormComplete ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "מאשר..." : "אישור הרשמה"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Terms modal */}
      {termsOpen && (
        <>
          <div onClick={() => setTermsOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.62)", zIndex: 100 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 101,
              background: "#EFF2EC",
              borderRadius: "26px 26px 0 0",
              border: "none",
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
                background: "#303446",
                border: "none",
                borderRadius: "50%",
                fontSize: 15,
                cursor: "pointer",
                color: "#290800",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            <h2 style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#290800" }}>
              תנאי שימוש ומדיניות פרטיות
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "var(--font-rubik)", fontSize: 15, lineHeight: 1.75, color: "#C7CAD6" }}>
              {[
                { title: "1. מטרת השירות", body: "מועדון כיוונים הוא מועדון הטבות ופעילויות לסטודנטים בעיר אשדוד. ההרשמה מאפשרת גישה להטבות, אירועים ועדכונים הרלוונטיים לחיי הסטודנט." },
                { title: "2. איסוף מידע", body: "במסגרת ההרשמה נאסף מידע אישי הכולל: שם, כתובת אימייל, מספר טלפון, מוסד לימוד, תואר, שנתון, אזור מגורים ותאריך לידה. המידע נשמר בצורה מאובטחת ומשמש לצורך ניהול החברות במועדון בלבד." },
                { title: "3. שימוש במידע", body: "המידע שנאסף ישמש לצורך: שליחת עדכונים ומידע על אירועים, הפעלת מועדון ההטבות, יצירת קשר עם חברי המועדון ושיפור השירותים המוצעים. לא יועבר מידע לגורמים שלישיים ללא הסכמתך." },
                { title: "4. אבטחת מידע", body: "המידע מאוחסן בצורה מוצפנת ומאובטחת באמצעות Supabase. אנו נוקטים בכל האמצעים הסבירים להגן על פרטיותך." },
                { title: "5. זכויות המשתמש", body: "יש לך הזכות לעיין במידע שנשמר עליך, לתקנו או לבקש את מחיקתו בכל עת על ידי פנייה אלינו ישירות." },
                { title: "6. יצירת קשר", body: "לכל שאלה בנוגע לתנאי השימוש ומדיניות הפרטיות ניתן לפנות אלינו דרך פרטי הקשר באתר." },
              ].map(({ title, body }) => (
                <div key={title}>
                  <p style={{ margin: "0 0 4px", fontWeight: 900, fontSize: 15, color: "#290800" }}>{title}</p>
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

      {duplicatePhoneOpen && (
        <>
          <div
            onClick={() => setDuplicatePhoneOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 110 }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="duplicate-phone-title"
            style={{
              position: "fixed",
              top: "50%",
              right: 20,
              left: 20,
              zIndex: 111,
              transform: "translateY(-50%)",
              maxWidth: 440,
              margin: "0 auto",
              padding: "28px 20px 20px",
              borderRadius: 18,
              background: "#EFF2EC",
              textAlign: "center",
              boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
            }}
          >
            <button
              type="button"
              onClick={() => setDuplicatePhoneOpen(false)}
              aria-label="סגירה"
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: "50%",
                background: "transparent",
                color: "#683633",
                cursor: "pointer",
              }}
            >
              <X size={21} />
            </button>
            <h2
              id="duplicate-phone-title"
              style={{ margin: "8px 0 10px", fontFamily: "var(--font-rubik)", fontSize: 22, fontWeight: 900, color: "#683633" }}
            >
              נראה שכבר נרשמת למועדון
            </h2>
            <p style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontSize: 15, fontWeight: 700, lineHeight: 1.55, color: "#683633" }}>
              מספר הנייד הזה כבר קיים במערכת. אפשר להיכנס באמצעות קוד לנייד.
            </p>
            <Link
              href={`/welcome?phone=${encodeURIComponent(form.phone)}`}
              style={{ ...primaryBtnStyle, display: "block", boxSizing: "border-box", textAlign: "center", textDecoration: "none" }}
            >
              כניסה עם קוד לנייד
            </Link>
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
        required
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
            background: "#EFF2EC",
            border: "none",
            borderRadius: 18,
            overflow: "hidden",
            zIndex: 10,
            boxShadow: "0 16px 34px rgba(0,0,0,0.24)",
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
                color: "#290800",
                cursor: "pointer",
                borderBottom: "1px solid rgba(247, 248, 255, 0.08)",
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
      <label style={{ fontSize: 14, fontWeight: 800, color: "#290800", fontFamily: "var(--font-rubik)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 15,
  fontFamily: "var(--font-rubik)",
  border: "none",
  borderRadius: 18,
  background: "#EFF2EC",
  color: "#290800",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
  fontWeight: 700,
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "15px 0",
  background: "#5934ED",
  color: "#fff",
  border: "none",
  borderRadius: 18,
  fontFamily: "var(--font-rubik)",
  fontWeight: 900,
  fontSize: 16,
  cursor: "pointer",
};
