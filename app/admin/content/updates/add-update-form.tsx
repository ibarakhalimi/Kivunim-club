"use client";

import { useActionState, useEffect, useRef } from "react";
import { addUpdate } from "./actions";

const initialState = { error: undefined as string | undefined, success: false };

export function AddUpdateForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await addUpdate(formData);
      return result as typeof initialState;
    },
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
  }, [state.success]);

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>הוספת עדכון חדש</h2>

      <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="טאב עליון *">
          <input name="tab_label" required maxLength={32} placeholder="לדוגמה: הטבה חדשה" style={inputStyle} />
        </Field>
        <Field label="כותרת *">
          <input name="title" required placeholder="כותרת העדכון..." style={inputStyle} />
        </Field>
        <Field label="תוכן *">
          <textarea name="description" required rows={4} placeholder="תוכן העדכון..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="לינק לכפתור">
            <input name="button_link_url" type="url" placeholder="https://..." style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
          </Field>
          <Field label="טקסט לכפתור">
            <input name="button_text" placeholder="לקריאה נוספת" style={inputStyle} />
          </Field>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input name="is_active" type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "#B45309" }} />
          <span style={labelStyle}>מוצג באפליקציה</span>
        </label>

        {state.error && <p style={errorStyle}>{state.error}</p>}
        {state.success && <p style={successStyle}>✓ העדכון נשמר בהצלחה</p>}

        <button type="submit" disabled={pending} style={submitStyle(pending)}>
          {pending ? "שומר..." : "פרסם עדכון"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  padding: "20px 18px",
};
export const headingStyle: React.CSSProperties = {
  margin: "0 0 16px",
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 18,
  color: "#0F172A",
};
export const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
  fontFamily: "var(--font-rubik)",
};
export const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "var(--font-rubik)",
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  background: "#fff",
  color: "#0F172A",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
};
const errorStyle: React.CSSProperties = { margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 600 };
const successStyle: React.CSSProperties = { margin: 0, fontSize: 13, color: "#16A34A", fontWeight: 600 };
const submitStyle = (pending: boolean): React.CSSProperties => ({
  marginTop: 4,
  padding: "11px 24px",
  background: pending ? "#94A3B8" : "#1E40AF",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 15,
  cursor: pending ? "not-allowed" : "pointer",
});
