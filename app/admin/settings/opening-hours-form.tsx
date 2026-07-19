"use client";

import { useActionState, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getOpeningHoursWeek, updateOpeningHours, type OpeningHourWithDate } from "./actions";

type State = {
  success?: boolean;
  error?: string;
};

const initialState: State = {};

function trimSeconds(value: string | null) {
  return value ? value.slice(0, 5) : "";
}

function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: string, days: number) {
  const result = parseLocalDate(date);
  result.setDate(result.getDate() + days);
  return toDateString(result);
}

function formatShortDate(date: string) {
  const parsedDate = parseLocalDate(date);
  return parsedDate.toLocaleDateString("he-IL", { day: "numeric", month: "short" });
}

function formatWeekRange(start: string) {
  const end = addDays(start, 6);
  return `${formatShortDate(start)} - ${formatShortDate(end)}`;
}

export function OpeningHoursForm({ rows }: { rows: OpeningHourWithDate[] }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekStart, setWeekStart] = useState(rows[0]?.date ?? "");
  const [visibleRows, setVisibleRows] = useState(rows);
  const [isLoadingWeek, startWeekTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(async (_state: State, formData: FormData) => {
    return updateOpeningHours(formData);
  }, initialState);

  function updateRow(dayKey: string, patch: Partial<OpeningHourWithDate>) {
    setVisibleRows((currentRows) => currentRows.map((row) => (row.day_key === dayKey ? { ...row, ...patch } : row)));
  }

  function moveWeek(direction: -1 | 1) {
    const nextWeekStart = addDays(weekStart, direction * 7);
    setWeekOffset((current) => current + direction);
    setWeekStart(nextWeekStart);
    startWeekTransition(async () => {
      const nextRows = await getOpeningHoursWeek(nextWeekStart);
      setVisibleRows(nextRows);
    });
  }

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          background: "var(--color-surface-muted)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--shape-radius-xl)",
          padding: 10,
          marginBottom: 2,
        }}
      >
        <button
          type="button"
          onClick={() => moveWeek(-1)}
          disabled={isLoadingWeek}
          aria-label="שבוע קודם"
          style={weekButtonStyle}
        >
          <ChevronRight size={17} strokeWidth={2.4} />
        </button>
        <div style={{ minWidth: 0, textAlign: "center" }}>
          <p style={{ margin: "0 0 2px", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-dark)" }}>
            {weekOffset === 0 ? "השבוע הנוכחי" : weekOffset > 0 ? `עוד ${weekOffset} שבועות` : `לפני ${Math.abs(weekOffset)} שבועות`}
          </p>
          <p style={{ margin: 0, fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-secondary)", direction: "ltr" }}>
            {formatWeekRange(weekStart)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => moveWeek(1)}
          disabled={isLoadingWeek}
          aria-label="שבוע הבא"
          style={weekButtonStyle}
        >
          <ChevronLeft size={17} strokeWidth={2.4} />
        </button>
      </div>

      {isLoadingWeek && (
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-extrabold)" }}>טוען שבוע...</p>
      )}

      {visibleRows.map((row) => (
        <div
          key={row.date}
          style={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "var(--shape-radius-2xl)",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-dark)" }}>{row.day_label}</p>
              <p style={{ margin: "3px 0 0", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-secondary)" }}>
                {formatShortDate(row.date)} · הערה תוצג כצ׳יפ ליד היום
              </p>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)", color: "var(--color-green-700)" }}>
              <input name={`${row.day_key}_date`} type="hidden" value={row.date} />
              <input
                name={`${row.day_key}_is_open`}
                type="checkbox"
                checked={row.is_open}
                onChange={(event) => updateRow(row.day_key, { is_open: event.target.checked })}
                style={{ width: 18, height: 18, accentColor: "var(--color-success)" }}
              />
              פתוח
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-extrabold)", color: "var(--color-text-secondary)" }}>
              פתיחה
              <input
                name={`${row.day_key}_open_time`}
                type="time"
                value={trimSeconds(row.open_time)}
                onChange={(event) => updateRow(row.day_key, { open_time: event.target.value || null })}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-extrabold)", color: "var(--color-text-secondary)" }}>
              סגירה
              <input
                name={`${row.day_key}_close_time`}
                type="time"
                value={trimSeconds(row.close_time)}
                onChange={(event) => updateRow(row.day_key, { close_time: event.target.value || null })}
                style={inputStyle}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-extrabold)", color: "var(--color-text-secondary)" }}>
            הערה בצ׳יפ
            <input
              name={`${row.day_key}_note`}
              type="text"
              value={row.note ?? ""}
              onChange={(event) => updateRow(row.day_key, { note: event.target.value })}
              placeholder="לדוגמה: ראש השנה"
              style={inputStyle}
            />
          </label>
        </div>
      ))}

      {state.error && (
        <p style={{ margin: 0, color: "var(--color-danger)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>{state.error}</p>
      )}
      {state.success && (
        <p style={{ margin: 0, color: "var(--color-green-700)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>השעות נשמרו</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: "100%",
          height: 48,
          borderRadius: "var(--shape-radius-2xl)",
          border: "none",
          background: isPending ? "var(--color-text-tertiary)" : "var(--color-success)",
          color: "var(--color-surface-raised)",
          fontSize: "var(--font-size-lg)",
          fontWeight: "var(--font-weight-black)",
          fontFamily: "var(--font-family-sans)",
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
  border: "1px solid var(--color-text-on-dark)",
  borderRadius: "var(--shape-radius-lg)",
  background: "var(--color-surface-raised)",
  padding: "0 10px",
  fontFamily: "var(--font-family-sans)",
  fontSize: "var(--font-size-base)",
  fontWeight: "var(--font-weight-bold)",
  color: "var(--color-admin-dark)",
  outline: "none",
};

const weekButtonStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "var(--shape-radius-lg)",
  border: "1px solid var(--color-text-on-dark)",
  background: "var(--color-surface-raised)",
  color: "var(--color-admin-dark)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};
