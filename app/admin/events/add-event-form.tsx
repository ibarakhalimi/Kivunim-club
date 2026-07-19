"use client";

import { useActionState, useRef, useState } from "react";
import { addEvent } from "./actions";

const init = { error: undefined as string | undefined, success: false };
const MAX_IMAGE_SIZE = 9 * 1024 * 1024;

export function AddEventForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [state, formAction, pending] = useActionState(addEvent, init);

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>הוספת אירוע חדש</h2>
      <form action={formAction} style={formStyle}>
        <Field label="תמונה">
          <ImagePicker name="image" preview={preview} onPreview={setPreview} />
        </Field>
        <Field label="כותרת *">
          <input name="title" required placeholder="שם האירוע..." style={inputStyle} />
        </Field>
        <Field label="תוכן *">
          <RichTextEditor name="description" placeholder="תיאור האירוע..." />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <Field label="תאריך *">
            <input name="event_date" type="date" required style={inputStyle} />
          </Field>
          <Field label="שעת התחלה *">
            <input name="start_hour" type="time" required style={inputStyle} />
          </Field>
          <Field label="שעת סיום">
            <input name="end_hour" type="time" style={inputStyle} />
          </Field>
        </div>
        <Field label="מיקום *">
          <input name="location" required placeholder="כתובת / שם המקום..." style={inputStyle} />
        </Field>
        <Field label="קישור להרשמה">
          <input name="registration_url" type="url" placeholder="https://..." style={inputStyle} />
        </Field>
        <CostFields isPaid={isPaid} onPaidChange={setIsPaid} />
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input name="is_featured" type="checkbox" style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--color-brand-blue)" }} />
          <span style={labelStyle}>מוצג בראש הדף</span>
        </label>

        {state.error && <p style={errorStyle}>{state.error}</p>}
        {state.success && <p style={successStyle}>✓ האירוע נשמר בהצלחה</p>}

        <button type="submit" disabled={pending} style={submitStyle(pending)}>
          {pending ? "שומר..." : "פרסם אירוע"}
        </button>
      </form>
    </div>
  );
}

export function CostFields({
  isPaid,
  onPaidChange,
  defaultPrice = "",
}: {
  isPaid: boolean;
  onPaidChange: (value: boolean) => void;
  defaultPrice?: string | number | null;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={labelStyle}>עלות האירוע</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <label style={choiceStyle(!isPaid)}>
          <input
            type="radio"
            name="is_paid"
            value="false"
            checked={!isPaid}
            onChange={() => onPaidChange(false)}
            style={{ accentColor: "var(--color-brand-blue)" }}
          />
          ללא עלות
        </label>
        <label style={choiceStyle(isPaid)}>
          <input
            type="radio"
            name="is_paid"
            value="true"
            checked={isPaid}
            onChange={() => onPaidChange(true)}
            style={{ accentColor: "var(--color-brand-blue)" }}
          />
          בתשלום
        </label>
      </div>
      {isPaid && (
        <input
          name="price_amount"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={defaultPrice ?? ""}
          placeholder="סכום בש״ח"
          style={{ ...inputStyle, direction: "ltr", textAlign: "left" }}
        />
      )}
    </div>
  );
}

export function RichTextEditor({
  name,
  initialHtml = "",
  placeholder,
}: {
  name: string;
  initialHtml?: string | null;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function syncValue() {
    if (!editorRef.current || !inputRef.current) return;
    inputRef.current.value = editorRef.current.innerHTML;
  }

  function applyCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncValue();
  }

  return (
    <div style={{ border: "1px solid var(--color-text-on-dark)", borderRadius: "var(--shape-radius-sm)", overflow: "hidden", background: "var(--color-surface-raised)" }}>
      <input ref={inputRef} type="hidden" name={name} defaultValue={initialHtml ?? ""} />
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: 8, borderBottom: "1px solid var(--color-border-subtle)", background: "var(--color-surface-muted)", flexWrap: "wrap" }}>
        <ToolbarButton label="B" title="מודגש" onClick={() => applyCommand("bold")} />
        <ToolbarButton label="I" title="נטוי" onClick={() => applyCommand("italic")} />
        <ToolbarButton label="U" title="קו תחתון" onClick={() => applyCommand("underline")} />
        <ToolbarButton label="•" title="רשימה" onClick={() => applyCommand("insertUnorderedList")} />
        <ToolbarButton label="1." title="רשימה ממוספרת" onClick={() => applyCommand("insertOrderedList")} />
        <ToolbarButton label="H" title="כותרת" onClick={() => applyCommand("formatBlock", "h3")} />
        <ToolbarButton label="P" title="פסקה" onClick={() => applyCommand("formatBlock", "p")} />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={syncValue}
        onBlur={syncValue}
        dangerouslySetInnerHTML={{ __html: initialHtml ?? "" }}
        style={{
          minHeight: 140,
          padding: "11px 12px",
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-base)",
          lineHeight: 1.65,
          color: "var(--color-admin-dark)",
          outline: "none",
          direction: "rtl",
        }}
      />
    </div>
  );
}

