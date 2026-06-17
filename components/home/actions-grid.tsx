"use client";

import { useActionState, useEffect, useState } from "react";
import { CalendarDays, ClipboardList, FileText, Gift, Lightbulb, MessageCircle, Phone, Plus, UserCheck } from "lucide-react";
import { submitContactInquiry } from "@/app/actions/contact";
import { submitIdea } from "@/app/actions/ideas";

const ALL_ACTIONS = [
  { Icon: Phone, label: "יצירת קשר", bg: "#2F3344", color: "#9CA0AE" },
  { Icon: ClipboardList, label: "מידע חשוב", bg: "#2F3344", color: "#9CA0AE" },
  { Icon: Lightbulb, label: "יש לי רעיון", bg: "#2F3344", color: "#9CA0AE" },
  { Icon: Gift, label: "ההטבות שלי", bg: "#2F3344", color: "#9CA0AE" },
  { Icon: CalendarDays, label: "אירועים קרובים", bg: "#2F3344", color: "#9CA0AE" },
  { Icon: UserCheck, label: "בדיקת נוכחות", bg: "#2F3344", color: "#9CA0AE" },
];

const CONTACT_PHONE = "050-0000000";
const WHATSAPP_URL = "https://wa.me/972500000000";
const CONTACT_SUBJECTS = ["שאלה כללית", "הרשמה ופרטים", "הטבות", "אירועים", "בעיה באפליקציה", "אחר"];
const contactInitialState = { error: undefined as string | undefined, success: false };
const ideaInitialState = { error: undefined as string | undefined, success: false };
const INFO_PAGES = [
  { title: "זכאות למלגות", description: "מידע על תנאי זכאות, מועדים וטפסים להגשה." },
  { title: "שעות פעילות המרכז", description: "פירוט שעות פתיחה, זמינות שירותים וימים מיוחדים." },
  { title: "מרחבי למידה", description: "חדרים שקטים, עמדות עבודה והנחיות שימוש." },
  { title: "סיוע אקדמי", description: "ליווי, שיעורי תגבור ותמיכה בתקופת מבחנים." },
  { title: "הנפקת אישורים", description: "מסמכים נפוצים, אישורי לימודים ופניות מנהלתיות." },
  { title: "הטבות ושיתופי פעולה", description: "כללים לשימוש בהטבות ומימוש מול עסקים." },
  { title: "נהלי השתתפות באירועים", description: "הרשמה, ביטולים, הגעה ועדכונים חשובים." },
];

const drawerStyle = (open: boolean): React.CSSProperties => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: open ? 51 : -1,
  background: "#252836",
  borderRadius: "26px 26px 0 0",
  border: "1px solid rgba(255,255,255,0.06)",
  borderBottom: "none",
  direction: "rtl",
  padding: "0 20px 52px",
  transform: open ? "translateY(0)" : "translateY(105%)",
  transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
  willChange: "transform",
});

const backdropStyle = (open: boolean): React.CSSProperties => ({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 50,
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity 0.28s ease",
});

function Handle() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 16px" }}>
      <div style={{ width: 36, height: 4, background: "#343847", borderRadius: 99 }} />
    </div>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 12,
  color: "#9CA0AE",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  background: "#2F3344",
  padding: "10px 12px",
  fontFamily: "var(--font-rubik)",
  fontSize: 14,
  color: "#FFFFFF",
  outline: "none",
  direction: "rtl",
};

function ContactForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof contactInitialState, formData: FormData) =>
      (await submitContactInquiry(formData)) as typeof contactInitialState,
    contactInitialState
  );

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={fieldLabelStyle}>נושא הפנייה *</label>
        <select name="subject" required defaultValue="" style={fieldStyle}>
          <option value="" disabled>בחר נושא...</option>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={fieldLabelStyle}>הודעה *</label>
        <textarea name="message" required rows={4} placeholder="כתוב כאן את ההודעה..." style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} />
      </div>

      {state.error && <p style={{ margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 700 }}>{state.error}</p>}
      {state.success && <p style={{ margin: 0, fontSize: 13, color: "#34D399", fontWeight: 700 }}>✓ הפנייה נשלחה בהצלחה</p>}

      <button
        type="submit"
        disabled={pending}
        style={{
          border: "none",
          borderRadius: 12,
          background: pending ? "rgba(255,46,154,0.4)" : "#FF2E9A",
          color: "#fff",
          padding: "12px 14px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 900,
          fontSize: 14,
          cursor: pending ? "not-allowed" : "pointer",
        }}
      >
        {pending ? "שולח..." : "שליחת פנייה"}
      </button>
    </form>
  );
}

function IdeaForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof ideaInitialState, formData: FormData) =>
      (await submitIdea(formData)) as typeof ideaInitialState,
    ideaInitialState
  );

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={fieldLabelStyle}>הרעיון שלך *</label>
        <textarea name="idea_text" required rows={5} placeholder="כתוב כאן את הרעיון..." style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} />
      </div>

      {state.error && <p style={{ margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 700 }}>{state.error}</p>}
      {state.success && <p style={{ margin: 0, fontSize: 13, color: "#34D399", fontWeight: 700 }}>✓ הרעיון נשלח בהצלחה</p>}

      <button
        type="submit"
        disabled={pending}
        style={{
          border: "none",
          borderRadius: 12,
          background: pending ? "rgba(255,46,154,0.4)" : "#FF2E9A",
          color: "#fff",
          padding: "12px 14px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 900,
          fontSize: 14,
          cursor: pending ? "not-allowed" : "pointer",
        }}
      >
        {pending ? "שולח..." : "שליחת רעיון"}
      </button>
    </form>
  );
}

