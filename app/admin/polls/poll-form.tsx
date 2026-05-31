"use client";

import { useActionState, useRef } from "react";
import { addPoll } from "./actions";

const init = { error: undefined as string | undefined, success: false };

const inputStyle: React.CSSProperties = {
  padding: "10px 12px", fontSize: 15, fontFamily: "var(--font-heebo)",
  border: "2px solid #0F0F0F", borderRadius: 0, background: "#FAFAFA",
  color: "var(--color-text-primary)", outline: "none", width: "100%",
  boxSizing: "border-box", direction: "rtl",
};

export function PollForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof init, fd: FormData) => (await addPoll(fd)) as typeof init,
    init
  );
  if (state.success) formRef.current?.reset();

  return (
    <div style={{ background: "#fff", border: "2px solid #0F0F0F", padding: "20px 18px", boxShadow: "4px 4px 0 0 #0F0F0F" }}>
      <h2 style={{ margin: "0 0 18px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 20 }}>+ סקר חדש</h2>
      <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-heebo)" }}>שאלה *</label>
          <input name="question" required placeholder="מה השאלה?" style={inputStyle} />
        </div>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-heebo)" }}>אפשרות {n} *</label>
            <input name={`option_${n}`} required placeholder={`אפשרות ${n}...`} style={inputStyle} />
          </div>
        ))}

        {state.error && <p style={{ margin: 0, fontSize: 14, color: "#e53e3e", fontWeight: 600 }}>{state.error}</p>}
        {state.success && <p style={{ margin: 0, fontSize: 14, color: "#276749", fontWeight: 600 }}>✓ הסקר נשמר</p>}

        <button type="submit" disabled={pending} style={{
          marginTop: 4, padding: "12px 24px",
          background: pending ? "#ccc" : "#0F0F0F", color: "#fff",
          border: "2px solid #0F0F0F", borderRadius: 0,
          boxShadow: pending ? "none" : "3px 3px 0 0 #555",
          fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16,
          cursor: pending ? "not-allowed" : "pointer",
        }}>
          {pending ? "שומר..." : "פרסם סקר"}
        </button>
      </form>
    </div>
  );
}
