"use client";

import { useState } from "react";

const CARDS = [
  {
    id: "study-space",
    title: "מרחבי למידה פתוחים השבוע",
    bg: "#EEF2FF",
    accent: "#4338CA",
  },
  {
    id: "community",
    title: "פעילות קהילה חדשה בדרך",
    bg: "#ECFDF5",
    accent: "#047857",
  },
  {
    id: "benefits",
    title: "הטבות שוות לסטודנטים",
    bg: "#FCE7F3",
    accent: "#DB2777",
  },
  {
    id: "exams",
    title: "כלים שיעזרו בתקופת מבחנים",
    bg: "#FFFBEB",
    accent: "#B45309",
  },
];

export function CardSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const slideWidth = element.clientWidth + 12;
    const index = Math.round(Math.abs(element.scrollLeft) / slideWidth);
    setActiveIndex(Math.min(index, CARDS.length - 1));
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
        {CARDS.map((card) => (
          <article
            key={card.id}
            style={{
              flex: "0 0 100%",
              aspectRatio: "1.82 / 1",
              borderRadius: 22,
              background: card.bg,
              border: "1px solid #E2E8F0",
              scrollSnapAlign: "start",
              position: "relative",
              overflow: "hidden",
              padding: 18,
              display: "flex",
              alignItems: "flex-end",
            }}
          >
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
            <h3
              style={{
                position: "relative",
                zIndex: 1,
                margin: 0,
                maxWidth: "78%",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 23,
                lineHeight: 1.16,
                color: "#0F172A",
              }}
            >
              {card.title}
            </h3>
          </article>
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
        {CARDS.map((_, index) => (
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
