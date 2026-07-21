"use client";

import { useActionState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { updateContactSettings, type ContactInquiry, type ContactSettings } from "./actions";

type State = {
  success?: boolean;
  error?: string;
};

const initialState: State = {};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ContactSettingsPanel({
  settings,
  inquiries,
}: {
  settings: ContactSettings;
  inquiries: ContactInquiry[];
}) {
  const [state, formAction, isPending] = useActionState(async (_state: State, formData: FormData) => {
    return updateContactSettings(formData);
  }, initialState);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={fieldWrapStyle}>
          <span style={labelStyle}>
            <Phone size={15} strokeWidth={2.2} />
            מס׳ נייד
          </span>
          <input
            name="mobile_phone"
            type="tel"
            defaultValue={settings.mobile_phone ?? ""}
            placeholder="לדוגמה: 050-0000000"
            style={inputStyle}
          />
        </label>

        <label style={fieldWrapStyle}>
          <span style={labelStyle}>
            <MessageCircle size={15} strokeWidth={2.2} />
            וואטסאפ
          </span>
          <input
            name="whatsapp"
            type="text"
            defaultValue={settings.whatsapp ?? ""}
            placeholder="מספר או קישור וואטסאפ"
            style={inputStyle}
          />
        </label>

        <label style={fieldWrapStyle}>
          <span style={labelStyle}>
            <Mail size={15} strokeWidth={2.2} />
            מייל
          </span>
          <input
            name="email"
            type="email"
            defaultValue={settings.email ?? ""}
            placeholder="office@example.com"
            style={inputStyle}
          />
        </label>

        {state.error && (
          <p style={{ margin: 0, color: "var(--color-danger)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>{state.error}</p>
        )}
        {state.success && (
          <p style={{ margin: 0, color: "var(--color-green-700)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>פרטי הקשר נשמרו</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{
            width: "100%",
            height: 48,
            borderRadius: "var(--shape-radius-2xl)",
            border: "none",
            background: isPending ? "var(--color-text-tertiary)" : "var(--color-brand-blue)",
            color: "var(--color-on-accent)",
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-black)",
            fontFamily: "var(--font-family-sans)",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? "שומר..." : "שמירת פרטי קשר"}
        </button>
      </form>

      <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-ink)" }}>
            פניות מהאפליקציה
          </h3>
          <p style={{ margin: 0, fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-secondary)" }}>
            כל פנייה שנשלחת דרך “יצירת קשר” תופיע כאן.
          </p>
        </div>

        {inquiries.length === 0 ? (
          <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-bold)" }}>
            אין פניות עדיין.
          </p>
        ) : (
          inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              style={{
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "var(--shape-radius-xl)",
                background: "var(--color-surface-muted)",
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-ink)" }}>
                    {inquiry.user_name ?? "משתמש"}
                  </p>
                  <p style={{ margin: 0, fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-tertiary)" }}>
                    {formatDate(inquiry.created_at)}
                  </p>
                </div>
                <span style={{ borderRadius: "var(--shape-radius-pill)", background: "var(--color-indigo-50)", color: "var(--color-indigo-700)", padding: "5px 8px", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-xs)", flexShrink: 0 }}>
                  {inquiry.subject}
                </span>
              </div>

              {(inquiry.user_phone || inquiry.user_email) && (
                <p style={{ margin: "0 0 8px", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-secondary)", direction: "ltr", textAlign: "right" }}>
                  {[inquiry.user_phone, inquiry.user_email].filter(Boolean).join(" · ")}
                </p>
              )}

              <p style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", lineHeight: 1.55, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>
                {inquiry.message}
              </p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

const fieldWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: "var(--font-size-sm)",
  fontWeight: "var(--font-weight-extrabold)",
  color: "var(--color-text-secondary)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 43,
  border: "1px solid var(--color-text-on-dark)",
  borderRadius: "var(--shape-radius-lg)",
  background: "var(--color-surface-raised)",
  padding: "0 11px",
  fontFamily: "var(--font-family-sans)",
  fontSize: "var(--font-size-base)",
  fontWeight: "var(--font-weight-bold)",
  color: "var(--color-admin-ink)",
  outline: "none",
};