export function ActionsGrid() {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [ideaOpen, setIdeaOpen] = useState(false);
  const visibleActions = ALL_ACTIONS.slice(0, 3);

  useEffect(() => {
    function openActionsDrawer() {
      setActionsOpen(true);
    }

    window.addEventListener("open-actions-drawer", openActionsDrawer);
    return () => window.removeEventListener("open-actions-drawer", openActionsDrawer);
  }, []);

  return (
    <>
      <section style={{ width: "100%", display: "flex", alignItems: "stretch", gap: 8, overflow: "hidden", padding: "2px 0" }}>
        {visibleActions.map((action) => (
          <button
            key={`contained-${action.label}`}
            onClick={() => {
              if (action.label === "יצירת קשר") setContactOpen(true);
              if (action.label === "מידע חשוב") setInfoOpen(true);
              if (action.label === "יש לי רעיון") setIdeaOpen(true);
            }}
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "#252836",
              borderRadius: 20,
              padding: "10px 8px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "space-between",
              gap: 12,
              textAlign: "right",
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 13,
                background: "#2F3344",
                color: "#9CA0AE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                alignSelf: "flex-start",
              }}
            >
              <action.Icon size={20} strokeWidth={2.15} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 11,
                lineHeight: 1.15,
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              {action.label}
            </span>
          </button>
        ))}

        <button
          onClick={() => setActionsOpen(true)}
          aria-label="כל הפעולות"
          style={{
            flex: 1,
            minWidth: 0,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "#252836",
            borderRadius: 20,
            padding: "10px 8px",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: 12,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 13,
              background: "#2F3344",
              color: "#9CA0AE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-start",
            }}
          >
            <Plus size={20} strokeWidth={2.4} />
          </span>
          <span
            style={{
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 11,
              lineHeight: 1.15,
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              alignSelf: "stretch",
              textAlign: "right",
            }}
          >
            כל הפעולות
          </span>
        </button>
      </section>

      <div style={backdropStyle(actionsOpen)} onClick={() => setActionsOpen(false)} />
      <div style={drawerStyle(actionsOpen)}>
        <Handle />
        <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#FFFFFF" }}>
          כל הפעולות
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                if (action.label === "יצירת קשר") {
                  setActionsOpen(false);
                  setContactOpen(true);
                }
                if (action.label === "מידע חשוב") {
                  setActionsOpen(false);
                  setInfoOpen(true);
                }
                if (action.label === "יש לי רעיון") {
                  setActionsOpen(false);
                  setIdeaOpen(true);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "#2F3344",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "12px 16px",
                cursor: "pointer",
                width: "100%",
                textAlign: "right",
              }}
            >
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,46,154,0.15)", color: "#FF2E9A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <action.Icon size={18} strokeWidth={2.1} />
              </span>
              <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 15, color: "#FFFFFF" }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={backdropStyle(contactOpen)} onClick={() => setContactOpen(false)} />
      <div style={drawerStyle(contactOpen)}>
        <Handle />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 19, color: "#FFFFFF" }}>
              יצירת קשר
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#9CA0AE" }}>
              אנחנו כאן לכל שאלה או בקשה
            </p>
          </div>
          <button
            type="button"
            onClick={() => setContactOpen(false)}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#2F3344", color: "#9CA0AE", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <a
            href={`tel:${CONTACT_PHONE}`}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 10px", borderRadius: 14, background: "rgba(77,163,255,0.15)", color: "#4DA3FF", textDecoration: "none", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13 }}
          >
            <Phone size={18} strokeWidth={2.2} />
            <span>{CONTACT_PHONE}</span>
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 10px", borderRadius: 14, background: "rgba(52,211,153,0.15)", color: "#34D399", textDecoration: "none", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13 }}
          >
            <MessageCircle size={18} strokeWidth={2.2} />
            <span>וואטסאפ</span>
          </a>
        </div>

        <ContactForm />
      </div>

      <div style={backdropStyle(infoOpen)} onClick={() => setInfoOpen(false)} />
      <div style={drawerStyle(infoOpen)}>
        <Handle />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 19, color: "#FFFFFF" }}>
              מידע חשוב
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#9CA0AE" }}>
              עמודי מידע ושירותים שימושיים
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInfoOpen(false)}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#2F3344", color: "#9CA0AE", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {INFO_PAGES.map((page) => (
            <button
              key={page.title}
              type="button"
              style={{
                width: "100%",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                background: "#2F3344",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                textAlign: "right",
                cursor: "pointer",
              }}
            >
              <span style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,46,154,0.15)", color: "#FF2E9A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={18} strokeWidth={2.15} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", marginBottom: 3, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 14, color: "#FFFFFF" }}>
                  {page.title}
                </span>
                <span style={{ display: "block", fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, lineHeight: 1.35, color: "#9CA0AE" }}>
                  {page.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={backdropStyle(ideaOpen)} onClick={() => setIdeaOpen(false)} />
      <div style={drawerStyle(ideaOpen)}>
        <Handle />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 19, color: "#FFFFFF" }}>
              יש לי רעיון
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#9CA0AE" }}>
              כתוב לנו רעיון לשיפור או פעילות חדשה
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIdeaOpen(false)}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#2F3344", color: "#9CA0AE", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <IdeaForm />
      </div>
    </>
  );
}
