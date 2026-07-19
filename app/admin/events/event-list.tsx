"use client";

import { useEffect, useState, useActionState } from "react";
import type { Tables } from "@/src/types/database";
import { updateEvent, toggleFeatured, deleteEvent } from "./actions";
import { CostFields, ImagePicker, RichTextEditor, labelStyle, inputStyle } from "./add-event-form";

type Event = Tables<"events">;

const init = { error: undefined as string | undefined, success: false };

function EditForm({ event, onDone }: { event: Event; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(updateEvent.bind(null, event.id), init);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(event.is_paid);

  useEffect(() => {
    if (state.success) onDone();
  }, [state.success, onDone]);

  return (
    <form
      action={formAction}
      style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--color-border-subtle)" }}
    >
      <input type="hidden" name="existing_image_url" value={event.image_url ?? ""} />

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תמונה</label>
        <ImagePicker name="image" preview={preview} onPreview={setPreview} currentUrl={event.image_url} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>כותרת *</label>
        <input name="title" required defaultValue={event.title} style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תוכן *</label>
        <RichTextEditor name="description" initialHtml={event.description} placeholder="תיאור האירוע..." />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>תאריך *</label>
          <input name="event_date" type="date" required defaultValue={event.event_date} style={inputStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>שעה *</label>
          <input name="start_hour" type="time" required defaultValue={event.start_hour} style={inputStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>שעת סיום</label>
          <input name="end_hour" type="time" defaultValue={event.end_hour ?? ""} style={inputStyle} />
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
      <CostFields isPaid={isPaid} onPaidChange={setIsPaid} defaultPrice={event.price_amount} />
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input name="is_featured" type="checkbox" defaultChecked={event.is_featured} style={{ width: 16, height: 16, accentColor: "var(--color-brand-blue)" }} />
        <span style={labelStyle}>מוצג בראש הדף</span>
      </label>

      {state.error && <p style={{ margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-danger)", fontWeight: "var(--font-weight-semibold)" }}>{state.error}</p>}

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

  const costLabel = event.is_paid && event.price_amount !== null
    ? `בתשלום · ₪${event.price_amount}`
    : "ללא עלות";

  return (
    <div style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-md)", boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)", padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              style={{ width: 52, height: 52, objectFit: "cover", borderRadius: "var(--shape-radius-sm)", border: "1px solid var(--color-border-subtle)", flexShrink: 0 }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-lg)", color: "var(--color-admin-dark)" }}>
                {event.title}
              </p>
              {event.is_featured && (
                <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", background: "var(--color-blue-50)", color: "var(--color-brand-blue)", border: "1px solid var(--color-blue-200)", padding: "2px 8px", borderRadius: "var(--shape-radius-pill)" }}>
                  מוצג
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-medium)" }}>
              {event.event_date} · {event.start_hour}{event.end_hour ? `-${event.end_hour}` : ""} · {event.location} · {costLabel}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={handleToggle}
            disabled={featuring}
            title={event.is_featured ? "הסר מ-Featured" : "הוסף ל-Featured"}
            style={{ ...iconBtn, background: event.is_featured ? "var(--color-blue-50)" : "var(--color-surface-muted)", color: event.is_featured ? "var(--color-brand-blue)" : "var(--color-text-tertiary)" }}
          >
            ★
          </button>
          <button onClick={() => setEditing((v) => !v)} style={iconBtn} title="עריכה">✏️</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...iconBtn, color: "var(--color-danger)" }} title="מחיקה">
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
    return <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)", fontFamily: "var(--font-family-sans)" }}>אין אירועים עדיין.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {events.map((ev) => <EventRow key={ev.id} event={ev} />)}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-sm)",
  background: "var(--color-surface-muted)", cursor: "pointer", fontSize: "var(--font-size-base)", display: "flex",
  alignItems: "center", justifyContent: "center", flexShrink: 0,
};
const btnPrimary = (pending: boolean): React.CSSProperties => ({
  padding: "9px 20px", background: pending ? "var(--color-text-tertiary)" : "var(--color-brand-blue)", color: "var(--color-surface-raised)",
  border: "none", borderRadius: "var(--shape-radius-sm)", fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-base)", cursor: pending ? "not-allowed" : "pointer",
});
const btnGhost: React.CSSProperties = {
  padding: "9px 20px", background: "var(--color-surface-raised)", color: "var(--color-slate-600)",
  border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-sm)", fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-base)", cursor: "pointer",
};
