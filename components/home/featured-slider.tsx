"use client";

import { useState } from "react";

const SLIDES = [
  { id: "featured-1", title: "מרחבי למידה מומלצים", bg: "linear-gradient(135deg, #DBEAFE 0%, #EEF2FF 46%, #F8FAFC 100%)" },
  { id: "featured-2", title: "פעילויות השבוע", bg: "linear-gradient(135deg, #DCFCE7 0%, #ECFDF5 48%, #F8FAFC 100%)" },
  { id: "featured-3", title: "הטבות חדשות לסטודנטים", bg: "linear-gradient(135deg, #FFE4E6 0%, #FFF1F2 48%, #F8FAFC 100%)" },
  { id: "featured-4", title: "מפגשי קהילה קרובים", bg: "linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 48%, #F8FAFC 100%)" },
  { id: "featured-5", title: "כלים שיעזרו בתקופת מבחנים", bg: "linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 48%, #F8FAFC 100%)" },
];

export function FeaturedSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const slideWidth = element.clientWidth + 12;
    const index = Math.round(Math.abs(element.scrollLeft) / slideWidth);
    setActiveIndex(Math.min(index, SLIDES.length - 1));
  }

  return (
    <section
      style={{
        overflow: "hidden",
      }}
    >
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
        {SLIDES.map((slide) => (
          <article
            key={slide.id}
            style={{
              flex: "0 0 100%",
              minHeight: 178,
              borderRadius: 22,
              background: slide.bg,
              border: "1px solid #E2E8F0",
              overflow: "hidden",
              scrollSnapAlign: "start",
              display: "flex",
              alignItems: "flex-end",
              position: "relative",
              padding: 18,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.95) 0 18%, transparent 19%), linear-gradient(115deg, rgba(15,23,42,0.08), transparent 55%)",
                opacity: 0.82,
              }}
            />
            <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 22,
                  lineHeight: 1.2,
                  color: "#0F172A",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {slide.title}
              </h3>
            </div>
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
        {SLIDES.map((_, index) => (
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
