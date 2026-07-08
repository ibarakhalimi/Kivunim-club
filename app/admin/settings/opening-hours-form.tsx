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
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
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
          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 950, color: "#0F172A" }}>
            {weekOffset === 0 ? "השבוע הנוכחי" : weekOffset > 0 ? `עוד ${weekOffset} שבועות` : `לפני ${Math.abs(weekOffset)} שבועות`}
          </p>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 750, color: "#64748B", direction: "ltr" }}>
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
        <p style={{ margin: 0, color: "#64748B", fontSize: 12, fontWeight: 800 }}>טוען שבוע...</p>
      )}

      {visibleRows.map((row) => (
        <div
          key={row.date}
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
                {formatShortDate(row.date)} · הערה תוצג כצ׳יפ ליד היום
              </p>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 800, color: "#15803D" }}>
              <input name={`${row.day_key}_date`} type="hidden" value={row.date} />
              <input
                name={`${row.day_key}_is_open`}
                type="checkbox"
                checked={row.is_open}
                onChange={(event) => updateRow(row.day_key, { is_open: event.target.checked })}
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
                value={trimSeconds(row.open_time)}
                onChange={(event) => updateRow(row.day_key, { open_time: event.target.value || null })}
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 800, color: "#64748B" }}>
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

          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 800, color: "#64748B" }}>
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

const weekButtonStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};
