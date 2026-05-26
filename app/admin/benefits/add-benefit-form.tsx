"use client";

import { useActionState, useRef, useState } from "react";
import { addBenefit } from "./actions";

const init = { error: undefined as string | undefined, success: false };

const BG_OPTIONS = [
  { label: "אפרסק", value: "var(--color-card-peach)" },
  { label: "לבנדר", value: "var(--color-card-lavender)" },
  { label: "נענע", value: "var(--color-card-mint)" },
  { label: "תכלת", value: "var(--color-card-sky)" },
  { label: "חמאה", value: "var(--color-card-butter)" },
  { label: "ליים", value: "var(--color-card-lime)" },
];

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
      <h2 style={headingStyle}>+ הוסף הטבה חדשה</h2>
      <form ref={formRef} action={formAction} style={formStyle} encType="multipart/form-data">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="שם העסק *">
            <input name="business" required placeholder="שם העסק..." style={inputStyle} />
          </Field>
          <Field label="קטגוריה *">
            <input name="category" required placeholder="מזון, בידור..." style={inputStyle} />
          </Field>
        </div>
        <Field label="הטבה *">
          <input name="deal" required placeholder='20% הנחה / 2+1...' style={inputStyle} />
        </Field>
        <Field label="תיאור *">
          <textarea name="description" required rows={3} placeholder="פרטי ההטבה..." style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="צבע רקע">
            <select name="bg_color" style={inputStyle}>
              {BG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="סדר תצוגה">
            <input name="sort_order" type="number" defaultValue={0} min={0} style={inputStyle} />
          </Field>
        </div>
        <Field label="לוגו / תמונה">
          <ImagePicker name="image" preview={preview} onPreview={setPreview} />
        </Field>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input name="is_active" type="checkbox" defaultChecked style={{ width: 18, height: 18 }} />
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
        <div style={{ position: "relative", width: 80, height: 80, border: "2px solid #0F0F0F" }}>
          <img src={displayed} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button type="button" onClick={() => { onPreview(null); if (inputRef.current) inputRef.current.value = ""; }}
            style={{ position: "absolute", top: 2, left: 2, width: 22, height: 22, background: "#0F0F0F", color: "#fff", border: "none", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{ position: "absolute", bottom: 2, left: 2, padding: "2px 6px", background: "#0F0F0F", color: "#fff", border: "none", fontSize: 10, fontFamily: "var(--font-heebo)", fontWeight: 600, cursor: "pointer" }}>
            החלף
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          style={{ padding: "12px 20px", border: "2px dashed #0F0F0F", background: "#FAFAFA", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-heebo)", fontWeight: 600, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
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

const cardStyle: React.CSSProperties = { background: "#fff", border: "2px solid #0F0F0F", borderRadius: 0, boxShadow: "4px 4px 0 0 #0F0F0F", padding: "20px 18px" };
const headingStyle: React.CSSProperties = { margin: "0 0 18px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 20, color: "var(--color-text-primary)" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
export const labelStyle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "var(--font-heebo)" };
export const inputStyle: React.CSSProperties = { padding: "10px 12px", fontSize: 15, fontFamily: "var(--font-heebo)", border: "2px solid #0F0F0F", borderRadius: 0, background: "#FAFAFA", color: "var(--color-text-primary)", outline: "none", width: "100%", boxSizing: "border-box", direction: "rtl" };
const errorStyle: React.CSSProperties = { margin: 0, fontSize: 14, color: "#e53e3e", fontWeight: 600 };
const successStyle: React.CSSProperties = { margin: 0, fontSize: 14, color: "#276749", fontWeight: 600 };
const submitStyle = (p: boolean): React.CSSProperties => ({ marginTop: 4, padding: "12px 24px", background: p ? "#ccc" : "#0F0F0F", color: "#fff", border: "2px solid #0F0F0F", borderRadius: 0, boxShadow: p ? "none" : "3px 3px 0 0 #555", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, cursor: p ? "not-allowed" : "pointer" });
