"use client";

import { useRef, useState, useEffect } from "react";

type Update = {
  id: string;
  title: string;
  description: string;
  published_at: string;
  author: string;
};

const GAP = 16;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `לפני ${mins} דקות`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `לפני ${hrs} שעות`;
  const days = Math.floor(hrs / 24);
  return `לפני ${days} ימים`;
}

export function UpdateList({ updates }: { updates: Update[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<Update | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / (el.clientWidth + GAP));
      setActiveIndex(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Negative margin wrapper lets shadows bleed outside the visible area */}
        <div style={{ margin: "0 -8px" }}>
        <div
          ref={scrollRef}
          style={{
            overflowX: "auto",
            display: "flex",
            gap: GAP,
            scrollSnapType: "x mandatory",
            scrollPaddingInlineStart: 8,
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            padding: "4px 8px 8px 8px",
          }}
        >
          {/* spacer pushes first card away from the right edge so its shadow shows */}
          <div style={{ flexShrink: 0, width: 2 }} />
          {updates.map((update) => (
            <div
              key={update.id}
              onClick={() => setSelected(update)}
              style={{
                flexShrink: 0,
                width: "100%",
                height: 180,
                borderRadius: 12,
                border: "3px solid #000",
                boxShadow: "5px 5px 0px #000",
                background: "#fff",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: 4,
                padding: "18px 20px",
                cursor: "pointer",
              }}
            >
              <p
                suppressHydrationWarning
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 500,
                  fontSize: 11,
                  color: "#888",
                }}
              >
                {timeAgo(update.published_at)}
              </p>

              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 20,
                  lineHeight: 1.3,
                  color: "#111",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {update.title}
              </p>
            </div>
          ))}
        </div>
        </div>{/* end negative margin wrapper */}

        {/* Pagination dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {updates.map((_, i) => (
            <div
              key={i}
              style={{
                width: activeIndex === i ? 20 : 7,
                height: 7,
                borderRadius: 99,
                background: activeIndex === i ? "#555" : "#ccc",
                transition: "width 0.25s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Full post modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxHeight: "85dvh",
              borderRadius: "16px 16px 0 0",
              background: "#fff",
              border: "1.5px solid #ccc",
              borderBottom: "none",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 20px 16px",
                borderBottom: "1.5px solid #eee",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{
                  alignSelf: "flex-start",
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#888",
                  padding: 0,
                }}
              >
                ✕
              </button>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#111",
                }}
              >
                {selected.title}
              </h2>
              <p
                suppressHydrationWarning
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#999",
                  fontFamily: "var(--font-rubik)",
                }}
              >
                {timeAgo(selected.published_at)} · {selected.author}
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "#333",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selected.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
