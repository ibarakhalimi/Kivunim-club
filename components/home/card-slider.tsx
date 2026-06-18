"use client";

import { useEffect, useState } from "react";

export type SliderPost = {
  id: string;
  title: string;
  short_text: string | null;
  post_type: string;
  body_text: string | null;
  link_url: string | null;
  button_text: string | null;
  background_image_url: string | null;
};

export function CardSlider({ posts = [] }: { posts?: SliderPost[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<SliderPost | null>(null);
  const cards = posts;

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const slideWidth = element.clientWidth + 12;
    const index = Math.round(Math.abs(element.scrollLeft) / slideWidth);
    setActiveIndex(Math.min(index, cards.length - 1));
  }

  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedPost]);

  if (cards.length === 0) return null;

  return (
    <>
    <section style={{ overflow: "hidden" }}>
      <div
        onScroll={handleScroll}
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          direction: "ltr",
        }}
      >
        {cards.map((card) => {
          const hasButton = Boolean(card.link_url && card.button_text);
          const opensSheet = card.post_type === "text_link";
          const baseStyle: React.CSSProperties = {
              flex: "0 0 100%",
              width: "100%",
              minWidth: "100%",
              aspectRatio: "1.82 / 1",
              borderRadius: 22,
              background: card.background_image_url
                ? `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.55)), url(${card.background_image_url}) center / cover`
                : "radial-gradient(ellipse at 20% 20%, #2D3178 0%, #181A23 100%)",
              border: "none",
              scrollSnapAlign: "start",
              position: "relative",
              overflow: "hidden",
              padding: 18,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "flex-end",
              textDecoration: "none",
              cursor: opensSheet || card.link_url ? "pointer" : "default",
              direction: "rtl",
          };
          const content = (
            <>
              <span
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  zIndex: 1,
                  padding: "6px 11px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 800,
                  fontSize: 11,
                  lineHeight: 1,
                  backdropFilter: "blur(10px)",
                }}
              >
                חדש
              </span>
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ flex: "0 1 66%", maxWidth: "66%", minWidth: 0 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 900,
                      fontSize: 26,
                      lineHeight: 1.08,
                      color: "#fff",
                      textAlign: "right",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.title}
                  </h3>
                  {card.short_text && (
                    <p
                      style={{
                        margin: "7px 0 0",
                        fontFamily: "var(--font-rubik)",
                        fontWeight: 600,
                        fontSize: 13,
                        lineHeight: 1.35,
                        color: "rgba(255,255,255,0.76)",
                        textAlign: "right",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {card.short_text}
                    </p>
                  )}
                </div>
                {hasButton && (
                  <span
                    style={{
                      flexShrink: 0,
                      maxWidth: "34%",
                      padding: "7px 12px",
                      borderRadius: 999,
                      background: "#FF2E9A",
                      border: "none",
                      color: "#fff",
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 800,
                      fontSize: 12,
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.button_text}
                  </span>
                )}
              </div>
            </>
          );

          if (opensSheet) {
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedPost(card)}
                style={{ ...baseStyle, width: "100%", textAlign: "right" }}
              >
                {content}
              </button>
            );
          }

          if (card.link_url) {
            return (
              <a key={card.id} href={card.link_url} style={baseStyle}>
                {content}
              </a>
            );
          }

          return (
            <article key={card.id} style={baseStyle}>
              {content}
            </article>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          marginTop: 14,
        }}
      >
        {cards.map((_, index) => (
          <span
            key={index}
            style={{
              width: activeIndex === index ? 18 : 6,
              height: 6,
              borderRadius: 99,
              background: activeIndex === index ? "#FFFFFF" : "rgba(255,255,255,0.25)",
              transition: "width 0.24s ease, background 0.24s ease",
            }}
          />
        ))}
      </div>
    </section>
    {selectedPost && (
      <div
        onClick={() => setSelectedPost(null)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.55)",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            width: "100%",
            maxHeight: "82dvh",
            borderRadius: "26px 26px 0 0",
            background: "#252836",
            border: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            direction: "rtl",
          }}
        >
          <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              style={{
                alignSelf: "flex-start",
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: "#2F3344",
                color: "#9CA0AE",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, lineHeight: 1.22, color: "#FFFFFF" }}>
              {selectedPost.title}
            </h2>
          </div>
          <div style={{ padding: "18px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
            {selectedPost.body_text && (
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 15, lineHeight: 1.75, color: "#9CA0AE", whiteSpace: "pre-wrap" }}>
                {selectedPost.body_text}
              </p>
            )}
            {selectedPost.link_url && selectedPost.button_text && (
              <a
                href={selectedPost.link_url}
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "#FF2E9A",
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 13,
                }}
              >
                {selectedPost.button_text}
              </a>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
