"use client";

import { useActionState, useRef, useState } from "react";
import { addEvent } from "./actions";

const init = { error: undefined as string | undefined, success: false };

export function AddEventForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof init, fd: FormData) => (await addEvent(fd)) as typeof init,
    init
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  if (state.success) {
    formRef.current?.reset();
    if (preview) setPreview(null);
  }

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>+ הוסף אירוע חדש</h2>
      <form ref={formRef} action={formAction} style={formStyle} encType="multipart/form-data">
        <Field label="כותרת *">
          <input name="title" required placeholder="שם האירוע..." style={inputStyle} />
        </Field>
        <Field label="תוכן *">
          <textarea name="description" required rows={3} placeholder="תיאור האירוע..." style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="תאריך *">
            <input name="event_date" type="date" required style={inputStyle} />
          </Field>
          <Field label="שעת התחלה *">
            <input name="start_hour" type="time" required style={inputStyle} />
          </Field>
        </div>
        <Field label="מיקום *">
          <input name="location" required placeholder="כתובת / שם המקום..." style={inputStyle} />
        </Field>

        <Field label="קישור להרשמה">
          <input name="registration_url" type="url" placeholder="https://..." style={inputStyle} />
        </Field>

        <Field label="תמונה">
          <ImagePicker name="image" preview={preview} onPreview={setPreview} />
        </Field>

        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input name="is_featured" type="checkbox" style={{ width: 18, height: 18, cursor: "pointer" }} />
          <span style={labelStyle}>מוצג בראש הדף (Featured)</span>
        </label>

        {state.error && <p style={errorStyle}>{state.error}</p>}
        {state.success && <p style={successStyle}>✓ האירוע נשמר בהצלחה</p>}

        <button type="submit" disabled={pending} style={submitStyle(pending)}>
          {pending ? "שומר..." : "פרסם אירוע"}
        </button>
      </form>
    </div>
  );
}

export function ImagePicker({
  name,
  preview,
  onPreview,
  currentUrl,
}: {
  name: string;
  preview: string | null;
  onPreview: (url: string | null) => void;
  currentUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayed = preview ?? currentUrl ?? null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { onPreview(null); return; }
    const url = URL.createObjectURL(file);
    onPreview(url);
  }

  return (
    <div>
      <input
        ref={inputRef}
        name={name}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {displayed ? (
        <div style={{ position: "relative", width: "100%", height: 160, border: "2px solid #0F0F0F" }}>
          <img src={displayed} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button
            type="button"
            onClick={() => { onPreview(null); if (inputRef.current) inputRef.current.value = ""; }}
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              width: 28,
              height: 28,
              background: "#0F0F0F",
              color: "#fff",
              border: "none",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              padding: "4px 10px",
              background: "#0F0F0F",
              color: "#fff",
              border: "none",
              fontSize: 12,
              fontFamily: "var(--font-heebo)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            החלף
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            padding: "28px 0",
            border: "2px dashed #0F0F0F",
            background: "#FAFAFA",
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "var(--font-heebo)",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 28 }}>📷</span>
          לחץ להעלאת תמונה
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

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "2px solid #0F0F0F",
  borderRadius: 0,
  boxShadow: "4px 4px 0 0 #0F0F0F",
  padding: "20px 18px",
};
const headingStyle: React.CSSProperties = {
  margin: "0 0 18px",
  fontFamily: "var(--font-rubik)",
  fontWeight: 800,
  fontSize: 20,
  color: "var(--color-text-primary)",
};
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
export const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-heebo)",
};
export const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 15,
  fontFamily: "var(--font-heebo)",
  border: "2px solid #0F0F0F",
  borderRadius: 0,
  background: "#FAFAFA",
  color: "var(--color-text-primary)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
};
const errorStyle: React.CSSProperties = { margin: 0, fontSize: 14, color: "#e53e3e", fontWeight: 600 };
const successStyle: React.CSSProperties = { margin: 0, fontSize: 14, color: "#276749", fontWeight: 600 };
const submitStyle = (pending: boolean): React.CSSProperties => ({
  marginTop: 4,
  padding: "12px 24px",
  background: pending ? "#ccc" : "#0F0F0F",
  color: "#fff",
  border: "2px solid #0F0F0F",
  borderRadius: 0,
  boxShadow: pending ? "none" : "3px 3px 0 0 #555",
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 16,
  cursor: pending ? "not-allowed" : "pointer",
});
