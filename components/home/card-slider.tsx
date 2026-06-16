"use client";

import { useState } from "react";

export type SliderPost = {
  id: string;
  title: string;
  link_url: string;
  button_text: string;
  background_image_url: string;
};

const CARDS = [
  {
    id: "study-space",
    title: "מרחבי למידה פתוחים השבוע",
    link_url: "#",
    button_text: "לפרטים",
    background_image_url: "",
    bg: "#EEF2FF",
    accent: "#4338CA",
  },
  {
    id: "community",
    title: "פעילות קהילה חדשה בדרך",
    link_url: "#",
    button_text: "לפרטים",
    background_image_url: "",
    bg: "#ECFDF5",
    accent: "#047857",
  },
  {
    id: "benefits",
    title: "הטבות שוות לסטודנטים",
    link_url: "#",
    button_text: "לפרטים",
    background_image_url: "",
    bg: "#FCE7F3",
    accent: "#DB2777",
  },
  {
    id: "exams",
    title: "כלים שיעזרו בתקופת מבחנים",
    link_url: "#",
    button_text: "לפרטים",
    background_image_url: "",
    bg: "#FFFBEB",
    accent: "#B45309",
  },
];

export function CardSlider({ posts = [] }: { posts?: SliderPost[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = posts.length > 0
    ? posts.map((post, index) => ({
        ...post,
        bg: ["#EEF2FF", "#ECFDF5", "#FCE7F3", "#FFFBEB"][index % 4],
        accent: ["#4338CA", "#047857", "#DB2777", "#B45309"][index % 4],
      }))
    : CARDS;

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const slideWidth = element.clientWidth + 12;
    const index = Math.round(Math.abs(element.scrollLeft) / slideWidth);
    setActiveIndex(Math.min(index, cards.length - 1));
  }

  return (
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
        }}
      >
        {cards.map((card) => (
          <a
            key={card.id}
            href={card.link_url}
            style={{
              flex: "0 0 100%",
              aspectRatio: "1.82 / 1",
              borderRadius: 22,
              background: card.background_image_url ? `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.54)), url(${card.background_image_url}) center / cover` : card.bg,
              border: "1px solid #E2E8F0",
              scrollSnapAlign: "start",
              position: "relative",
              overflow: "hidden",
              padding: 18,
              display: "flex",
              alignItems: "flex-end",
              textDecoration: "none",
            }}
          >
            {!card.background_image_url && (
              <>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.72), transparent 52%), repeating-linear-gradient(135deg, rgba(15,23,42,0.06) 0 1px, transparent 1px 15px)",
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    width: 74,
                    height: 48,
                    borderRadius: 16,
                    border: `2px solid ${card.accent}`,
                    opacity: 0.18,
                    transform: "rotate(-8deg)",
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 34,
                    left: 62,
                    width: 88,
                    height: 54,
                    borderRadius: 18,
                    background: card.accent,
                    opacity: 0.1,
                    transform: "rotate(7deg)",
                  }}
                />
              </>
            )}
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
              <h3
                style={{
                  margin: 0,
                  flex: "0 1 66%",
                  maxWidth: "66%",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 23,
                  lineHeight: 1.16,
                  color: card.background_image_url ? "#fff" : "#0F172A",
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
              <span
                style={{
                  flexShrink: 0,
                  maxWidth: "34%",
                  padding: "7px 12px",
                  borderRadius: 999,
                  background: card.background_image_url ? "rgba(255,255,255,0.92)" : card.accent,
                  color: card.background_image_url ? "#0F172A" : "#fff",
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
            </div>
          </a>
        ))}
      </div>

      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          marginTop: 8,
        }}
      >
        {cards.map((_, index) => (
          <span
            key={index}
            style={{
              width: activeIndex === index ? 18 : 6,
              height: 6,
              borderRadius: 99,
              background: activeIndex === index ? "#0F172A" : "rgba(15,23,42,0.18)",
              transition: "width 0.24s ease, background 0.24s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
