"use client";

import { useActionState } from "react";
import { updateOpeningHours } from "./actions";

type OpeningHour = {
  day_key: string;
  day_label: string;
  sort_order: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  note: string | null;
};

type State = {
  success?: boolean;
  error?: string;
};

const initialState: State = {};

function trimSeconds(value: string | null) {
  return value ? value.slice(0, 5) : "";
}

export function OpeningHoursForm({ rows }: { rows: OpeningHour[] }) {
  const [state, formAction, isPending] = useActionState(async (_state: State, formData: FormData) => {
    return updateOpeningHours(formData);
  }, initialState);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((row) => (
        <div
          key={row.day_key}
          style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#0F172A" }}>{row.day_label}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, fontWeight: 700, color: "#64748B" }}>
                הערה תוצג כצ׳יפ ליד היום
              </p>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 800, color: "#15803D" }}>
              <input
                name={`${row.day_key}_is_open`}
                type="checkbox"
                defaultChecked={row.is_open}
                style={{ width: 18, height: 18, accentColor: "#16A34A" }}
              />
              פתוח
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 800, color: "#64748B" }}>
              פתיחה
              <input
                name={`${row.day_key}_open_time`}
                type="time"
                defaultValue={trimSeconds(row.open_time)}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 800, color: "#64748B" }}>
              סגירה
              <input
                name={`${row.day_key}_close_time`}
                type="time"
                defaultValue={trimSeconds(row.close_time)}
                style={inputStyle}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 800, color: "#64748B" }}>
            הערה בצ׳יפ
            <input
              name={`${row.day_key}_note`}
              type="text"
              defaultValue={row.note ?? ""}
              placeholder="לדוגמה: ראש השנה"
              style={inputStyle}
            />
          </label>
        </div>
      ))}

      {state.error && (
        <p style={{ margin: 0, color: "#DC2626", fontSize: 13, fontWeight: 800 }}>{state.error}</p>
      )}
      {state.success && (
        <p style={{ margin: 0, color: "#15803D", fontSize: 13, fontWeight: 800 }}>השעות נשמרו</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: "100%",
          height: 48,
          borderRadius: 16,
          border: "none",
          background: isPending ? "#94A3B8" : "#16A34A",
          color: "#fff",
          fontSize: 15,
          fontWeight: 900,
          fontFamily: "var(--font-rubik)",
          cursor: isPending ? "not-allowed" : "pointer",
        }}
      >
        {isPending ? "שומר..." : "שמירת שעות פתיחה"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 40,
  border: "1px solid #CBD5E1",
  borderRadius: 12,
  background: "#fff",
  padding: "0 10px",
  fontFamily: "var(--font-rubik)",
  fontSize: 14,
  fontWeight: 700,
  color: "#0F172A",
  outline: "none",
};
