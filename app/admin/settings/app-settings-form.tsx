"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import { updateAppSettings, type AppSettings } from "./actions";

type State = {
  success?: boolean;
  error?: string;
};

const initialState: State = {};

export function AppSettingsForm({ settings }: { settings: AppSettings }) {
  const [state, formAction, isPending] = useActionState(async (_state: State, formData: FormData) => {
    return updateAppSettings(formData);
  }, initialState);

  return (
    <form
      action={formAction}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "#ECFDF5",
            color: "#15803D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={20} strokeWidth={2.25} />
        </span>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 950, color: "#0F172A" }}>
            מצב בדיקה
          </h2>
          <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 650, lineHeight: 1.45, color: "#64748B" }}>
            כשמסומן, האפליקציה פתוחה בלי התחברות. כשלא מסומן, משתמש לא מחובר יועבר ל-/welcome.
          </p>
        </div>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          width: "fit-content",
          borderRadius: 999,
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          padding: "9px 12px",
          fontSize: 13,
          fontWeight: 900,
          color: "#0F172A",
          cursor: "pointer",
        }}
      >
        <input
          name="test_mode"
          type="checkbox"
          defaultChecked={settings.test_mode}
          style={{ width: 18, height: 18, accentColor: "#16A34A" }}
        />
        מצב בדיקה פעיל
      </label>

      {state.error && (
        <p style={{ margin: "10px 0 0", color: "#DC2626", fontSize: 13, fontWeight: 800 }}>{state.error}</p>
      )}
      {state.success && (
        <p style={{ margin: "10px 0 0", color: "#15803D", fontSize: 13, fontWeight: 800 }}>ההגדרה נשמרה</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: "100%",
          height: 44,
          borderRadius: 14,
          border: "none",
          background: isPending ? "#94A3B8" : "#16A34A",
          color: "#fff",
          fontSize: 14,
          fontWeight: 900,
          fontFamily: "var(--font-rubik)",
          cursor: isPending ? "not-allowed" : "pointer",
          marginTop: 12,
        }}
      >
        {isPending ? "שומר..." : "שמירת מצב בדיקה"}
      </button>
    </form>
  );
}
