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
          <input name="is_active" type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "var(--color-amber-800)" }} />
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
  background: "var(--color-surface-raised)",
  border: "1px solid var(--color-border-subtle)",
  borderRadius: "var(--shape-radius-lg)",
  boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 5%, transparent)",
  padding: "20px 18px",
};
export const headingStyle: React.CSSProperties = {
  margin: "0 0 16px",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)",
  fontSize: "var(--font-size-2xl)",
  color: "var(--color-admin-ink)",
};
export const labelStyle: React.CSSProperties = {
  fontSize: "var(--font-size-md)",
  fontWeight: "var(--font-weight-semibold)",
  color: "var(--color-slate-600)",
  fontFamily: "var(--font-family-sans)",
};
export const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "var(--font-size-base)",
  fontFamily: "var(--font-family-sans)",
  border: "1px solid var(--color-text-on-dark)",
  borderRadius: "var(--shape-radius-sm)",
  background: "var(--color-surface-raised)",
  color: "var(--color-admin-ink)",
  caretColor: "var(--color-admin-ink)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
};
const errorStyle: React.CSSProperties = { margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-danger)", fontWeight: "var(--font-weight-semibold)" };
const successStyle: React.CSSProperties = { margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-success)", fontWeight: "var(--font-weight-semibold)" };
const submitStyle = (pending: boolean): React.CSSProperties => ({
  marginTop: 4,
  padding: "11px 24px",
  background: pending ? "var(--color-text-tertiary)" : "var(--color-brand-blue)",
  color: "var(--color-on-accent)",
  border: "none",
  borderRadius: "var(--shape-radius-sm)",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)",
  fontSize: "var(--font-size-lg)",
  cursor: pending ? "not-allowed" : "pointer",
});
