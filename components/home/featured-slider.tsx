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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const activeSlide = slides[activeIndex];
  const slideGap = 12;

  function showPreviousSlide() {
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  function showNextSlide() {
    setActiveIndex((current) => Math.min(slides.length - 1, current + 1));
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null) return;

    const deltaX = clientX - touchStartX;
    const swipeThreshold = 42;

    if (Math.abs(deltaX) >= swipeThreshold) {
      if (deltaX > 0) {
        showPreviousSlide();
      } else {
        showNextSlide();
      }
    }

    setTouchStartX(null);
    setDragOffsetX(0);
  }

  return (
    <section
      aria-label="תוכן מומלץ"
      style={{
        width: "100%",
        overflow: "visible",
        padding: "0 0 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "calc(100% + 36px)",
          margin: "-18px -18px -26px",
          overflow: "hidden",
          padding: "18px 18px 26px",
          boxSizing: "border-box",
          touchAction: "pan-y",
          direction: "ltr",
        }}
      >
        <div
          onTouchStart={(event) => {
            setTouchStartX(event.touches[0]?.clientX ?? null);
            setDragOffsetX(0);
          }}
          onTouchMove={(event) => {
            if (touchStartX === null) return;

            const deltaX = (event.touches[0]?.clientX ?? touchStartX) - touchStartX;
            const isDraggingPastStart = activeIndex === 0 && deltaX > 0;
            const isDraggingPastEnd = activeIndex === slides.length - 1 && deltaX < 0;
            const resistedDelta = isDraggingPastStart || isDraggingPastEnd ? deltaX * 0.22 : deltaX;

            setDragOffsetX(Math.max(-110, Math.min(110, resistedDelta)));
          }}
          onTouchCancel={() => {
            setTouchStartX(null);
            setDragOffsetX(0);
          }}
          onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? touchStartX ?? 0)}
          style={{
            width: "100%",
            display: "flex",
            gap: slideGap,
            transform: `translate3d(calc(${dragOffsetX}px - ${activeIndex * 100}% - ${activeIndex * slideGap}px), 0, 0)`,
            transition: touchStartX === null ? "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            willChange: "transform",
          }}
        >
          {slides.map((slide) => (
            <article
              key={slide.title}
              style={{
                flex: "0 0 100%",
                height: 212,
                borderRadius: 18,
                background: "#EFF2EC",
                border: "1px solid rgba(255,255,255,0.45)",
                padding: "14px 18px 18px",
                boxSizing: "border-box",
                boxShadow: "0 12px 30px rgba(41,8,0,0.08)",
                direction: "rtl",
              }}
            >
              <div
                style={{
                  width: "100%",
                  minWidth: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    width: "fit-content",
                    margin: 0,
                    borderRadius: 999,
                    background: `${slide.accent}18`,
                    padding: "4px 9px",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 900,
                    fontSize: 11,
                    lineHeight: 1.1,
                    color: slide.accent,
                  }}
                >
                  {slide.eyebrow}
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
                    {slide.title}
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
                    {slide.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
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
