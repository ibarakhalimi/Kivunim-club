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
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--shape-radius-2xl)",
        padding: 16,
        boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: "var(--shape-radius-lg)",
            background: "var(--color-emerald-50)",
            color: "var(--color-green-700)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={20} strokeWidth={2.25} />
        </span>
        <div>
          <h2 style={{ margin: 0, fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-dark)" }}>
            מצב בדיקה
          </h2>
          <p style={{ margin: "3px 0 0", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
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
          borderRadius: "var(--shape-radius-pill)",
          background: "var(--color-surface-muted)",
          border: "1px solid var(--color-border-subtle)",
          padding: "9px 12px",
          fontSize: "var(--font-size-md)",
          fontWeight: "var(--font-weight-black)",
          color: "var(--color-admin-dark)",
          cursor: "pointer",
        }}
      >
        <input
          name="test_mode"
          type="checkbox"
          defaultChecked={settings.test_mode}
          style={{ width: 18, height: 18, accentColor: "var(--color-success)" }}
        />
        מצב בדיקה פעיל
      </label>

      {state.error && (
        <p style={{ margin: "10px 0 0", color: "var(--color-danger)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>{state.error}</p>
      )}
      {state.success && (
        <p style={{ margin: "10px 0 0", color: "var(--color-green-700)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>ההגדרה נשמרה</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: "100%",
          height: 44,
          borderRadius: "var(--shape-radius-xl)",
          border: "none",
          background: isPending ? "var(--color-text-tertiary)" : "var(--color-success)",
          color: "var(--color-surface-raised)",
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-weight-black)",
          fontFamily: "var(--font-family-sans)",
          cursor: isPending ? "not-allowed" : "pointer",
          marginTop: 12,
        }}
      >
        {isPending ? "שומר..." : "שמירת מצב בדיקה"}
      </button>
    </form>
  );
}
