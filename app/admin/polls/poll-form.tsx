"use client";

import { useActionState, useRef } from "react";
import { addPoll } from "./actions";

const init = { error: undefined as string | undefined, success: false };

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

export function PollForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof init, fd: FormData) => (await addPoll(fd)) as typeof init,
    init
  );
  if (state.success) formRef.current?.reset();

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "20px 18px" }}>
      <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#0F172A" }}>
        הוספת סקר חדש
      </h2>
      <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>שאלה *</label>
          <input name="question" required placeholder="מה השאלה?" style={inputStyle} />
        </div>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>אפשרות {n} *</label>
            <input name={`option_${n}`} required placeholder={`אפשרות ${n}...`} style={inputStyle} />
          </div>
        ))}

        {state.error && <p style={{ margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{state.error}</p>}
        {state.success && <p style={{ margin: 0, fontSize: 13, color: "#16A34A", fontWeight: 600 }}>✓ הסקר נשמר</p>}

        <button type="submit" disabled={pending} style={{
          marginTop: 4, padding: "11px 24px",
          background: pending ? "#94A3B8" : "#1E40AF", color: "#fff",
          border: "none", borderRadius: 8,
          fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15,
          cursor: pending ? "not-allowed" : "pointer",
        }}>
          {pending ? "שומר..." : "פרסם סקר"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
  fontFamily: "var(--font-rubik)",
};
