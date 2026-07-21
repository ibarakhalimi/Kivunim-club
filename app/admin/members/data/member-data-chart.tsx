"use client";

import { useState } from "react";
import { Building2, MapPin } from "lucide-react";

type DataPoint = { label: string; value: number };
type TabKey = "institution" | "region";

const TABS = [
  { key: "institution" as const, label: "מוסד לימוד", Icon: Building2 },
  { key: "region" as const, label: "אזור מגורים", Icon: MapPin },
];

export function MemberDataChart({ institutionData, regionData }: { institutionData: DataPoint[]; regionData: DataPoint[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("institution");
  const data = activeTab === "institution" ? institutionData : regionData;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-2xl)", padding: 16, boxShadow: "0 1px 3px color-mix(in srgb, var(--color-overlay) 5%, transparent)" }}>
      <div role="tablist" aria-label="סוג נתוני חברים" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginBottom: 22 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              style={{ minHeight: 46, border: `1px solid ${isActive ? "var(--color-violet-500)" : "var(--color-border-subtle)"}`, borderRadius: "var(--shape-radius-xl)", background: isActive ? "var(--color-violet-100)" : "var(--color-surface-muted)", color: isActive ? "var(--color-violet-400)" : "var(--color-text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-black)", cursor: "pointer" }}
            >
              <tab.Icon size={18} strokeWidth={2.25} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 18 }}>
        <h2 style={{ margin: 0, color: "var(--color-admin-ink)", fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-black)" }}>
          התפלגות לפי {activeTab === "institution" ? "מוסד לימוד" : "אזור מגורים"}
        </h2>
        <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)" }}>{total} חברים</span>
      </div>

      {data.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)", fontWeight: "var(--font-weight-bold)" }}>אין נתונים להצגה</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {data.map((item) => {
            const width = Math.max((item.value / maxValue) * 100, 2);
            const percentage = total ? Math.round((item.value / total) * 100) : 0;

            return (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: "var(--color-admin-ink)", fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-extrabold)" }}>{item.label}</span>
                  <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-black)", direction: "ltr" }}>{item.value} · {percentage}%</span>
                </div>
                <div style={{ height: 12, borderRadius: "var(--shape-radius-pill)", background: "var(--color-surface-muted)", overflow: "hidden" }}>
                  <div style={{ width: `${width}%`, height: "100%", borderRadius: "var(--shape-radius-pill)", background: "linear-gradient(90deg, var(--color-violet-700), var(--color-violet-400))", transition: "width 0.3s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
