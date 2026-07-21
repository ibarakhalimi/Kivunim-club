"use client";

import { useActionState, useEffect, useState } from "react";
import { CalendarDays, FileText, Gift, Info, Lightbulb, Mail, MessageCircle, Phone, Plus, UserCheck } from "lucide-react";
import { submitContactInquiry } from "@/app/actions/contact";
import { submitIdea } from "@/app/actions/ideas";
import type { ContactSettings, ImportantInfoPage } from "@/app/admin/settings/actions";

const ALL_ACTIONS = [
  { Icon: Phone, label: "יצירת קשר", bg: "var(--color-app-bg)", color: "var(--color-text-disabled)" },
  { Icon: Info, label: "מידע חשוב", bg: "var(--color-app-bg)", color: "var(--color-text-disabled)" },
  { Icon: Lightbulb, label: "יש לי רעיון", bg: "var(--color-app-bg)", color: "var(--color-text-disabled)" },
  { Icon: Gift, label: "ההטבות שלי", bg: "var(--color-app-bg)", color: "var(--color-text-disabled)" },
  { Icon: CalendarDays, label: "אירועים קרובים", bg: "var(--color-app-bg)", color: "var(--color-text-disabled)" },
  { Icon: UserCheck, label: "בדיקת נוכחות", bg: "var(--color-app-bg)", color: "var(--color-text-disabled)" },
];

const CONTACT_SUBJECTS = ["שאלה כללית", "הרשמה ופרטים", "הטבות", "אירועים", "בעיה באפליקציה", "אחר"];
const contactInitialState = { error: undefined as string | undefined, success: false };
const ideaInitialState = { error: undefined as string | undefined, success: false };
const drawerStyle = (open: boolean): React.CSSProperties => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: open ? 51 : -1,
  background: "var(--color-surface)",
  borderRadius: "var(--shape-radius-sheet)",
  border: "1px solid color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
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
  background: "color-mix(in srgb, var(--color-overlay) 50%, transparent)",
  zIndex: 50,
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity 0.28s ease",
});

