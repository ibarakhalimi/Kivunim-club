"use client";

import { useActionState, useRef, useState } from "react";
import { addBenefit } from "./actions";

const init = { error: undefined as string | undefined, success: false };

const CATEGORIES = ["בריאות", "כושר", "מסעדות"];

export function AddBenefitForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof init, fd: FormData) => (await addBenefit(fd)) as typeof init,
    init
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  if (state.success) { formRef.current?.reset(); if (preview) setPreview(null); }

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>הוספת הטבה חדשה</h2>
      <form ref={formRef} action={formAction} style={formStyle} encType="multipart/form-data">
        <Field label="שם העסק *">
          <input name="business" required placeholder="שם העסק..." style={inputStyle} />
        </Field>
        <Field label="תיאור העסק">
          <textarea name="business_description" rows={2} placeholder="מי העסק, מה הוא מציע..." style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="קטגוריה *">
            <select name="category" required style={inputStyle}>
              <option value="">בחר קטגוריה...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="הטבה *">
            <input name="deal" required placeholder='20% הנחה / 2+1...' style={inputStyle} />
          </Field>
        </div>
        <Field label="תיאור ההטבה *">
          <textarea name="description" required rows={3} placeholder="פרטי ההטבה..." style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <Field label="כתובת">
          <input name="location" placeholder="רחוב, עיר..." style={inputStyle} />
        </Field>
        <Field label="תוקף ההטבה">
          <input name="expires_at" type="date" style={inputStyle} />
        </Field>
        <Field label="לוגו / תמונה">
          <ImagePicker name="image" preview={preview} onPreview={setPreview} />
        </Field>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input name="is_active" type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "#1E40AF" }} />
          <span style={labelStyle}>פעיל (מוצג לחברים)</span>
        </label>

        {state.error && <p style={errorStyle}>{state.error}</p>}
        {state.success && <p style={successStyle}>✓ ההטבה נשמרה בהצלחה</p>}

        <button type="submit" disabled={pending} style={submitStyle(pending)}>
          {pending ? "שומר..." : "הוסף הטבה"}
        </button>
      </form>
    </div>
  );
}

export function ImagePicker({
  name, preview, onPreview, currentUrl,
}: {
  name: string; preview: string | null; onPreview: (u: string | null) => void; currentUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayed = preview ?? currentUrl ?? null;

  return (
    <div>
      <input ref={inputRef} name={name} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          onPreview(f ? URL.createObjectURL(f) : null);
        }}
      />
      {displayed ? (
        <div style={{ position: "relative", width: 80, height: 80, borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0" }}>
          <img src={displayed} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button type="button" onClick={() => { onPreview(null); if (inputRef.current) inputRef.current.value = ""; }}
            style={{ position: "absolute", top: 3, left: 3, width: 22, height: 22, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{ position: "absolute", bottom: 3, left: 3, padding: "2px 6px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 99, fontSize: 10, fontFamily: "var(--font-rubik)", fontWeight: 600, cursor: "pointer" }}>
            החלף
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          style={{ padding: "12px 20px", border: "1.5px dashed #CBD5E1", background: "#F8FAFC", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "var(--font-rubik)", fontWeight: 600, color: "#64748B", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📷</span> העלה לוגו / תמונה
        </button>
      )}
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
export const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
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
const submitStyle = (p: boolean): React.CSSProperties => ({
  marginTop: 4,
  padding: "11px 24px",
  background: p ? "#94A3B8" : "#1E40AF",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 15,
  cursor: p ? "not-allowed" : "pointer",
});
