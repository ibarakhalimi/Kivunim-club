"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
  const [optionCount, setOptionCount] = useState(2);
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof init, fd: FormData) => (await addPoll(fd)) as typeof init,
    init
  );

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
  }, [state.success]);

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
        {[1, 2, 3, 4].slice(0, optionCount).map((n) => (
          <div key={n} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>אפשרות {n}{n <= 2 ? " *" : ""}</label>
            <input name={`option_${n}`} required={n <= 2} placeholder={`אפשרות ${n}...`} style={inputStyle} />
          </div>
        ))}
        {optionCount < 4 && (
          <button
            type="button"
            onClick={() => setOptionCount((current) => Math.min(current + 1, 4))}
            style={{
              alignSelf: "flex-start",
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
              color: "#475569",
              borderRadius: 999,
              padding: "8px 12px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + הוספת אופציה
          </button>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>תאריך אחרון למענה</label>
          <input name="expires_at" type="date" style={inputStyle} />
        </div>

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