function ToolbarButton({ label, title, onClick }: { label: string; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        border: "1px solid var(--color-text-on-dark)",
        borderRadius: "var(--shape-radius-xs)",
        background: "var(--color-surface-raised)",
        color: "var(--color-admin-dark)",
        fontFamily: "var(--font-family-sans)",
        fontWeight: "var(--font-weight-extrabold)",
        fontSize: "var(--font-size-md)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export function ImagePicker({
  name,
  preview,
  onPreview,
  currentUrl,
}: {
  name: string;
  preview: string | null;
  onPreview: (url: string | null) => void;
  currentUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayed = preview ?? currentUrl ?? null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { onPreview(null); return; }
    if (file.size > MAX_IMAGE_SIZE) {
      e.target.value = "";
      onPreview(null);
      window.alert("התמונה גדולה מדי. אפשר להעלות תמונה עד 9MB.");
      return;
    }
    onPreview(URL.createObjectURL(file));
  }

  return (
    <div>
      <input ref={inputRef} name={name} type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
      {displayed ? (
        <div style={{ position: "relative", width: "100%", height: 140, borderRadius: "var(--shape-radius-sm)", overflow: "hidden", border: "1px solid var(--color-border-subtle)" }}>
          <img src={displayed} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <button
            type="button"
            onClick={() => { onPreview(null); if (inputRef.current) inputRef.current.value = ""; }}
            style={{ position: "absolute", top: 8, left: 8, width: 28, height: 28, background: "color-mix(in srgb, var(--color-overlay) 6%, transparent)", color: "var(--color-surface-raised)", border: "none", borderRadius: "var(--shape-radius-circle)", fontSize: "var(--font-size-sm)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{ position: "absolute", bottom: 8, left: 8, padding: "4px 10px", background: "color-mix(in srgb, var(--color-overlay) 6%, transparent)", color: "var(--color-surface-raised)", border: "none", borderRadius: "var(--shape-radius-pill)", fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", cursor: "pointer" }}
          >
            החלף
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ width: "100%", padding: "24px 0", border: "1.5px dashed var(--color-text-on-dark)", borderRadius: "var(--shape-radius-sm)", background: "var(--color-surface-muted)", cursor: "pointer", fontSize: "var(--font-size-md)", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontSize: "var(--font-size-4xl)" }}>📷</span>
          לחץ להעלאת תמונה
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
  boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)",
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
const submitStyle = (pending: boolean): React.CSSProperties => ({
  marginTop: 4,
  padding: "11px 24px",
  background: pending ? "var(--color-text-tertiary)" : "var(--color-brand-blue)",
  color: "var(--color-surface-raised)",
  border: "none",
  borderRadius: "var(--shape-radius-sm)",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-bold)",
  fontSize: "var(--font-size-lg)",
  cursor: pending ? "not-allowed" : "pointer",
});

const choiceStyle = (active: boolean): React.CSSProperties => ({
  minHeight: 42,
  border: `1px solid ${active ? "var(--color-brand-blue)" : "var(--color-text-on-dark)"}`,
  borderRadius: "var(--shape-radius-sm)",
  background: active ? "var(--color-blue-50)" : "var(--color-surface-raised)",
  color: active ? "var(--color-brand-blue)" : "var(--color-slate-600)",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 12px",
  fontFamily: "var(--font-family-sans)",
  fontSize: "var(--font-size-md)",
  fontWeight: "var(--font-weight-bold)",
  cursor: "pointer",
});
