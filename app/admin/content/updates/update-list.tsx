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
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--color-border-subtle)" }}>
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
        <input name="is_active" type="checkbox" defaultChecked={update.is_active} style={{ width: 16, height: 16, accentColor: "var(--color-amber-800)" }} />
        <span style={labelStyle}>מוצג באפליקציה</span>
      </label>

      {state.error && <p style={{ margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-danger)", fontWeight: "var(--font-weight-semibold)" }}>{state.error}</p>}

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
    <article style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-lg)", padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ margin: "0 0 4px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-sm)", color: "var(--color-brand)" }}>
            {update.tab_label}
          </p>
          <p style={{ margin: "0 0 4px", fontSize: "var(--font-size-sm)", color: "var(--color-text-tertiary)", fontWeight: "var(--font-weight-semibold)" }}>
            {formatDate(update.published_at)}
          </p>
          <p style={{ margin: "0 0 5px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-dark)" }}>
            {update.title}
          </p>
          <p style={{ margin: 0, fontSize: "var(--font-size-base)", lineHeight: 1.5, color: "var(--color-slate-600)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {update.description}
          </p>
          {update.button_link_url && update.button_text && (
            <p style={{ margin: "8px 0 0", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-amber-800)" }}>
              כפתור: {update.button_text}
            </p>
          )}

          <div style={{ display: "flex", gap: 14, marginTop: 10, color: "var(--color-slate-600)", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-md)" }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: toggling ? "wait" : "pointer" }}>
              <input type="radio" name={`active-${update.id}`} checked={isActive} disabled={toggling} onChange={() => setActive(true)} style={{ accentColor: "var(--color-amber-800)" }} />
              מוצג
            </label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: toggling ? "wait" : "pointer" }}>
              <input type="radio" name={`active-${update.id}`} checked={!isActive} disabled={toggling} onChange={() => setActive(false)} style={{ accentColor: "var(--color-amber-800)" }} />
              לא מוצג
            </label>
          </div>
          {error && (
            <p style={{ margin: "8px 0 0", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-danger)" }}>
              {error}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={() => setEditing((value) => !value)} style={iconButton} title="עריכה">✏️</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...iconButton, color: "var(--color-danger)" }} title="מחיקה">
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
    return <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)", fontFamily: "var(--font-family-sans)" }}>אין עדכונים עדיין.</p>;
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
  border: "1px solid var(--color-border-subtle)",
  borderRadius: "var(--shape-radius-sm)",
  background: "var(--color-surface-muted)",
  cursor: "pointer",
  fontSize: "var(--font-size-base)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const primaryButton = (pending: boolean): React.CSSProperties => ({
  padding: "9px 20px",
  background: pending ? "var(--color-text-tertiary)" : "var(--color-amber-800)",
  color: "var(--color-surface-raised)",
  border: "none",
  borderRadius: "var(--shape-radius-sm)",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)",
  fontSize: "var(--font-size-base)",
  cursor: pending ? "not-allowed" : "pointer",
});

const ghostButton: React.CSSProperties = {
  padding: "9px 20px",
  background: "var(--color-surface-raised)",
  color: "var(--color-slate-600)",
  border: "1px solid var(--color-border-subtle)",
  borderRadius: "var(--shape-radius-sm)",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-semibold)",
  fontSize: "var(--font-size-base)",
  cursor: "pointer",
};