function Handle() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 16px" }}>
      <div style={{ width: 36, height: 4, background: "var(--color-charcoal-2)", borderRadius: "var(--shape-radius-pill)" }} />
    </div>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)",
  fontSize: "var(--font-size-sm)",
  color: "var(--color-text-disabled)",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid color-mix(in srgb, var(--color-on-accent) 8%, transparent)",
  borderRadius: "var(--shape-radius-md)",
  background: "var(--color-app-bg)",
  padding: "10px 12px",
  fontFamily: "var(--font-family-sans)",
  fontSize: "var(--font-size-base)",
  color: "var(--color-ink)",
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
        <select name="subject" required defaultValue="" style={{ ...fieldStyle, background: "var(--color-app-bg)" }}>
          <option value="" disabled>בחר נושא...</option>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={fieldLabelStyle}>הודעה *</label>
        <textarea name="message" required rows={4} placeholder="כתוב כאן את ההודעה..." style={{ ...fieldStyle, background: "var(--color-app-bg)", resize: "vertical", lineHeight: 1.6 }} />
      </div>

      {state.error && <p style={{ margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-danger)", fontWeight: "var(--font-weight-bold)" }}>{state.error}</p>}
      {state.success && <p style={{ margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-success-bright)", fontWeight: "var(--font-weight-bold)" }}>✓ הפנייה נשלחה בהצלחה</p>}

      <button
        type="submit"
        disabled={pending}
        style={{
          border: "none",
          borderRadius: "var(--shape-radius-lg)",
          background: pending ? "color-mix(in srgb, var(--color-brand) 40%, transparent)" : "var(--color-brand)",
          color: "var(--color-surface-raised)",
          padding: "12px 14px",
          fontFamily: "var(--font-family-sans)",
          fontWeight: "var(--font-weight-black)",
          fontSize: "var(--font-size-base)",
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

      {state.error && <p style={{ margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-danger)", fontWeight: "var(--font-weight-bold)" }}>{state.error}</p>}
      {state.success && <p style={{ margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-success-bright)", fontWeight: "var(--font-weight-bold)" }}>✓ הרעיון נשלח בהצלחה</p>}

      <button
        type="submit"
        disabled={pending}
        style={{
          border: "none",
          borderRadius: "var(--shape-radius-lg)",
          background: pending ? "color-mix(in srgb, var(--color-brand) 40%, transparent)" : "var(--color-brand)",
          color: "var(--color-surface-raised)",
          padding: "12px 14px",
          fontFamily: "var(--font-family-sans)",
          fontWeight: "var(--font-weight-black)",
          fontSize: "var(--font-size-base)",
          cursor: pending ? "not-allowed" : "pointer",
        }}
      >
        {pending ? "שולח..." : "שליחת רעיון"}
      </button>
    </form>
  );
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function whatsappHref(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const digits = digitsOnly(value);
  const internationalDigits = digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
  return `https://wa.me/${internationalDigits}`;
}

export function ActionsGrid({
  contactSettings,
  importantInfoPages,
}: {
  contactSettings: ContactSettings;
  importantInfoPages: ImportantInfoPage[];
}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [ideaOpen, setIdeaOpen] = useState(false);
  const [selectedInfoPage, setSelectedInfoPage] = useState<ImportantInfoPage | null>(null);
  const visibleActions = ALL_ACTIONS.slice(0, 3);
  const contactMethods = [
    contactSettings.mobile_phone
      ? {
          key: "phone",
          href: `tel:${digitsOnly(contactSettings.mobile_phone)}`,
          label: contactSettings.mobile_phone,
          Icon: Phone,
          bg: "color-mix(in srgb, var(--color-sky) 15%, transparent)",
          color: "var(--color-sky)",
        }
      : null,
    contactSettings.whatsapp
      ? {
          key: "whatsapp",
          href: whatsappHref(contactSettings.whatsapp),
          label: "וואטסאפ",
          Icon: MessageCircle,
          bg: "color-mix(in srgb, var(--color-success-bright) 15%, transparent)",
          color: "var(--color-success-bright)",
          external: true,
        }
      : null,
    contactSettings.email
      ? {
          key: "email",
          href: `mailto:${contactSettings.email}`,
          label: contactSettings.email,
          Icon: Mail,
          bg: "color-mix(in srgb, var(--color-brand) 15%, transparent)",
          color: "var(--color-brand)",
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    href: string;
    label: string;
    Icon: typeof Phone;
    bg: string;
    color: string;
    external?: boolean;
  }>;

  useEffect(() => {
    function openActionsDrawer() {
      setActionsOpen(true);
    }

    window.addEventListener("open-actions-drawer", openActionsDrawer);
    return () => window.removeEventListener("open-actions-drawer", openActionsDrawer);
  }, []);

  return (
    <>
      <section style={{ width: "100%", display: "flex", alignItems: "stretch", gap: 8, overflow: "visible", padding: "8px 0 2px" }}>
        {visibleActions.map((action) => (
          <button
            key={`contained-${action.label}`}
            onClick={() => {
              if (action.label === "יצירת קשר") setContactOpen(true);
              if (action.label === "יש לי רעיון") setIdeaOpen(true);
            }}
            style={{
              position: "relative",
              flex: 1,
              minWidth: 0,
              border: "none",
              background: "var(--color-surface)",
              borderRadius: "var(--shape-radius-4xl)",
              minHeight: 92,
              padding: "13px 8px",
              cursor: action.label === "מידע חשוב" ? "default" : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              textAlign: "center",
            }}
          >
            {action.label === "מידע חשוב" && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  left: 8,
                  borderRadius: "var(--shape-radius-pill)",
                  background: "var(--color-brand)",
                  color: "var(--color-ink)",
                  padding: "3px 8px",
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-black)",
                  fontSize: "var(--font-size-2xs)",
                  lineHeight: 1,
                  boxShadow: "0 6px 14px color-mix(in srgb, var(--color-overlay) 22%, transparent)",
                  pointerEvents: "none",
                }}
              >
                בקרוב
              </span>
            )}
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--shape-radius-circle)",
                background: "var(--color-neutral-blue)",
                color: "var(--color-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              <action.Icon size={20} strokeWidth={2.15} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-family-sans)",
                fontWeight: "var(--font-weight-extrabold)",
                fontSize: "var(--font-size-xs)",
                lineHeight: 1.15,
                color: "var(--color-ink)",
                whiteSpace: "nowrap",
              }}
            >
              {action.label}
            </span>
          </button>
        ))}

        <button
          type="button"
          aria-label="כל הפעולות"
          style={{
            position: "relative",
            flex: 1,
            minWidth: 0,
            border: "none",
            background: "var(--color-surface)",
            borderRadius: "var(--shape-radius-4xl)",
            minHeight: 92,
            padding: "13px 8px",
            color: "var(--color-ink)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            cursor: "default",
            textAlign: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -6,
              left: 8,
              borderRadius: "var(--shape-radius-pill)",
              background: "var(--color-brand)",
              color: "var(--color-ink)",
              padding: "3px 8px",
              fontFamily: "var(--font-family-sans)",
              fontWeight: "var(--font-weight-black)",
              fontSize: "var(--font-size-2xs)",
              lineHeight: 1,
              boxShadow: "0 6px 14px color-mix(in srgb, var(--color-overlay) 22%, transparent)",
              pointerEvents: "none",
            }}
          >
            בקרוב
          </span>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--shape-radius-circle)",
              background: "var(--color-neutral-blue)",
              color: "var(--color-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={20} strokeWidth={2.4} />
          </span>
          <span
            style={{
              fontFamily: "var(--font-family-sans)",
              fontWeight: "var(--font-weight-extrabold)",
              fontSize: "var(--font-size-xs)",
              lineHeight: 1.15,
              color: "var(--color-ink)",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            כל הפעולות
          </span>
        </button>
      </section>

      <div style={backdropStyle(actionsOpen)} onClick={() => setActionsOpen(false)} />
      <div style={drawerStyle(actionsOpen)}>
        <Handle />
        <p style={{ margin: "0 0 16px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-2xl)", color: "var(--color-ink)" }}>
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
                  setSelectedInfoPage(null);
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
                background: "var(--color-app-bg)",
                border: "1px solid color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
                borderRadius: "var(--shape-radius-lg)",
                padding: "12px 16px",
                cursor: "pointer",
                width: "100%",
                textAlign: "right",
              }}
            >
              <span style={{ width: 34, height: 34, borderRadius: "var(--shape-radius-md)", background: "color-mix(in srgb, var(--color-brand) 15%, transparent)", color: "var(--color-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <action.Icon size={18} strokeWidth={2.1} />
              </span>
              <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-lg)", color: "var(--color-ink)" }}>
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
            <p style={{ margin: "0 0 3px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-2xl)", color: "var(--color-ink)" }}>
              יצירת קשר
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-text-disabled)" }}>
              אנחנו כאן לכל שאלה או בקשה
            </p>
          </div>
          <button
            type="button"
            onClick={() => setContactOpen(false)}
            style={{ width: 32, height: 32, borderRadius: "var(--shape-radius-circle)", border: "none", background: "var(--color-app-bg)", color: "var(--color-ink)", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        {contactMethods.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: contactMethods.length === 1 ? "1fr" : "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {contactMethods.map((method) => (
              <a
                key={method.key}
                href={method.href}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 0,
                  padding: "12px 10px",
                  borderRadius: "var(--shape-radius-xl)",
                  background: method.bg,
                  color: method.color,
                  textDecoration: "none",
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-extrabold)",
                  fontSize: "var(--font-size-md)",
                }}
              >
                <method.Icon size={18} strokeWidth={2.2} />
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {method.label}
                </span>
              </a>
            ))}
          </div>
        )}

        <ContactForm />
      </div>

      <div
        style={backdropStyle(infoOpen)}
        onClick={() => {
          setSelectedInfoPage(null);
          setInfoOpen(false);
        }}
      />
      <div style={drawerStyle(infoOpen)}>
        <Handle />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-2xl)", color: "var(--color-ink)" }}>
              {selectedInfoPage ? selectedInfoPage.title : "מידע חשוב"}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-text-disabled)" }}>
              {selectedInfoPage ? "פירוט המידע" : "עמודי מידע ושירותים שימושיים"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (selectedInfoPage) {
                setSelectedInfoPage(null);
                return;
              }
              setInfoOpen(false);
            }}
            style={{ width: 32, height: 32, borderRadius: "var(--shape-radius-circle)", border: "none", background: "var(--color-app-bg)", color: "var(--color-ink)", cursor: "pointer" }}
          >
            {selectedInfoPage ? "←" : "✕"}
          </button>
        </div>

        {selectedInfoPage ? (
          <div
            style={{
              border: "1px solid color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
              borderRadius: "var(--shape-radius-2xl)",
              background: "var(--color-app-bg)",
              padding: "14px",
              maxHeight: "52dvh",
              overflowY: "auto",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: selectedInfoPage.content_html }}
              style={{
                fontFamily: "var(--font-family-sans)",
                fontSize: "var(--font-size-base)",
                fontWeight: "var(--font-weight-semibold)",
                lineHeight: 1.7,
                color: "var(--color-ink)",
              }}
            />
          </div>
        ) : importantInfoPages.length === 0 ? (
          <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-md)", color: "var(--color-text-disabled)" }}>
            אין מידע להצגה כרגע.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {importantInfoPages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setSelectedInfoPage(page)}
                  style={{
                    width: "100%",
                    border: "1px solid color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
                    borderRadius: "var(--shape-radius-xl)",
                    background: "var(--color-app-bg)",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    textAlign: "right",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ width: 36, height: 36, borderRadius: "var(--shape-radius-lg)", background: "color-mix(in srgb, var(--color-brand) 15%, transparent)", color: "var(--color-brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={18} strokeWidth={2.15} />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", marginBottom: 3, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-base)", color: "var(--color-ink)" }}>
                      {page.title}
                    </span>
                    <span style={{ display: "block", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-sm)", lineHeight: 1.35, color: "var(--color-text-disabled)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {page.subtitle}
                    </span>
                  </span>
                </button>
            ))}
          </div>
        )}
      </div>

      <div style={backdropStyle(ideaOpen)} onClick={() => setIdeaOpen(false)} />
      <div style={drawerStyle(ideaOpen)}>
        <Handle />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-2xl)", color: "var(--color-ink)" }}>
              יש לי רעיון
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-text-disabled)" }}>
              כתוב לנו רעיון לשיפור או פעילות חדשה
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIdeaOpen(false)}
            style={{ width: 32, height: 32, borderRadius: "var(--shape-radius-circle)", border: "none", background: "var(--color-app-bg)", color: "var(--color-ink)", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <IdeaForm />
      </div>
    </>
  );
}
