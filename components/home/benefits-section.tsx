"use client";

import { useState } from "react";
import type { Tables } from "@/src/types/database";

type Benefit = Tables<"benefits">;

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (benefits.length === 0) return null;

  return (
    <section style={{ padding: "4px 16px 8px" }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          paddingInline: 2,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "-0.018em",
            color: "var(--color-text-primary)",
          }}
        >
          הטבות ומבצעים
        </h2>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent-secondary)" }}>
          כל ההטבות ←
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {benefits.map((b) => {
          const isOpen = openId === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setOpenId(isOpen ? null : b.id)}
              className="kv-tap"
              style={{
                background: b.bg_color,
                border: "2px solid #0F0F0F",
                borderRadius: 0,
                boxShadow: "4px 4px 0 0 #0F0F0F",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {/* Main row */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "rgba(0,0,0,0.5)",
                      background: "rgba(0,0,0,0.10)",
                      border: "1.5px solid rgba(0,0,0,0.18)",
                      padding: "2px 8px 3px",
                      marginBottom: 5,
                    }}
                  >
                    {b.category}
                  </span>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 800,
                      fontSize: 17,
                      lineHeight: 1.15,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {b.business}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 700,
                      fontSize: 20,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {b.deal}
                  </p>
                </div>

                {/* Image — last in JSX = left side in RTL */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 60,
                    height: 60,
                    background: "rgba(0,0,0,0.10)",
                    border: "2px solid rgba(0,0,0,0.18)",
                    overflow: "hidden",
                  }}
                >
                  {b.image_url && (
                    <img
                      src={b.image_url}
                      alt={b.business}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
              </div>

              {/* Accordion panel */}
              {isOpen && (
                <div style={{ borderTop: "2px solid #0F0F0F", padding: "14px 16px 16px" }}>
                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: 14,
                      lineHeight: 1.55,
                      fontWeight: 500,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {b.description}
                  </p>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "13px 0 14px",
                      background: "var(--color-text-primary)",
                      color: "var(--color-accent-highlight)",
                      border: "2px solid #0F0F0F",
                      borderRadius: 0,
                      boxShadow: "3px 3px 0 0 rgba(0,0,0,0.25)",
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 800,
                      fontSize: 16,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    מימוש הטבה
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
