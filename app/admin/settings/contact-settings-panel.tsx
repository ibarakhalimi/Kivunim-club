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
          <p style={{ margin: 0, color: "#DC2626", fontSize: 13, fontWeight: 800 }}>{state.error}</p>
        )}
        {state.success && (
          <p style={{ margin: 0, color: "#15803D", fontSize: 13, fontWeight: 800 }}>פרטי הקשר נשמרו</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 16,
            border: "none",
            background: isPending ? "#94A3B8" : "#1E40AF",
            color: "#fff",
            fontSize: 15,
            fontWeight: 900,
            fontFamily: "var(--font-rubik)",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? "שומר..." : "שמירת פרטי קשר"}
        </button>
      </form>

      <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 950, color: "#0F172A" }}>
            פניות מהאפליקציה
          </h3>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#64748B" }}>
            כל פנייה שנשלחת דרך “יצירת קשר” תופיע כאן.
          </p>
        </div>

        {inquiries.length === 0 ? (
          <p style={{ margin: 0, color: "#64748B", fontSize: 13, fontWeight: 700 }}>
            אין פניות עדיין.
          </p>
        ) : (
          inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                background: "#F8FAFC",
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 900, color: "#0F172A" }}>
                    {inquiry.user_name ?? "משתמש"}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 750, color: "#94A3B8" }}>
                    {formatDate(inquiry.created_at)}
                  </p>
                </div>
                <span style={{ borderRadius: 999, background: "#EEF2FF", color: "#4338CA", padding: "5px 8px", fontWeight: 850, fontSize: 11, flexShrink: 0 }}>
                  {inquiry.subject}
                </span>
              </div>

              {(inquiry.user_phone || inquiry.user_email) && (
                <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 750, color: "#64748B", direction: "ltr", textAlign: "right" }}>
                  {[inquiry.user_phone, inquiry.user_email].filter(Boolean).join(" · ")}
                </p>
              )}

              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.55, color: "#334155", whiteSpace: "pre-wrap" }}>
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
  fontSize: 12,
  fontWeight: 850,
  color: "#64748B",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 43,
  border: "1px solid #CBD5E1",
  borderRadius: 12,
  background: "#fff",
  padding: "0 11px",
  fontFamily: "var(--font-rubik)",
  fontSize: 14,
  fontWeight: 700,
  color: "#0F172A",
  outline: "none",
};
