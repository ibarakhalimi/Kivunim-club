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
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-base)",
            color: "var(--color-text-disabled)",
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
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-base)",
            color: "var(--color-text-disabled)",
          }}
        >
          → חזרה
        </button>
      )}
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: "var(--shape-radius-7xl)",
          background: "var(--color-surface-tinted)",
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
            background: "color-mix(in srgb, var(--color-brand) 14%, transparent)",
            borderRadius: "var(--shape-radius-4xl)",
            padding: "3px 14px",
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-black)",
            fontSize: "var(--font-size-md)",
            color: "var(--color-brand)",
            marginBottom: 8,
          }}
        >
          הרשמה
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-black)",
            fontSize: "var(--font-size-6xl)",
            lineHeight: 1.12,
            color: "var(--color-ink)",
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
          background: "var(--color-app-bg)",
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
              <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-2xl)", lineHeight: 1.6, color: "var(--color-warm-ink)" }}>
                אגודת הסטודנטים העירונית באשדוד הוקמה על ידי קבוצת ׳בקטע מקומי׳ במרכז כיוונים כדי לייצג את כלל הסטודנטים והסטודנטיות בעיר ללא הבדלי מוסד, תואר או שנתון.
              </p>
            </section>

            {/* Benefits */}
            <section style={{ marginTop: 26 }}>
              <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-3xl)", lineHeight: 1.25, color: "var(--color-brand)" }}>
                למה להצטרף?
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {BENEFITS.map(({ emoji, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: "var(--font-size-5xl)", lineHeight: 1.15, flexShrink: 0 }}>{emoji}</span>
                    <span style={{ fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-extrabold)", lineHeight: 1.5, color: "var(--color-warm-ink)" }}>
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
            background: "linear-gradient(to top, var(--color-app-bg) 70%, transparent 100%)",
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
        background: "var(--color-app-bg)",
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
                style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0, cursor: "pointer", accentColor: "var(--color-warm-ink)" }}
              />
              <span style={{ fontSize: "var(--font-size-base)", lineHeight: 1.6, color: "var(--color-warm-ink)", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)" }}>
                קראתי ואני מסכים/ה{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  style={{ textDecoration: "underline", color: "var(--color-brand)", fontWeight: "var(--font-weight-black)", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-base)" }}
                >
                  לתנאי השימוש ומדיניות הפרטיות
                </button>{" "}
                של מועדון כיוונים.
              </span>
            </label>
          </div>

          {error && (
            <p style={{ margin: "4px 0 0", fontSize: "var(--font-size-md)", color: "var(--color-pink-soft)", fontWeight: "var(--font-weight-extrabold)", fontFamily: "var(--font-family-sans)" }}>
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
              background: "linear-gradient(to top, var(--color-app-bg) 72%, transparent 100%)",
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
          <div onClick={() => setTermsOpen(false)} style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--color-overlay) 62%, transparent)", zIndex: 100 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 101,
              background: "var(--color-surface)",
              borderRadius: "var(--shape-radius-sheet)",
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
                background: "var(--color-charcoal-1)",
                border: "none",
                borderRadius: "var(--shape-radius-circle)",
                fontSize: "var(--font-size-lg)",
                cursor: "pointer",
                color: "var(--color-ink)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            <h2 style={{ margin: "0 0 20px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-3xl)", color: "var(--color-ink)" }}>
              תנאי שימוש ומדיניות פרטיות
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-lg)", lineHeight: 1.75, color: "var(--color-neutral-300)" }}>
              {[
                { title: "1. מטרת השירות", body: "מועדון כיוונים הוא מועדון הטבות ופעילויות לסטודנטים בעיר אשדוד. ההרשמה מאפשרת גישה להטבות, אירועים ועדכונים הרלוונטיים לחיי הסטודנט." },
                { title: "2. איסוף מידע", body: "במסגרת ההרשמה נאסף מידע אישי הכולל: שם, כתובת אימייל, מספר טלפון, מוסד לימוד, תואר, שנתון, אזור מגורים ותאריך לידה. המידע נשמר בצורה מאובטחת ומשמש לצורך ניהול החברות במועדון בלבד." },
                { title: "3. שימוש במידע", body: "המידע שנאסף ישמש לצורך: שליחת עדכונים ומידע על אירועים, הפעלת מועדון ההטבות, יצירת קשר עם חברי המועדון ושיפור השירותים המוצעים. לא יועבר מידע לגורמים שלישיים ללא הסכמתך." },
                { title: "4. אבטחת מידע", body: "המידע מאוחסן בצורה מוצפנת ומאובטחת באמצעות Supabase. אנו נוקטים בכל האמצעים הסבירים להגן על פרטיותך." },
                { title: "5. זכויות המשתמש", body: "יש לך הזכות לעיין במידע שנשמר עליך, לתקנו או לבקש את מחיקתו בכל עת על ידי פנייה אלינו ישירות." },
                { title: "6. יצירת קשר", body: "לכל שאלה בנוגע לתנאי השימוש ומדיניות הפרטיות ניתן לפנות אלינו דרך פרטי הקשר באתר." },
              ].map(({ title, body }) => (
                <div key={title}>
                  <p style={{ margin: "0 0 4px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-lg)", color: "var(--color-ink)" }}>{title}</p>
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
            style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--color-overlay) 55%, transparent)", zIndex: 110 }}
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
              borderRadius: "var(--shape-radius-3xl)",
              background: "var(--color-surface)",
              textAlign: "center",
              boxShadow: "0 18px 48px color-mix(in srgb, var(--color-overlay) 28%, transparent)",
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
                borderRadius: "var(--shape-radius-circle)",
                background: "transparent",
                color: "var(--color-warm-ink)",
                cursor: "pointer",
              }}
            >
              <X size={21} />
            </button>
            <h2
              id="duplicate-phone-title"
              style={{ margin: "8px 0 10px", fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-3xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-warm-ink)" }}
            >
              נראה שכבר נרשמת למועדון
            </h2>
            <p style={{ margin: "0 0 20px", fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-bold)", lineHeight: 1.55, color: "var(--color-warm-ink)" }}>
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
            background: "var(--color-surface)",
            border: "none",
            borderRadius: "var(--shape-radius-3xl)",
            overflow: "hidden",
            zIndex: 10,
            boxShadow: "0 16px 34px color-mix(in srgb, var(--color-overlay) 24%, transparent)",
          }}
        >
          {matches.map((inst) => (
            <div
              key={inst}
              onMouseDown={() => { onChange(inst); setOpen(false); }}
              style={{
                padding: "10px 14px",
                fontSize: "var(--font-size-base)",
                fontFamily: "var(--font-family-sans)",
                color: "var(--color-ink)",
                cursor: "pointer",
                borderBottom: "1px solid color-mix(in srgb, var(--color-surface-tinted) 8%, transparent)",
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
      <label style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-extrabold)", color: "var(--color-ink)", fontFamily: "var(--font-family-sans)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "var(--font-size-lg)",
  fontFamily: "var(--font-family-sans)",
  border: "none",
  borderRadius: "var(--shape-radius-3xl)",
  background: "var(--color-surface)",
  color: "var(--color-ink)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
  fontWeight: "var(--font-weight-bold)",
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "15px 0",
  background: "var(--color-brand)",
  color: "var(--color-on-accent)",
  border: "none",
  borderRadius: "var(--shape-radius-3xl)",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-black)",
  fontSize: "var(--font-size-xl)",
  cursor: "pointer",
};
