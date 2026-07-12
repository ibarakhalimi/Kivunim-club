"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { AddBenefitForm } from "../benefits/add-benefit-form";
import { AddEventForm } from "../events/add-event-form";
import { AddUpdateForm } from "./updates/add-update-form";

type ContentTab = "updates" | "events" | "benefits";

const labels: Record<ContentTab, string> = {
  updates: "עדכון",
  events: "אירוע",
  benefits: "הטבה",
};

export function ContentCreatePanel({
  activeTab,
  benefitCategories = [],
}: {
  activeTab: ContentTab;
  benefitCategories?: string[];
}) {
  const [open, setOpen] = useState(false);
  const label = labels[activeTab];

  return (
    <div style={{ marginBottom: 24 }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          minHeight: 42,
          border: "none",
          borderRadius: 10,
          background: "#0F172A",
          color: "#FFFFFF",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          fontFamily: "var(--font-rubik)",
          fontSize: 14,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        <Plus size={17} strokeWidth={2.5} />
        <span>{open ? "סגירת טופס" : `הוספת ${label}`}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`הוספת ${label}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 620,
              maxHeight: "calc(100dvh - 32px)",
              overflowY: "auto",
              borderRadius: 14,
              background: "#FFFFFF",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.28)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 16px",
                borderBottom: "1px solid #E2E8F0",
                position: "sticky",
                top: 0,
                zIndex: 1,
                background: "#FFFFFF",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#0F172A" }}>
                הוספת {label}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="סגירת חלון"
                style={{
                  width: 34,
                  height: 34,
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  background: "#FFFFFF",
                  color: "#0F172A",
                  fontSize: 20,
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 16 }}>
              {activeTab === "updates" && <AddUpdateForm />}
              {activeTab === "events" && <AddEventForm />}
              {activeTab === "benefits" && <AddBenefitForm categories={benefitCategories} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
