"use client";

import { useState } from "react";
import { Clock, MessageCircle } from "lucide-react";
import { ContactSettingsPanel } from "./contact-settings-panel";
import { OpeningHoursForm } from "./opening-hours-form";
import type { ContactInquiry, ContactSettings, OpeningHourWithDate } from "./actions";

const TABS = [
  {
    key: "hours",
    label: "שעות פתיחה",
    Icon: Clock,
    title: "שעות פתיחה",
    description: "עדכון שעות הפתיחה לפי השבוע המוצג והערות שיופיעו בצ׳יפים.",
  },
  {
    key: "contact",
    label: "יצירת קשר",
    Icon: MessageCircle,
    title: "יצירת קשר",
    description: "טלפון, וואטסאפ ונושאי פנייה שיופיעו בפעולות המהירות.",
  },
] as const;

export function SettingsTabs({
  openingHoursRows,
  contactSettings,
  contactInquiries,
}: {
  openingHoursRows: OpeningHourWithDate[];
  contactSettings: ContactSettings;
  contactInquiries: ContactInquiry[];
}) {
  const [activeKey, setActiveKey] = useState<(typeof TABS)[number]["key"]>("hours");
  const activeTab = TABS.find((tab) => tab.key === activeKey) ?? TABS[0];

  return (
    <section style={{ marginBottom: 28 }}>
      <div
        role="tablist"
        aria-label="הגדרות פעולות מהירות"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveKey(tab.key)}
              style={{
                minHeight: 48,
                border: `1px solid ${isActive ? "var(--color-brand-blue)" : "var(--color-border-subtle)"}`,
                borderRadius: "var(--shape-radius-xl)",
                background: isActive ? "var(--color-blue-50)" : "var(--color-surface-raised)",
                color: isActive ? "var(--color-brand-blue)" : "var(--color-slate-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "0 10px",
                fontFamily: "var(--font-family-sans)",
                fontWeight: "var(--font-weight-black)",
                fontSize: "var(--font-size-md)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <tab.Icon size={17} strokeWidth={2.25} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        style={{
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--shape-radius-2xl)",
          padding: 16,
          boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 05%, transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--shape-radius-lg)",
              background: "var(--color-blue-50)",
              color: "var(--color-brand-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <activeTab.Icon size={20} strokeWidth={2.25} />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-dark)" }}>
              {activeTab.title}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-semibold)", lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
              {activeTab.description}
            </p>
          </div>
        </div>
        {activeKey === "hours" && (
          <div style={{ marginTop: 16 }}>
            <OpeningHoursForm rows={openingHoursRows} />
          </div>
        )}
        {activeKey === "contact" && (
          <div style={{ marginTop: 16 }}>
            <ContactSettingsPanel settings={contactSettings} inquiries={contactInquiries} />
          </div>
        )}
      </div>
    </section>
  );
}
