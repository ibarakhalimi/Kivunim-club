"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePost } from "./actions";

type Post = {
  id: string;
  background_image_url: string | null;
  title: string;
  post_type: string;
  body_text: string | null;
  link_url: string | null;
  button_text: string | null;
  is_active: boolean;
  sort_order: number;
};

const initialState = { error: undefined as string | undefined, success: false };

function ImagePicker({
  preview,
  currentUrl,
  onPreview,
}: {
  preview: string | null;
  currentUrl: string | null;
  onPreview: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayed = preview ?? currentUrl;

  return (
    <div>
      <input
        ref={inputRef}
        name="background_image"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          onPreview(file ? URL.createObjectURL(file) : null);
        }}
      />
      {displayed ? (
        <div
          style={{
            width: "100%",
            aspectRatio: "1.82 / 1",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #E2E8F0",
            background: `url(${displayed}) center / cover`,
            position: "relative",
          }}
        >
          <button type="button" onClick={() => inputRef.current?.click()} style={smallOverlayButton}>
            החלף תמונה
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} style={uploadButton}>
          העלה תמונת רקע
        </button>
      )}
    </div>
  );
}

function EditPostSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  const router = useRouter();
  const [postType, setPostType] = useState<"link" | "text_link">(post.post_type === "text_link" ? "text_link" : "link");
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => (await updatePost(post.id, formData)) as typeof initialState,
    initialState
  );

  useEffect(() => {
    if (!state.success) return;
    onClose();
    router.refresh();
  }, [state.success, onClose, router]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(15,23,42,0.38)",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxHeight: "88dvh",
          background: "#fff",
          borderRadius: "22px 22px 0 0",
          overflowY: "auto",
          direction: "rtl",
          padding: "14px 16px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#0F172A" }}>
            עריכת פוסט
          </h2>
          <button type="button" onClick={onClose} style={closeButton}>✕</button>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="hidden" name="existing_background_image_url" value={post.background_image_url ?? ""} />

          <Field label="סוג פוסט">
            <select name="post_type" value={postType} onChange={(event) => setPostType(event.target.value === "text_link" ? "text_link" : "link")} style={inputStyle}>
              <option value="link">פוסט עם לינק</option>
              <option value="text_link">פוסט עם טקסט ולינק</option>
            </select>
          </Field>

          <Field label="תמונת רקע">
            <ImagePicker preview={preview} currentUrl={post.background_image_url} onPreview={setPreview} />
          </Field>

          <Field label="כותרת *">
            <input name="title" required defaultValue={post.title} style={inputStyle} />
          </Field>

          {postType === "text_link" && (
            <Field label="טקסט ארוך">
              <textarea name="body_text" rows={5} defaultValue={post.body_text ?? ""} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </Field>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="לינק מקשר">
              <input name="link_url" type="url" defaultValue={post.link_url ?? ""} style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
            </Field>
            <Field label="טקסט כפתור">
              <input name="button_text" defaultValue={post.button_text ?? ""} style={inputStyle} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div />
            <Field label="סדר הצגה">
              <input name="sort_order" type="number" defaultValue={post.sort_order} style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
            </Field>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input name="is_active" type="checkbox" defaultChecked={post.is_active} style={{ width: 16, height: 16, accentColor: "#1E40AF" }} />
            <span style={labelStyle}>פעיל בסליידר</span>
          </label>

          {state.error && <p style={{ margin: 0, fontSize: 13, color: "#DC2626", fontWeight: 700 }}>{state.error}</p>}

          <button type="submit" disabled={pending} style={submitButton(pending)}>
            {pending ? "שומר..." : "שמור שינויים"}
          </button>
        </form>
      </div>
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

export function PostList({ posts }: { posts: Post[] }) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (posts.length === 0) return null;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setSelectedPost(post)}
            style={{
              display: "flex",
              gap: 12,
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: 10,
              cursor: "pointer",
              textAlign: "right",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 92,
                height: 64,
                borderRadius: 10,
                flexShrink: 0,
                background: post.background_image_url ? `url(${post.background_image_url}) center / cover` : "linear-gradient(135deg, #E2E8F0, #CBD5E1)",
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 15, color: "#0F172A" }}>{post.title}</p>
              {post.link_url && (
                <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 12, color: "#64748B", direction: "ltr", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {post.link_url}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700 }}>
                <span style={{ color: post.is_active ? "#16A34A" : "#94A3B8" }}>{post.is_active ? "פעיל" : "כבוי"}</span>
                <span style={{ color: "#CBD5E1" }}>•</span>
                <span style={{ color: "#475569" }}>{post.post_type === "text_link" ? "טקסט ולינק" : "לינק"}</span>
                {post.button_text && <span style={{ color: "#CBD5E1" }}>•</span>}
                {post.button_text && <span style={{ color: "#475569" }}>{post.button_text}</span>}
                <span style={{ color: "#CBD5E1" }}>•</span>
                <span style={{ color: "#475569" }}>סדר {post.sort_order}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {selectedPost && <EditPostSheet post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
  fontFamily: "var(--font-rubik)",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "var(--font-rubik)",
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  background: "#fff",
  color: "#0F172A",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  direction: "rtl",
};

const uploadButton: React.CSSProperties = {
  width: "100%",
  aspectRatio: "1.82 / 1",
  border: "1.5px dashed #CBD5E1",
  background: "#F8FAFC",
  borderRadius: 14,
  cursor: "pointer",
  fontSize: 14,
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  color: "#64748B",
};

const smallOverlayButton: React.CSSProperties = {
  position: "absolute",
  bottom: 10,
  left: 10,
  padding: "7px 12px",
  background: "rgba(15,23,42,0.78)",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 12,
  cursor: "pointer",
};

const closeButton: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "none",
  background: "#F1F5F9",
  color: "#64748B",
  cursor: "pointer",
};

const submitButton = (pending: boolean): React.CSSProperties => ({
  marginTop: 4,
  padding: "11px 24px",
  background: pending ? "#94A3B8" : "#1E40AF",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontFamily: "var(--font-rubik)",
  fontWeight: 700,
  fontSize: 15,
  cursor: pending ? "not-allowed" : "pointer",
});
