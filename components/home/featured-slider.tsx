"use client";

import { useState } from "react";

const slides = [
  {
    eyebrow: "הטבה חדשה",
    title: "קפה ומאפה במחיר סטודנטיאלי",
    text: "פותחים את היום עם הטבה לחברי הקלאב בבתי קפה נבחרים בעיר.",
    accent: "#5934ED",
  },
  {
    eyebrow: "אירוע קרוב",
    title: "ערב נטוורקינג לסטודנטים",
    text: "מפגש קליל עם סטודנטים, בוגרים ומעסיקים מקומיים במקום אחד.",
    accent: "#0F766E",
  },
  {
    eyebrow: "עדכון חשוב",
    title: "הקלאב מתרחב עם שירותים חדשים",
    text: "בקרוב יעלו לאפליקציה עוד כלים, הטבות ומידע שימושי לחברי המועדון.",
    accent: "#B45309",
  },
];

export function FeaturedSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  return (
    <section
      aria-label="תוכן מומלץ"
      style={{
        width: "100%",
        overflow: "visible",
        padding: "0 0 14px",
      }}
    >
      <div
        style={{
          height: 172,
          borderRadius: 18,
          background: "#EFF2EC",
          border: "1px solid rgba(255,255,255,0.45)",
          padding: "18px 18px 16px",
          boxSizing: "border-box",
          position: "relative",
          boxShadow: "0 12px 30px rgba(41,8,0,0.08)",
        }}
      >
        <div style={{ width: "90%", minWidth: 0 }}>
          <p
            style={{
              width: "fit-content",
              margin: "0 0 9px",
              borderRadius: 999,
              background: `${activeSlide.accent}18`,
              padding: "4px 9px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 900,
              fontSize: 11,
              lineHeight: 1.1,
              color: activeSlide.accent,
            }}
          >
            {activeSlide.eyebrow}
          </p>
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 22,
                lineHeight: 1.12,
                letterSpacing: 0,
                color: "#290800",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {activeSlide.title}
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: "var(--font-rubik)",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: 1.45,
                color: "#5F544F",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {activeSlide.text}
            </p>
          </div>
        </div>
      </div>
      <div
        aria-label="בחירת סלייד"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 10,
        }}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`סלייד ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              style={{
                width: isActive ? 22 : 8,
                height: 8,
                borderRadius: 999,
                border: "none",
                padding: 0,
                background: isActive ? activeSlide.accent : "rgba(41,8,0,0.2)",
                cursor: "pointer",
                transition: "width 0.18s ease, background 0.18s ease",
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
