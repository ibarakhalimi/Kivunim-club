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
      style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "2px solid #E0E0E0" }}
    >
      {/* carry existing URL so action can fall back to it if no new file */}
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
        <input name="is_featured" type="checkbox" defaultChecked={event.is_featured} style={{ width: 18, height: 18 }} />
        <span style={labelStyle}>Featured</span>
      </label>

      {state.error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", fontWeight: 600 }}>{state.error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" disabled={pending} style={btnDark(pending)}>
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
    <div style={{ background: "#fff", border: "2px solid #0F0F0F", borderRadius: 0, boxShadow: "4px 4px 0 0 #0F0F0F", padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        {/* Thumbnail + info */}
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              style={{ width: 56, height: 56, objectFit: "cover", border: "2px solid #0F0F0F", flexShrink: 0 }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 16, color: "var(--color-text-primary)" }}>
                {event.title}
              </p>
              {event.is_featured && (
                <span style={{ fontSize: 11, fontWeight: 700, background: "#0F0F0F", color: "#fff", padding: "2px 7px", letterSpacing: "0.04em" }}>
                  FEATURED
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-heebo)", fontWeight: 500 }}>
              {event.event_date} · {event.start_hour} · {event.location}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={handleToggle}
            disabled={featuring}
            title={event.is_featured ? "הסר מ-Featured" : "הוסף ל-Featured"}
            style={{ ...iconBtn, background: event.is_featured ? "#0F0F0F" : "#fff", color: event.is_featured ? "#fff" : "#0F0F0F" }}
          >
            ★
          </button>
          <button onClick={() => setEditing((v) => !v)} style={iconBtn} title="עריכה">✏️</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...iconBtn, color: "#c53030" }} title="מחיקה">
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
    return <p style={{ color: "var(--color-text-muted)", fontSize: 14, fontFamily: "var(--font-heebo)" }}>אין אירועים עדיין.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {events.map((ev) => <EventRow key={ev.id} event={ev} />)}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 34, height: 34, border: "2px solid #0F0F0F", borderRadius: 0,
  background: "#fff", cursor: "pointer", fontSize: 15, display: "flex",
  alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heebo)",
  fontWeight: 700, flexShrink: 0,
};
const btnDark = (pending: boolean): React.CSSProperties => ({
  padding: "9px 20px", background: pending ? "#ccc" : "#0F0F0F", color: "#fff",
  border: "2px solid #0F0F0F", borderRadius: 0, fontFamily: "var(--font-rubik)",
  fontWeight: 700, fontSize: 14, cursor: pending ? "not-allowed" : "pointer",
});
const btnGhost: React.CSSProperties = {
  padding: "9px 20px", background: "#fff", color: "#0F0F0F",
  border: "2px solid #0F0F0F", borderRadius: 0, fontFamily: "var(--font-rubik)",
  fontWeight: 700, fontSize: 14, cursor: "pointer",
};
