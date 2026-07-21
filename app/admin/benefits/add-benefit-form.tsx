"use client";

import { useActionState, useRef, useState } from "react";
import { RichTextEditor } from "../events/add-event-form";
import { addBenefit } from "./actions";

const init = { error: undefined as string | undefined, success: false };

const CATEGORIES = ["בריאות", "כושר", "מסעדות"];

function uniqueCategories(categories: string[] = []) {
  return Array.from(new Set([...CATEGORIES, ...categories].map((category) => category.trim()).filter(Boolean)));
}

export function AddBenefitForm({ categories = [] }: { categories?: string[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState(false);
  const categoryOptions = uniqueCategories(categories);
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof init, fd: FormData) => {
      const result = (await addBenefit(fd)) as typeof init;
      if (result.success) {
        formRef.current?.reset();
        setPreview(null);
        setCustomCategory(false);
      }
      return result;
    },
    init
  );

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>הוספת הטבה חדשה</h2>
      <form ref={formRef} action={formAction} style={formStyle}>
        <FormSection title="פרטי עסק">
          <Field label="שם העסק *">
            <input name="business" required placeholder="שם העסק..." style={inputStyle} />
          </Field>
          <Field label="תיאור העסק">
            <textarea name="business_description" rows={2} placeholder="מי העסק, מה הוא מציע..." style={{ ...inputStyle, resize: "vertical" }} />
          </Field>
          <Field label="מס׳ ליצירת קשר">
            <input name="contact_phone" type="tel" placeholder="050-0000000" style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
          </Field>
          <Field label="לוגו העסק">
            <ImagePicker name="image" preview={preview} onPreview={setPreview} />
          </Field>
          <Field label="קטגוריה *">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {customCategory ? (
                <input name="category" required placeholder="שם קטגוריה חדשה..." style={inputStyle} autoFocus />
              ) : (
                <select name="category" required style={inputStyle}>
                  <option value="">בחר קטגוריה...</option>
                  {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              )}
              <button
                type="button"
                onClick={() => setCustomCategory((value) => !value)}
                style={{
                  alignSelf: "flex-start",
                  minHeight: 30,
                  border: "1px solid var(--color-text-on-dark)",
                  borderRadius: "var(--shape-radius-pill)",
                  background: "var(--color-surface-raised)",
                  color: "var(--color-brand-blue)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 10px",
                  fontFamily: "var(--font-family-sans)",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-extrabold)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "var(--font-size-xl)", lineHeight: 1 }}>+</span>
                <span>{customCategory ? "בחירה מרשימה" : "קטגוריה חדשה"}</span>
              </button>
            </div>
          </Field>
          <Field label="כתובת העסק">
            <input name="location" placeholder="רחוב, עיר..." style={inputStyle} />
          </Field>
        </FormSection>

        <FormSection title="פרטי ההטבה">
          <Field label="הטבה *">
            <input name="deal" required placeholder='20% הנחה / 2+1...' style={inputStyle} />
          </Field>
          <Field label="תיאור ההטבה *">
            <RichTextEditor name="description" placeholder="פרטי ההטבה..." />
          </Field>
          <Field label="תוקף ההטבה">
            <input name="expires_at" type="date" style={inputStyle} />
          </Field>
        </FormSection>

        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input name="is_active" type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "var(--color-brand-blue)" }} />
          <span style={labelStyle}>פעיל (מוצג לחברים)</span>
        </label>

        {state.error && <p style={errorStyle}>{state.error}</p>}
        {state.success && <p style={successStyle}>✓ ההטבה נשמרה בהצלחה</p>}

        <button type="submit" disabled={pending} style={submitStyle(pending)}>
          {pending ? "שומר..." : "הוסף הטבה"}
        </button>
      </form>
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

export function ImagePicker({
  name, preview, onPreview, currentUrl,
}: {
  name: string; preview: string | null; onPreview: (u: string | null) => void; currentUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayed = preview ?? currentUrl ?? null;

  return (
    <div>
      <input ref={inputRef} name={name} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          onPreview(f ? URL.createObjectURL(f) : null);
        }}
      />
      {displayed ? (
        <div style={{ position: "relative", width: 80, height: 80, borderRadius: "var(--shape-radius-sm)", overflow: "hidden", border: "1px solid var(--color-border-subtle)" }}>
          <img src={displayed} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button type="button" onClick={() => { onPreview(null); if (inputRef.current) inputRef.current.value = ""; }}
            style={{ position: "absolute", top: 3, left: 3, width: 22, height: 22, background: "color-mix(in srgb, var(--color-overlay) 60%, transparent)", color: "var(--color-surface-raised)", border: "none", borderRadius: "var(--shape-radius-circle)", fontSize: "var(--font-size-2xs)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{ position: "absolute", bottom: 3, left: 3, padding: "2px 6px", background: "color-mix(in srgb, var(--color-overlay) 60%, transparent)", color: "var(--color-surface-raised)", border: "none", borderRadius: "var(--shape-radius-pill)", fontSize: "var(--font-size-2xs)", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", cursor: "pointer" }}>
            החלף
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          style={{ padding: "12px 20px", border: "1.5px dashed var(--color-text-on-dark)", background: "var(--color-surface-muted)", borderRadius: "var(--shape-radius-sm)", cursor: "pointer", fontSize: "var(--font-size-md)", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "var(--font-size-3xl)" }}>📷</span> העלה לוגו / תמונה
        </button>
      )}
    </div>
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

export const cardStyle: React.CSSProperties = {
  background: "var(--color-surface-raised)",
  border: "1px solid var(--color-border-subtle)",
  borderRadius: "var(--shape-radius-lg)",
  boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 5%, transparent)",
  padding: "20px 18px",
};
export const headingStyle: React.CSSProperties = {
  margin: "0 0 16px",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)",
  fontSize: "var(--font-size-2xl)",
  color: "var(--color-admin-dark)",
};
export const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
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
export const labelStyle: React.CSSProperties = {
  fontSize: "var(--font-size-md)",
  fontWeight: "var(--font-weight-semibold)",
  color: "var(--color-slate-600)",
  fontFamily: "var(--font-family-sans)",
};
export const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "var(--font-size-base)",
  fontFamily: "var(--font-family-sans)",
  border: "1px solid var(--color-text-on-dark)",
  borderRadius: "var(--shape-radius-sm)",
  background: "var(--color-surface-raised)",
  color: "var(--color-admin-dark)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
};
const errorStyle: React.CSSProperties = { margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-danger)", fontWeight: "var(--font-weight-semibold)" };
const successStyle: React.CSSProperties = { margin: 0, fontSize: "var(--font-size-md)", color: "var(--color-success)", fontWeight: "var(--font-weight-semibold)" };
const submitStyle = (p: boolean): React.CSSProperties => ({
  marginTop: 4,
  padding: "11px 24px",
  background: p ? "var(--color-text-tertiary)" : "var(--color-brand-blue)",
  color: "var(--color-surface-raised)",
  border: "none",
  borderRadius: "var(--shape-radius-sm)",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)",
  fontSize: "var(--font-size-lg)",
  cursor: p ? "not-allowed" : "pointer",
});
