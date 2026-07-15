"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Tables } from "@/src/types/database";
import { deleteUpdate, setUpdateActive, updateUpdate } from "./actions";
import { inputStyle, labelStyle } from "./add-update-form";

type Update = Tables<"updates">;

const initialState = { error: undefined as string | undefined, success: false };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EditUpdateForm({ update, onDone }: { update: Update; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) =>
      (await updateUpdate(update.id, formData)) as typeof initialState,
    initialState
  );

  useEffect(() => {
    if (state.success) onDone();
  }, [state.success, onDone]);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid #E2E8F0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>טאב עליון *</label>
        <input name="tab_label" required maxLength={32} defaultValue={update.tab_label} style={inputStyle} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>כותרת *</label>
        <input name="title" required defaultValue={update.title} style={inputStyle} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תוכן *</label>
        <textarea name="description" required rows={4} defaultValue={update.description} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>לינק לכפתור</label>
          <input name="button_link_url" type="url" defaultValue={update.button_link_url ?? ""} style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>טקסט לכפתור</label>
          <input name="button_text" defaultValue={update.button_text ?? ""} style={inputStyle} />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input name="is_active" type="checkbox" defaultChecked={update.is_active} style={{ width: 16, height: 16, accentColor: "#B45309" }} />
        <span style={labelStyle}>מוצג באפליקציה</span>
      </label>

      {state.error && <p style={{ margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{state.error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" disabled={pending} style={primaryButton(pending)}>
          {pending ? "שומר..." : "שמור"}
        </button>
        <button type="button" onClick={onDone} style={ghostButton}>
          ביטול
        </button>
      </div>
    </form>
  );
}

function UpdateRow({ update }: { update: Update }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isActive = update.is_active ?? false;

  async function setActive(nextActive: boolean) {
    if (nextActive === isActive) return;
    setError(null);
    setToggling(true);
    const result = await setUpdateActive(update.id, nextActive);
    setToggling(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("למחוק את העדכון?")) return;
    setDeleting(true);
    await deleteUpdate(update.id);
  }

  return (
    <article style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: "#5934ED" }}>
            {update.tab_label}
          </p>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>
            {formatDate(update.published_at)}
          </p>
          <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 16, color: "#0F172A" }}>
            {update.title}
          </p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#475569", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {update.description}
          </p>
          {update.button_link_url && update.button_text && (
            <p style={{ margin: "8px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#B45309" }}>
              כפתור: {update.button_text}
            </p>
          )}

          <div style={{ display: "flex", gap: 14, marginTop: 10, color: "#475569", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: toggling ? "wait" : "pointer" }}>
              <input type="radio" name={`active-${update.id}`} checked={isActive} disabled={toggling} onChange={() => setActive(true)} style={{ accentColor: "#B45309" }} />
              מוצג
            </label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: toggling ? "wait" : "pointer" }}>
              <input type="radio" name={`active-${update.id}`} checked={!isActive} disabled={toggling} onChange={() => setActive(false)} style={{ accentColor: "#B45309" }} />
              לא מוצג
            </label>
          </div>
          {error && (
            <p style={{ margin: "8px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#DC2626" }}>
              {error}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={() => setEditing((value) => !value)} style={iconButton} title="עריכה">✏️</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...iconButton, color: "#DC2626" }} title="מחיקה">
            {deleting ? "…" : "🗑"}
          </button>
        </div>
      </div>

      {editing && <EditUpdateForm update={update} onDone={() => setEditing(false)} />}
    </article>
  );
}

export function UpdateList({ updates }: { updates: Update[] }) {
  if (updates.length === 0) {
    return <p style={{ color: "#64748B", fontSize: 14, fontFamily: "var(--font-rubik)" }}>אין עדכונים עדיין.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {updates.map((update) => <UpdateRow key={update.id} update={update} />)}
    </div>
  );
}

const iconButton: React.CSSProperties = {
  width: 32,
  height: 32,
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  background: "#F8FAFC",
  cursor: "pointer",
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const primaryButton = (pending: boolean): React.CSSProperties => ({
  padding: "9px 20px",
  background: pending ? "#94A3B8" : "#B45309",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 14,
  cursor: pending ? "not-allowed" : "pointer",
});

const ghostButton: React.CSSProperties = {
  padding: "9px 20px",
  background: "#fff",
  color: "#475569",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  fontFamily: "var(--font-rubik)",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};
