"use client";

import { useState, useActionState } from "react";
import type { Tables } from "@/src/types/database";
import { updateBenefit, toggleActive, deleteBenefit } from "./actions";
import { ImagePicker, labelStyle, inputStyle } from "./add-benefit-form";

type Benefit = Tables<"benefits">;

const BG_OPTIONS = [
  { label: "אפרסק", value: "var(--color-card-peach)" },
  { label: "לבנדר", value: "var(--color-card-lavender)" },
  { label: "נענע", value: "var(--color-card-mint)" },
  { label: "תכלת", value: "var(--color-card-sky)" },
  { label: "חמאה", value: "var(--color-card-butter)" },
  { label: "ליים", value: "var(--color-card-lime)" },
];

const init = { error: undefined as string | undefined, success: false };

function EditForm({ benefit, onDone }: { benefit: Benefit; onDone: () => void }) {
  const action = async (_prev: typeof init, fd: FormData) =>
    (await updateBenefit(benefit.id, fd)) as typeof init;
  const [state, formAction, pending] = useActionState(action, init);
  const [preview, setPreview] = useState<string | null>(null);
  if (state.success) onDone();

  return (
    <form action={formAction} encType="multipart/form-data"
      style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "2px solid #E0E0E0" }}>
      <input type="hidden" name="existing_image_url" value={benefit.image_url ?? ""} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>שם העסק *</label>
          <input name="business" required defaultValue={benefit.business} style={inputStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>קטגוריה *</label>
          <input name="category" required defaultValue={benefit.category} style={inputStyle} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>הטבה *</label>
        <input name="deal" required defaultValue={benefit.deal} style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תיאור *</label>
        <textarea name="description" required rows={3} defaultValue={benefit.description} style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>צבע רקע</label>
          <select name="bg_color" defaultValue={benefit.bg_color} style={inputStyle}>
            {BG_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>סדר תצוגה</label>
          <input name="sort_order" type="number" defaultValue={benefit.sort_order} min={0} style={inputStyle} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>לוגו / תמונה</label>
        <ImagePicker name="image" preview={preview} onPreview={setPreview} currentUrl={benefit.image_url} />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input name="is_active" type="checkbox" defaultChecked={benefit.is_active} style={{ width: 18, height: 18 }} />
        <span style={labelStyle}>פעיל</span>
      </label>

      {state.error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", fontWeight: 600 }}>{state.error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" disabled={pending} style={btnDark(pending)}>{pending ? "שומר..." : "שמור"}</button>
        <button type="button" onClick={onDone} style={btnGhost}>ביטול</button>
      </div>
    </form>
  );
}

function BenefitRow({ benefit }: { benefit: Benefit }) {
  const [editing, setEditing] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle() {
    setToggling(true);
    await toggleActive(benefit.id, benefit.is_active);
    setToggling(false);
  }

  async function handleDelete() {
    if (!confirm("למחוק את ההטבה?")) return;
    setDeleting(true);
    await deleteBenefit(benefit.id);
  }

  return (
    <div style={{ background: "#fff", border: "2px solid #0F0F0F", borderRadius: 0, boxShadow: "4px 4px 0 0 #0F0F0F", padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        {/* Color swatch + thumbnail + info */}
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
            <div style={{ width: 8, height: 48, background: benefit.bg_color, border: "1.5px solid #0F0F0F", flexShrink: 0 }} />
            {benefit.image_url ? (
              <img src={benefit.image_url} alt={benefit.business}
                style={{ width: 48, height: 48, objectFit: "cover", border: "2px solid #0F0F0F", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 48, height: 48, background: "#E8E8E8", border: "2px solid #0F0F0F", flexShrink: 0 }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 15, color: "var(--color-text-primary)" }}>
                {benefit.business}
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(0,0,0,0.08)", border: "1.5px solid rgba(0,0,0,0.15)", padding: "1px 6px", letterSpacing: "0.04em" }}>
                {benefit.category}
              </span>
              {!benefit.is_active && (
                <span style={{ fontSize: 10, fontWeight: 700, background: "#FED7D7", color: "#c53030", border: "1.5px solid #c53030", padding: "1px 6px" }}>
                  לא פעיל
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-rubik)" }}>
              {benefit.deal}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-heebo)" }}>
              סדר: {benefit.sort_order}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={handleToggle} disabled={toggling}
            title={benefit.is_active ? "השבת" : "הפעל"}
            style={{ ...iconBtn, background: benefit.is_active ? "#0F0F0F" : "#fff", color: benefit.is_active ? "#fff" : "#0F0F0F" }}>
            {benefit.is_active ? "●" : "○"}
          </button>
          <button onClick={() => setEditing((v) => !v)} style={iconBtn} title="עריכה">✏️</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...iconBtn, color: "#c53030" }} title="מחיקה">
            {deleting ? "…" : "🗑"}
          </button>
        </div>
      </div>

      {editing && <EditForm benefit={benefit} onDone={() => setEditing(false)} />}
    </div>
  );
}

export function BenefitList({ benefits }: { benefits: Benefit[] }) {
  if (benefits.length === 0) {
    return <p style={{ color: "var(--color-text-muted)", fontSize: 14, fontFamily: "var(--font-heebo)" }}>אין הטבות עדיין.</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {benefits.map((b) => <BenefitRow key={b.id} benefit={b} />)}
    </div>
  );
}

const iconBtn: React.CSSProperties = { width: 34, height: 34, border: "2px solid #0F0F0F", borderRadius: 0, background: "#fff", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heebo)", fontWeight: 700, flexShrink: 0 };
const btnDark = (p: boolean): React.CSSProperties => ({ padding: "9px 20px", background: p ? "#ccc" : "#0F0F0F", color: "#fff", border: "2px solid #0F0F0F", borderRadius: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, cursor: p ? "not-allowed" : "pointer" });
const btnGhost: React.CSSProperties = { padding: "9px 20px", background: "#fff", color: "#0F0F0F", border: "2px solid #0F0F0F", borderRadius: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, cursor: "pointer" };
