"use client";

import { useEffect, useState, useActionState } from "react";
import type { Tables } from "@/src/types/database";
import { RichTextEditor } from "../events/add-event-form";
import { updateBenefit, toggleActive, deleteBenefit } from "./actions";
import { ImagePicker, labelStyle, inputStyle } from "./add-benefit-form";

type Benefit = Tables<"benefits">;

const CATEGORIES = ["בריאות", "כושר", "מסעדות"];

const init = { error: undefined as string | undefined, success: false };

function uniqueCategories(categories: string[] = []) {
  return Array.from(new Set([...CATEGORIES, ...categories].map((category) => category.trim()).filter(Boolean)));
}

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
}

function EditForm({ benefit, categories, onDone }: { benefit: Benefit; categories: string[]; onDone: () => void }) {
  const action = async (_prev: typeof init, fd: FormData) =>
    (await updateBenefit(benefit.id, fd)) as typeof init;
  const [state, formAction, pending] = useActionState(action, init);
  const [preview, setPreview] = useState<string | null>(null);
  const categoryOptions = uniqueCategories([benefit.category, ...categories]);

  useEffect(() => {
    if (state.success) onDone();
  }, [state.success, onDone]);

  return (
    <form action={formAction}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <input type="hidden" name="existing_image_url" value={benefit.image_url ?? ""} />

      <FormSection title="פרטי עסק">
        <Field label="שם העסק *">
          <input name="business" required defaultValue={benefit.business} style={inputStyle} />
        </Field>
        <Field label="תיאור העסק">
          <textarea name="business_description" rows={2} defaultValue={benefit.business_description ?? ""} style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <Field label="מס׳ ליצירת קשר">
          <input name="contact_phone" type="tel" defaultValue={benefit.contact_phone ?? ""} style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
        </Field>
        <Field label="לוגו העסק">
          <ImagePicker name="image" preview={preview} onPreview={setPreview} currentUrl={benefit.image_url} />
        </Field>
        <Field label="קטגוריה *">
          <select name="category" required defaultValue={benefit.category} style={inputStyle}>
            <option value="">בחר קטגוריה...</option>
            {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </Field>
        <Field label="כתובת העסק">
          <input name="location" defaultValue={benefit.location ?? ""} style={inputStyle} />
        </Field>
      </FormSection>

      <FormSection title="פרטי ההטבה">
        <Field label="הטבה *">
          <input name="deal" required defaultValue={benefit.deal} style={inputStyle} />
        </Field>
        <Field label="תיאור ההטבה *">
          <RichTextEditor name="description" initialHtml={benefit.description} placeholder="פרטי ההטבה..." />
        </Field>
        <Field label="תוקף ההטבה">
          <input name="expires_at" type="date" defaultValue={benefit.expires_at ?? ""} style={inputStyle} />
        </Field>
      </FormSection>

      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input name="is_active" type="checkbox" defaultChecked={benefit.is_active} style={{ width: 16, height: 16, accentColor: "var(--color-brand-blue)" }} />
        <span style={labelStyle}>פעיל</span>
      </label>

      {state.error && <p style={{ margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-danger)", fontWeight: "var(--font-weight-semibold)" }}>{state.error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" disabled={pending} style={btnPrimary(pending)}>{pending ? "שומר..." : "שמור"}</button>
        <button type="button" onClick={onDone} style={btnGhost}>ביטול</button>
      </div>
    </form>
  );
}

function EditBenefitModal({ benefit, categories, onClose }: { benefit: Benefit; categories: string[]; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`עריכת ${benefit.business}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "color-mix(in srgb, var(--color-admin-dark) 55%, transparent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          maxHeight: "calc(100dvh - 32px)",
          overflowY: "auto",
          borderRadius: "var(--shape-radius-xl)",
          background: "var(--color-surface-raised)",
          boxShadow: "0 24px 80px color-mix(in srgb, var(--color-admin-dark) 28%, transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderBottom: "1px solid var(--color-border-subtle)",
            position: "sticky",
            top: 0,
            zIndex: 1,
            background: "var(--color-surface-raised)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-dark)" }}>
            עריכת הטבה
          </h2>
          <button type="button" onClick={onClose} aria-label="סגירת חלון" style={closeBtn}>
            ×
          </button>
        </div>

        <div style={{ padding: 16 }}>
          <EditForm benefit={benefit} categories={categories} onDone={onClose} />
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function BenefitCard({ benefit, categories }: { benefit: Benefit; categories: string[] }) {
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
    <div style={{ background: "var(--color-surface-raised)", border: expired ? "1px solid var(--color-text-on-dark)" : "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-md)", boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)", padding: 14, opacity: expired ? 0.78 : 1, minWidth: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: "100%" }}>
        <div style={{ display: "flex", gap: 12, minWidth: 0 }}>
          <div style={{ flexShrink: 0 }}>
            {benefit.image_url ? (
              <img src={benefit.image_url} alt={benefit.business}
                style={{ width: 54, height: 54, objectFit: "cover", borderRadius: "var(--shape-radius-sm)", border: "1px solid var(--color-border-subtle)" }} />
            ) : (
              <div style={{ width: 54, height: 54, background: "var(--color-surface-soft)", borderRadius: "var(--shape-radius-sm)", border: "1px solid var(--color-border-subtle)" }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-lg)", color: "var(--color-admin-dark)", overflowWrap: "anywhere" }}>
                {benefit.business}
              </p>
              <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", background: expired ? "var(--color-surface-soft)" : "var(--color-surface-soft)", color: expired ? "var(--color-text-secondary)" : "var(--color-slate-600)", border: "1px solid var(--color-border-subtle)", padding: "2px 7px", borderRadius: "var(--shape-radius-pill)" }}>
                {expired ? "הטבות שהסתיימו" : benefit.category}
              </span>
              {!benefit.is_active && (
                <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", background: "var(--color-red-100)", color: "var(--color-danger)", border: "1px solid var(--color-red-200)", padding: "2px 7px", borderRadius: "var(--shape-radius-pill)" }}>
                  לא פעיל
                </span>
              )}
              {expired && (
                <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-bold)", background: "var(--color-surface-soft)", color: "var(--color-text-secondary)", border: "1px solid var(--color-text-on-dark)", padding: "2px 7px", borderRadius: "var(--shape-radius-pill)" }}>
                  פג תוקף
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-extrabold)", color: "var(--color-brand-blue)", fontFamily: "var(--font-family-sans)", overflowWrap: "anywhere" }}>
              {benefit.deal}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0, marginTop: "auto" }}>
          <button onClick={handleToggle} disabled={toggling}
            title={benefit.is_active ? "השבת" : "הפעל"}
            style={{ ...iconBtn, background: benefit.is_active ? "var(--color-green-100)" : "var(--color-surface-soft)", color: benefit.is_active ? "var(--color-success)" : "var(--color-text-tertiary)" }}>
            {benefit.is_active ? "●" : "○"}
          </button>
          <button onClick={() => setEditing(true)} style={iconBtn} title="עריכה">✏️</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...iconBtn, color: "var(--color-danger)" }} title="מחיקה">
            {deleting ? "…" : "🗑"}
          </button>
        </div>
      </div>

      {editing && <EditBenefitModal benefit={benefit} categories={categories} onClose={() => setEditing(false)} />}
    </div>
  );
}

export function BenefitList({ benefits }: { benefits: Benefit[] }) {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  if (benefits.length === 0) {
    return <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)", fontFamily: "var(--font-family-sans)" }}>אין הטבות עדיין.</p>;
  }

  const filteredBenefits = benefits.filter((benefit) => {
    if (statusFilter === "active") return benefit.is_active;
    if (statusFilter === "inactive") return !benefit.is_active;
    return true;
  });
  const benefitCategories = uniqueCategories(benefits.map((benefit) => benefit.category));

  const filterItems = [
    { key: "all", label: "הכל" },
    { key: "active", label: "פעיל" },
    { key: "inactive", label: "לא פעיל" },
  ] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <style>{`
        .kv-benefits-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        @media (max-width: 1180px) {
          .kv-benefits-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .kv-benefits-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .kv-benefits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {filterItems.map((item) => {
          const active = statusFilter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatusFilter(item.key)}
              aria-pressed={active}
              style={{
                minHeight: 34,
                borderRadius: "var(--shape-radius-pill)",
                border: active ? "1px solid var(--color-admin-dark)" : "1px solid var(--color-border-subtle)",
                background: active ? "var(--color-admin-dark)" : "var(--color-surface-raised)",
                color: active ? "var(--color-surface-raised)" : "var(--color-slate-600)",
                padding: "0 14px",
                fontFamily: "var(--font-family-sans)",
                fontSize: "var(--font-size-md)",
                fontWeight: "var(--font-weight-extrabold)",
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {filteredBenefits.length > 0 ? (
        <div className="kv-benefits-grid">
          {filteredBenefits.map((benefit) => <BenefitCard key={benefit.id} benefit={benefit} categories={benefitCategories} />)}
        </div>
      ) : (
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)", fontFamily: "var(--font-family-sans)" }}>
          אין הטבות להצגה בפילטר הזה.
        </p>
      )}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-sm)",
  background: "var(--color-surface-muted)", cursor: "pointer", fontSize: "var(--font-size-base)", display: "flex",
  alignItems: "center", justifyContent: "center", flexShrink: 0,
};
const closeBtn: React.CSSProperties = {
  width: 34,
  height: 34,
  border: "1px solid var(--color-border-subtle)",
  borderRadius: "var(--shape-radius-sm)",
  background: "var(--color-surface-raised)",
  color: "var(--color-admin-dark)",
  fontSize: "var(--font-size-3xl)",
  lineHeight: 1,
  cursor: "pointer",
};
const sectionStyle: React.CSSProperties = {
  border: "1px solid var(--color-border-subtle)",
  borderRadius: "var(--shape-radius-md)",
  padding: 14,
  background: "var(--color-surface-muted)",
};
const sectionHeadingStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontFamily: "var(--font-family-sans)",
  fontSize: "var(--font-size-lg)",
  fontWeight: "var(--font-weight-black)",
  color: "var(--color-admin-dark)",
};
const btnPrimary = (p: boolean): React.CSSProperties => ({
  padding: "9px 20px", background: p ? "var(--color-text-tertiary)" : "var(--color-brand-blue)", color: "var(--color-surface-raised)",
  border: "none", borderRadius: "var(--shape-radius-sm)", fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-base)", cursor: p ? "not-allowed" : "pointer",
});
const btnGhost: React.CSSProperties = {
  padding: "9px 20px", background: "var(--color-surface-raised)", color: "var(--color-slate-600)",
  border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-sm)", fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-base)", cursor: "pointer",
};
