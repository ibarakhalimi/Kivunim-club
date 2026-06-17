"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addPost } from "./actions";

const initialState = { error: undefined as string | undefined, success: false };

export function AddPostForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await addPost(formData);
      return result as typeof initialState;
    },
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [postType, setPostType] = useState<"link" | "text_link">("link");

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
  }, [state.success]);

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>הוספת פוסט לסליידר</h2>

      <form ref={formRef} action={formAction} style={formStyle}>
        <Field label="סוג פוסט">
          <select
            name="post_type"
            value={postType}
            onChange={(event) => setPostType(event.target.value === "text_link" ? "text_link" : "link")}
            style={inputStyle}
          >
            <option value="link">פוסט עם לינק</option>
            <option value="text_link">פוסט עם טקסט ולינק</option>
          </select>
        </Field>

        <Field label="תמונת רקע">
          <ImagePicker preview={preview} onPreview={setPreview} />
        </Field>

        <Field label="כותרת *">
          <input name="title" required placeholder="כותרת שתופיע על הכרטיס..." style={inputStyle} />
        </Field>

        {postType === "text_link" && (
          <Field label="טקסט ארוך">
            <textarea name="body_text" rows={5} placeholder="תוכן מלא שיופיע בבוטום שיט..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
          </Field>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="לינק מקשר">
            <input name="link_url" type="url" placeholder="https://..." style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
          </Field>
          <Field label="טקסט כפתור">
            <input name="button_text" placeholder="לפרטים נוספים" style={inputStyle} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div />
          <Field label="סדר הצגה">
            <input name="sort_order" type="number" defaultValue={0} style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
          </Field>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input name="is_active" type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "#1E40AF" }} />
          <span style={labelStyle}>פעיל בסליידר</span>
        </label>

        {state.error && <p style={errorStyle}>{state.error}</p>}
        {state.success && <p style={successStyle}>✓ הפוסט נשמר בהצלחה</p>}

        <button type="submit" disabled={pending} style={submitStyle(pending)}>
          {pending ? "שומר..." : "הוסף פוסט"}
        </button>
      </form>
    </div>
  );
}

function ImagePicker({ preview, onPreview }: { preview: string | null; onPreview: (url: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={inputRef}
        name="background_image"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          onPreview(file ? URL.createObjectURL(file) : null);
        }}
      />

      {preview ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1.82 / 1",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #E2E8F0",
            background: `url(${preview}) center / cover`,
          }}
        >
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{ position: "absolute", bottom: 10, left: 10, padding: "7px 12px", background: "rgba(15,23,42,0.78)", color: "#fff", border: "none", borderRadius: 999, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
          >
            החלף תמונה
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ width: "100%", aspectRatio: "1.82 / 1", border: "1.5px dashed #CBD5E1", background: "#F8FAFC", borderRadius: 12, cursor: "pointer", fontSize: 14, fontFamily: "var(--font-rubik)", fontWeight: 700, color: "#64748B" }}
        >
          העלה תמונת רקע
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
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  padding: "20px 18px",
};
const headingStyle: React.CSSProperties = {
  margin: "0 0 16px",
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 18,
  color: "#0F172A",
};
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
  fontFamily: "var(--font-rubik)",
};
const inputStyle: React.CSSProperties = {
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
