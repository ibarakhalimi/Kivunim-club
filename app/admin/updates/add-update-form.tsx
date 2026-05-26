"use client";

import { useActionState, useRef } from "react";
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

  if (state.success && formRef.current) {
    formRef.current.reset();
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #0F0F0F",
        borderRadius: 0,
        boxShadow: "4px 4px 0 0 #0F0F0F",
        padding: "20px 18px",
      }}
    >
      <h2
        style={{
          margin: "0 0 18px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 20,
          color: "var(--color-text-primary)",
        }}
      >
        + הוסף עדכון חדש
      </h2>

      <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={labelStyle}>כותרת *</label>
          <input
            name="title"
            required
            placeholder="כותרת העדכון..."
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={labelStyle}>תוכן *</label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="תוכן העדכון..."
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        {/* Author */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={labelStyle}>מאת</label>
          <input
            name="author"
            placeholder="צוות כיוונים"
            style={inputStyle}
          />
        </div>

        {/* Feedback */}
        {state.error && (
          <p style={{ margin: 0, fontSize: 14, color: "#e53e3e", fontWeight: 600 }}>
            {state.error}
          </p>
        )}
        {state.success && (
          <p style={{ margin: 0, fontSize: 14, color: "#276749", fontWeight: 600 }}>
            ✓ העדכון נשמר בהצלחה
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          style={{
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
            transition: "box-shadow 0.1s",
          }}
        >
          {pending ? "שומר..." : "פרסם עדכון"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-heebo)",
};

const inputStyle: React.CSSProperties = {
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
