"use client";

import { useState, useActionState } from "react";
import type { Tables } from "@/src/types/database";
import { updateEvent, toggleFeatured, deleteEvent } from "./actions";
import { ImagePicker, labelStyle, inputStyle } from "./add-event-form";

type Event = Tables<"events">;

const init = { error: undefined as string | undefined, success: false };

function EditForm({ event, onDone }: { event: Event; onDone: () => void }) {
  const action = async (_prev: typeof init, fd: FormData) =>
    (await updateEvent(event.id, fd)) as typeof init;
  const [state, formAction, pending] = useActionState(action, init);
  const [preview, setPreview] = useState<string | null>(null);
  if (state.success) onDone();

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid #E2E8F0" }}
    >
      <input type="hidden" name="existing_image_url" value={event.image_url ?? ""} />

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>כותרת *</label>
        <input name="title" required defaultValue={event.title} style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תוכן *</label>
        <textarea name="description" required rows={3} defaultValue={event.description} style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>תאריך *</label>
          <input name="event_date" type="date" required defaultValue={event.event_date} style={inputStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>שעה *</label>
          <input name="start_hour" type="time" required defaultValue={event.start_hour} style={inputStyle} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>מיקום *</label>
        <input name="location" required defaultValue={event.location} style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>קישור להרשמה</label>
        <input name="registration_url" type="url" defaultValue={event.registration_url ?? ""} placeholder="https://..." style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תמונה</label>
        <ImagePicker name="image" preview={preview} onPreview={setPreview} currentUrl={event.image_url} />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input name="is_featured" type="checkbox" defaultChecked={event.is_featured} style={{ width: 16, height: 16, accentColor: "#1E40AF" }} />
        <span style={labelStyle}>מוצג בראש הדף</span>
      </label>

      {state.error && <p style={{ margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{state.error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" disabled={pending} style={btnPrimary(pending)}>
          {pending ? "שומר..." : "שמור"}
        </button>
        <button type="button" onClick={onDone} style={btnGhost}>ביטול</button>
      </div>
    </form>
  );
}

function EventRow({ event }: { event: Event }) {
  const [editing, setEditing] = useState(false);
  const [featuring, setFeaturing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle() {
    setFeaturing(true);
    await toggleFeatured(event.id, event.is_featured);
    setFeaturing(false);
  }

  async function handleDelete() {
    if (!confirm("למחוק את האירוע?")) return;
    setDeleting(true);
    await deleteEvent(event.id);
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: "1px solid #E2E8F0", flexShrink: 0 }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
                {event.title}
              </p>
              {event.is_featured && (
                <span style={{ fontSize: 11, fontWeight: 600, background: "#EFF6FF", color: "#1E40AF", border: "1px solid #BFDBFE", padding: "2px 8px", borderRadius: 99 }}>
                  מוצג
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#64748B", fontFamily: "var(--font-rubik)", fontWeight: 500 }}>
              {event.event_date} · {event.start_hour} · {event.location}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={handleToggle}
            disabled={featuring}
            title={event.is_featured ? "הסר מ-Featured" : "הוסף ל-Featured"}
            style={{ ...iconBtn, background: event.is_featured ? "#EFF6FF" : "#F8FAFC", color: event.is_featured ? "#1E40AF" : "#94A3B8" }}
          >
            ★
          </button>
          <button onClick={() => setEditing((v) => !v)} style={iconBtn} title="עריכה">✏️</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...iconBtn, color: "#DC2626" }} title="מחיקה">
            {deleting ? "…" : "🗑"}
          </button>
        </div>
      </div>

      {editing && <EditForm event={event} onDone={() => setEditing(false)} />}
    </div>
  );
}

export function EventList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p style={{ color: "#64748B", fontSize: 14, fontFamily: "var(--font-rubik)" }}>אין אירועים עדיין.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {events.map((ev) => <EventRow key={ev.id} event={ev} />)}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, border: "1px solid #E2E8F0", borderRadius: 8,
  background: "#F8FAFC", cursor: "pointer", fontSize: 14, display: "flex",
  alignItems: "center", justifyContent: "center", flexShrink: 0,
};
const btnPrimary = (pending: boolean): React.CSSProperties => ({
  padding: "9px 20px", background: pending ? "#94A3B8" : "#1E40AF", color: "#fff",
  border: "none", borderRadius: 8, fontFamily: "var(--font-rubik)",
  fontWeight: 700, fontSize: 14, cursor: pending ? "not-allowed" : "pointer",
});
const btnGhost: React.CSSProperties = {
  padding: "9px 20px", background: "#fff", color: "#475569",
  border: "1px solid #E2E8F0", borderRadius: 8, fontFamily: "var(--font-rubik)",
  fontWeight: 600, fontSize: 14, cursor: "pointer",
};
