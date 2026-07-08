"use client";

import { useState } from "react";
import { Clock, ClipboardList, Lightbulb, MessageCircle } from "lucide-react";
import { ContactSettingsPanel } from "./contact-settings-panel";
import { IdeasPanel } from "./ideas-panel";
import { ImportantInfoPanel } from "./important-info-panel";
import { OpeningHoursForm } from "./opening-hours-form";
import type { ContactInquiry, ContactSettings, IdeaSubmission, ImportantInfoPage, OpeningHourWithDate } from "./actions";

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
  {
    key: "info",
    label: "מידע חשוב",
    Icon: ClipboardList,
    title: "מידע חשוב",
    description: "כותרות ותכנים שיופיעו במגירת המידע החשוב.",
  },
  {
    key: "ideas",
    label: "רעיונות",
    Icon: Lightbulb,
    title: "רעיונות",
    description: "הגדרות הטופס והטקסטים של שליחת רעיון חדש.",
  },
] as const;

export function SettingsTabs({
  openingHoursRows,
  contactSettings,
  contactInquiries,
  importantInfoPages,
  ideaSubmissions,
}: {
  openingHoursRows: OpeningHourWithDate[];
  contactSettings: ContactSettings;
  contactInquiries: ContactInquiry[];
  importantInfoPages: ImportantInfoPage[];
  ideaSubmissions: IdeaSubmission[];
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
                border: `1px solid ${isActive ? "#1E40AF" : "#E2E8F0"}`,
                borderRadius: 14,
                background: isActive ? "#EFF6FF" : "#FFFFFF",
                color: isActive ? "#1E40AF" : "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "0 10px",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 13,
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
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "#EFF6FF",
              color: "#1E40AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <activeTab.Icon size={20} strokeWidth={2.25} />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 950, color: "#0F172A" }}>
              {activeTab.title}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 650, lineHeight: 1.45, color: "#64748B" }}>
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
        {activeKey === "info" && (
          <div style={{ marginTop: 16 }}>
            <ImportantInfoPanel pages={importantInfoPages} />
          </div>
        )}
        {activeKey === "ideas" && (
          <div style={{ marginTop: 16 }}>
            <IdeasPanel ideas={ideaSubmissions} />
          </div>
        )}
      </div>
    </section>
  );
}
