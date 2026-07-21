"use client";

import { useActionState, useRef, useState } from "react";
import { Bold, ChevronDown, Eye, EyeOff, Italic, List, ListOrdered, Plus, Save, Trash2 } from "lucide-react";
import { createImportantInfoPage, deleteImportantInfoPage, updateImportantInfoPage, type ImportantInfoPage } from "./actions";

type State = {
  success?: boolean;
  error?: string;
};

const initialState: State = {};

const EMPTY_INFO_PAGE: ImportantInfoPage = {
  id: "new",
  title: "",
  subtitle: "",
  content_html: "<p></p>",
  is_active: true,
  sort_order: 0,
};

function RichTextEditor({
  initialHtml,
  inputName,
}: {
  initialHtml: string;
  inputName: string;
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [html, setHtml] = useState(initialHtml);

  function wrapSelection(before: string, after: string) {
    const editor = editorRef.current;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = html.slice(start, end);
    const nextHtml = `${html.slice(0, start)}${before}${selected || "טקסט"}${after}${html.slice(end)}`;
    setHtml(nextHtml);

    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start + before.length, start + before.length + (selected || "טקסט").length);
    });
  }

  function wrapLines(listTag: "ul" | "ol") {
    const editor = editorRef.current;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = html.slice(start, end) || "פריט";
    const items = selected
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<li>${line}</li>`)
      .join("");
    const nextHtml = `${html.slice(0, start)}<${listTag}>${items}</${listTag}>${html.slice(end)}`;
    setHtml(nextHtml);

    requestAnimationFrame(() => editor.focus());
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button type="button" aria-label="מודגש" title="מודגש" onClick={() => wrapSelection("<strong>", "</strong>")} style={toolbarButtonStyle}>
          <Bold size={16} strokeWidth={2.3} />
        </button>
        <button type="button" aria-label="נטוי" title="נטוי" onClick={() => wrapSelection("<em>", "</em>")} style={toolbarButtonStyle}>
          <Italic size={16} strokeWidth={2.3} />
        </button>
        <button type="button" aria-label="רשימה" title="רשימה" onClick={() => wrapLines("ul")} style={toolbarButtonStyle}>
          <List size={16} strokeWidth={2.3} />
        </button>
        <button type="button" aria-label="רשימה ממוספרת" title="רשימה ממוספרת" onClick={() => wrapLines("ol")} style={toolbarButtonStyle}>
          <ListOrdered size={16} strokeWidth={2.3} />
        </button>
      </div>
      <textarea
        ref={editorRef}
        name={inputName}
        value={html}
        onChange={(event) => setHtml(event.target.value)}
        placeholder="<p>כתוב כאן את פירוט התוכן...</p>"
        style={{
          minHeight: 120,
          border: "1px solid var(--color-text-on-dark)",
          borderRadius: "var(--shape-radius-lg)",
          background: "var(--color-surface-raised)",
          padding: "11px 12px",
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-weight-semibold)",
          lineHeight: 1.65,
          color: "var(--color-admin-ink)",
          outline: "none",
          resize: "vertical",
          direction: "rtl",
          fontFamily: "var(--font-family-sans)",
        }}
      />
    </div>
  );
}

function DeleteInfoPageButton({ pageId }: { pageId: string }) {
  const [state, formAction, isPending] = useActionState(async (_state: State, formData: FormData) => {
    return deleteImportantInfoPage(formData);
  }, initialState);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <input type="hidden" name="id" value={pageId} />
      {state.error && (
        <p style={{ margin: 0, color: "var(--color-danger)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        onClick={(event) => {
          if (!window.confirm("למחוק את עמוד המידע הזה?")) {
            event.preventDefault();
          }
        }}
        style={{
          width: "100%",
          height: 42,
          borderRadius: "var(--shape-radius-xl)",
          border: "1px solid var(--color-red-200)",
          background: "var(--color-red-50)",
          color: "var(--color-danger)",
          fontSize: "var(--font-size-md)",
          fontWeight: "var(--font-weight-black)",
          fontFamily: "var(--font-family-sans)",
          cursor: isPending ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        <Trash2 size={15} strokeWidth={2.3} />
        {isPending ? "מוחק..." : "מחיקת עמוד מידע"}
      </button>
    </form>
  );
}

function InfoPageForm({ page, mode = "edit" }: { page: ImportantInfoPage; mode?: "edit" | "create" }) {
  const [state, formAction, isPending] = useActionState(async (_state: State, formData: FormData) => {
    return mode === "create" ? createImportantInfoPage(formData) : updateImportantInfoPage(formData);
  }, initialState);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 14px 14px" }}>
      <form
        action={formAction}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        {mode === "edit" && <input type="hidden" name="id" value={page.id} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 84px", gap: 8 }}>
        <label style={fieldWrapStyle}>
          <span style={labelStyle}>כותרת</span>
          <input name="title" type="text" required defaultValue={page.title} style={inputStyle} />
        </label>
        <label style={fieldWrapStyle}>
          <span style={labelStyle}>סדר</span>
          <input name="sort_order" type="number" defaultValue={page.sort_order} style={inputStyle} />
        </label>
      </div>

      <label style={fieldWrapStyle}>
        <span style={labelStyle}>כותרת משנה</span>
        <input
          name="subtitle"
          type="text"
          defaultValue={page.subtitle}
          placeholder="טקסט קצר שיופיע ברשימת מידע חשוב"
          style={inputStyle}
        />
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "fit-content",
          borderRadius: "var(--shape-radius-pill)",
          background: page.is_active ? "var(--color-emerald-50)" : "var(--color-surface-soft)",
          color: page.is_active ? "var(--color-green-700)" : "var(--color-text-secondary)",
          padding: "7px 10px",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-black)",
          cursor: "pointer",
        }}
      >
        <input name="is_active" type="checkbox" defaultChecked={page.is_active} style={{ width: 16, height: 16, accentColor: "var(--color-success)" }} />
        {page.is_active ? <Eye size={15} strokeWidth={2.2} /> : <EyeOff size={15} strokeWidth={2.2} />}
        להציג באפליקציה
      </label>

      <div style={fieldWrapStyle}>
        <span style={labelStyle}>פירוט תוכן</span>
        <RichTextEditor initialHtml={page.content_html} inputName="content_html" />
      </div>

      {state.error && (
        <p style={{ margin: 0, color: "var(--color-danger)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>{state.error}</p>
      )}
      {state.success && (
        <p style={{ margin: 0, color: "var(--color-green-700)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>
          {mode === "create" ? "עמוד המידע נוצר" : "עמוד המידע נשמר"}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: "100%",
          height: 44,
          borderRadius: "var(--shape-radius-xl)",
          border: "none",
          background: isPending ? "var(--color-text-tertiary)" : "var(--color-brand-blue)",
          color: "var(--color-on-accent)",
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-weight-black)",
          fontFamily: "var(--font-family-sans)",
          cursor: isPending ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        {mode === "create" ? <Plus size={16} strokeWidth={2.3} /> : <Save size={16} strokeWidth={2.3} />}
        {isPending ? "שומר..." : mode === "create" ? "יצירת עמוד מידע" : "שמירה"}
      </button>

      </form>

      {mode === "edit" && <DeleteInfoPageButton pageId={page.id} />}
    </div>
  );
}

function InfoPageAccordionItem({
  page,
  isOpen,
  onToggle,
}: {
  page: ImportantInfoPage;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      style={{
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--shape-radius-2xl)",
        background: isOpen ? "var(--color-surface-muted)" : "var(--color-surface-raised)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          padding: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          cursor: "pointer",
          textAlign: "right",
          fontFamily: "var(--font-family-sans)",
        }}
      >
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", marginBottom: 5, fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-ink)" }}>
            {page.title}
          </span>
          {page.subtitle && (
            <span style={{ display: "block", margin: "0 0 7px", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {page.subtitle}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span
              style={{
                borderRadius: "var(--shape-radius-pill)",
                background: page.is_active ? "var(--color-emerald-50)" : "var(--color-surface-soft)",
                color: page.is_active ? "var(--color-green-700)" : "var(--color-text-secondary)",
                padding: "4px 8px",
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-black)",
              }}
            >
              {page.is_active ? "מוצג באפליקציה" : "מוסתר"}
            </span>
            <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-extrabold)", color: "var(--color-text-tertiary)" }}>
              סדר {page.sort_order}
            </span>
          </span>
        </span>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: "var(--shape-radius-md)",
            background: "var(--color-blue-50)",
            color: "var(--color-brand-blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 180ms ease",
          }}
        >
          <ChevronDown size={18} strokeWidth={2.4} />
        </span>
      </button>

      {isOpen && <InfoPageForm page={page} />}
    </article>
  );
}

export function ImportantInfoPanel({ pages }: { pages: ImportantInfoPage[] }) {
  const [openPageId, setOpenPageId] = useState<string | null>(pages[0]?.id ?? null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <article
        style={{
          border: "1px solid var(--color-blue-200)",
          borderRadius: "var(--shape-radius-2xl)",
          background: createOpen ? "var(--color-blue-50)" : "var(--color-surface-raised)",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setCreateOpen((current) => !current);
            setOpenPageId(null);
          }}
          aria-expanded={createOpen}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            padding: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            cursor: "pointer",
            textAlign: "right",
            fontFamily: "var(--font-family-sans)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <span style={{ width: 34, height: 34, borderRadius: "var(--shape-radius-md)", background: "var(--color-blue-100)", color: "var(--color-brand-blue)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Plus size={18} strokeWidth={2.4} />
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", marginBottom: 3, fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-ink)" }}>
                הוספת עמוד מידע חדש
              </span>
              <span style={{ display: "block", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-secondary)" }}>
                יצירת כותרת, כותרת משנה ופירוט תוכן
              </span>
            </span>
          </span>
          <span style={{ transform: createOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms ease", color: "var(--color-brand-blue)", flexShrink: 0 }}>
            <ChevronDown size={18} strokeWidth={2.4} />
          </span>
        </button>

        {createOpen && <InfoPageForm page={EMPTY_INFO_PAGE} mode="create" />}
      </article>

      {pages.map((page) => (
        <InfoPageAccordionItem
          key={page.id}
          page={page}
          isOpen={openPageId === page.id}
          onToggle={() => {
            setCreateOpen(false);
            setOpenPageId((current) => (current === page.id ? null : page.id));
          }}
        />
      ))}
    </div>
  );
}

const fieldWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const toolbarButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "var(--shape-radius-md)",
  border: "1px solid var(--color-text-on-dark)",
  background: "var(--color-surface-raised)",
  color: "var(--color-admin-ink)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  fontSize: "var(--font-size-sm)",
  fontWeight: "var(--font-weight-extrabold)",
  color: "var(--color-text-secondary)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 42,
  border: "1px solid var(--color-text-on-dark)",
  borderRadius: "var(--shape-radius-lg)",
  background: "var(--color-surface-raised)",
  padding: "0 10px",
  fontFamily: "var(--font-family-sans)",
  fontSize: "var(--font-size-base)",
  fontWeight: "var(--font-weight-bold)",
  color: "var(--color-admin-ink)",
  outline: "none",
};
