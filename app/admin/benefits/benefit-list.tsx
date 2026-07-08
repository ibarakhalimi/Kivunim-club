"use client";

import { useEffect, useState, useActionState } from "react";
import type { Tables } from "@/src/types/database";
import { updateBenefit, toggleActive, deleteBenefit } from "./actions";
import { ImagePicker, labelStyle, inputStyle } from "./add-benefit-form";

type Benefit = Tables<"benefits">;

const CATEGORIES = ["בריאות", "כושר", "מסעדות"];

const init = { error: undefined as string | undefined, success: false };

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
}

function EditForm({ benefit, onDone }: { benefit: Benefit; onDone: () => void }) {
  const action = async (_prev: typeof init, fd: FormData) =>
    (await updateBenefit(benefit.id, fd)) as typeof init;
  const [state, formAction, pending] = useActionState(action, init);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) onDone();
  }, [state.success, onDone]);

  return (
    <form action={formAction}
      style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid #E2E8F0" }}>
      <input type="hidden" name="existing_image_url" value={benefit.image_url ?? ""} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>שם העסק *</label>
          <input name="business" required defaultValue={benefit.business} style={inputStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={labelStyle}>קטגוריה *</label>
          <select name="category" required defaultValue={benefit.category} style={inputStyle}>
            <option value="">בחר קטגוריה...</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>הטבה *</label>
        <input name="deal" required defaultValue={benefit.deal} style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תיאור ההטבה *</label>
        <textarea name="description" required rows={3} defaultValue={benefit.description} style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תיאור העסק</label>
        <textarea name="business_description" rows={2} defaultValue={benefit.business_description ?? ""} style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>כתובת</label>
        <input name="location" defaultValue={benefit.location ?? ""} style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>תוקף ההטבה</label>
        <input name="expires_at" type="date" defaultValue={benefit.expires_at ?? ""} style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={labelStyle}>לוגו / תמונה</label>
        <ImagePicker name="image" preview={preview} onPreview={setPreview} currentUrl={benefit.image_url} />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input name="is_active" type="checkbox" defaultChecked={benefit.is_active} style={{ width: 16, height: 16, accentColor: "#1E40AF" }} />
        <span style={labelStyle}>פעיל</span>
      </label>

      {state.error && <p style={{ margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{state.error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" disabled={pending} style={btnPrimary(pending)}>{pending ? "שומר..." : "שמור"}</button>
        <button type="button" onClick={onDone} style={btnGhost}>ביטול</button>
      </div>
    </form>
  );
}

function BenefitRow({ benefit }: { benefit: Benefit }) {
  const [editing, setEditing] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const expired = isExpired(benefit.expires_at);

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
    <div style={{ background: "#fff", border: expired ? "1px solid #CBD5E1" : "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "14px 16px", opacity: expired ? 0.78 : 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{ flexShrink: 0 }}>
            {benefit.image_url ? (
              <img src={benefit.image_url} alt={benefit.business}
                style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, border: "1px solid #E2E8F0" }} />
            ) : (
              <div style={{ width: 46, height: 46, background: "#F1F5F9", borderRadius: 8, border: "1px solid #E2E8F0" }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
                {benefit.business}
              </p>
              <span style={{ fontSize: 11, fontWeight: 600, background: expired ? "#F1F5F9" : "#F1F5F9", color: expired ? "#64748B" : "#475569", border: "1px solid #E2E8F0", padding: "2px 7px", borderRadius: 99 }}>
                {expired ? "הטבות שהסתיימו" : benefit.category}
              </span>
              {!benefit.is_active && (
                <span style={{ fontSize: 11, fontWeight: 600, background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA", padding: "2px 7px", borderRadius: 99 }}>
                  לא פעיל
                </span>
              )}
              {expired && (
                <span style={{ fontSize: 11, fontWeight: 700, background: "#F1F5F9", color: "#64748B", border: "1px solid #CBD5E1", padding: "2px 7px", borderRadius: 99 }}>
                  פג תוקף
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1E40AF", fontFamily: "var(--font-rubik)" }}>
              {benefit.deal}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={handleToggle} disabled={toggling}
            title={benefit.is_active ? "השבת" : "הפעל"}
            style={{ ...iconBtn, background: benefit.is_active ? "#DCFCE7" : "#F1F5F9", color: benefit.is_active ? "#16A34A" : "#94A3B8" }}>
            {benefit.is_active ? "●" : "○"}
          </button>
          <button onClick={() => setEditing((v) => !v)} style={iconBtn} title="עריכה">✏️</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...iconBtn, color: "#DC2626" }} title="מחיקה">
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
    return <p style={{ color: "#64748B", fontSize: 14, fontFamily: "var(--font-rubik)" }}>אין הטבות עדיין.</p>;
  }
  const activeBenefits = benefits.filter((benefit) => !isExpired(benefit.expires_at));
  const expiredBenefits = benefits.filter((benefit) => isExpired(benefit.expires_at));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {activeBenefits.map((b) => <BenefitRow key={b.id} benefit={b} />)}
      </div>

      {expiredBenefits.length > 0 && (
        <div>
          <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 14, color: "#64748B" }}>
            הטבות שהסתיימו
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {expiredBenefits.map((b) => <BenefitRow key={b.id} benefit={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, border: "1px solid #E2E8F0", borderRadius: 8,
  background: "#F8FAFC", cursor: "pointer", fontSize: 14, display: "flex",
  alignItems: "center", justifyContent: "center", flexShrink: 0,
};
const btnPrimary = (p: boolean): React.CSSProperties => ({
  padding: "9px 20px", background: p ? "#94A3B8" : "#1E40AF", color: "#fff",
  border: "none", borderRadius: 8, fontFamily: "var(--font-rubik)",
  fontWeight: 700, fontSize: 14, cursor: p ? "not-allowed" : "pointer",
});
const btnGhost: React.CSSProperties = {
  padding: "9px 20px", background: "#fff", color: "#475569",
  border: "1px solid #E2E8F0", borderRadius: 8, fontFamily: "var(--font-rubik)",
  fontWeight: 600, fontSize: 14, cursor: "pointer",
};
