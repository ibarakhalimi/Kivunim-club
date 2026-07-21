"use client";

import { useState } from "react";

type FeaturedUpdate = {
  id: string;
  tab_label: string;
  title: string;
  description: string;
};

export function FeaturedSlider({ updates }: { updates: FeaturedUpdate[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const activeSlide = updates[activeIndex];
  const slideGap = 12;

  if (updates.length === 0 || !activeSlide) return null;

  function showPreviousSlide() {
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  function showNextSlide() {
    setActiveIndex((current) => Math.min(updates.length - 1, current + 1));
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
            const isDraggingPastEnd = activeIndex === updates.length - 1 && deltaX < 0;
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
          {updates.map((update) => (
            <article
              key={update.id}
              style={{
                flex: "0 0 100%",
                height: 232,
                borderRadius: "var(--shape-radius-3xl)",
                background: "var(--color-surface)",
                border: "1px solid color-mix(in srgb, var(--color-on-accent) 45%, transparent)",
                padding: "14px 18px 18px",
                boxSizing: "border-box",
                boxShadow: "0 12px 30px color-mix(in srgb, var(--color-ink) 8%, transparent)",
                direction: "rtl",
              }}
            >
              <div
                style={{
                  width: "90%",
                  minWidth: 0,
                  height: "100%",
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    width: "fit-content",
                    margin: 0,
                    borderRadius: "var(--shape-radius-pill)",
                    background: "color-mix(in srgb, var(--color-brand) 10%, transparent)",
                    padding: "4px 9px",
                    fontFamily: "var(--font-family-sans)",
                    fontWeight: "var(--font-weight-black)",
                    fontSize: "var(--font-size-xs)",
                    lineHeight: 1.1,
                    color: "var(--color-brand)",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {update.tab_label}
                </p>
                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-family-sans)",
                      fontWeight: "var(--font-weight-black)",
                      fontSize: "var(--font-size-4xl)",
                      lineHeight: 1.12,
                      letterSpacing: 0,
                      color: "var(--color-ink)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {update.title}
                  </h2>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontFamily: "var(--font-family-sans)",
                      fontWeight: "var(--font-weight-semibold)",
                      fontSize: "var(--font-size-base)",
                      lineHeight: 1.45,
                      color: "var(--color-ink-soft)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {update.description}
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
        {updates.map((update, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={update.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`סלייד ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              style={{
                width: isActive ? 22 : 8,
                height: 8,
                borderRadius: "var(--shape-radius-pill)",
                border: "none",
                padding: 0,
                background: isActive ? "var(--color-brand)" : "color-mix(in srgb, var(--color-ink) 20%, transparent)",
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
