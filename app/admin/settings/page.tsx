import { AppSettingsForm } from "./app-settings-form";
import { getAppSettings, getContactInquiries, getContactSettings, getCurrentWeekStart, getOpeningHoursWeek } from "./actions";
import { SettingsTabs } from "./settings-tabs";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [appSettings, rows, contactSettings, contactInquiries] = await Promise.all([
    getAppSettings(),
    getOpeningHoursWeek(await getCurrentWeekStart()),
    getContactSettings(),
    getContactInquiries(),
  ]);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "24px 16px 46px",
        fontFamily: "var(--font-rubik)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 700 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0F172A" }}>הגדרות</h1>
      </div>

      <AppSettingsForm settings={appSettings} />

      <SettingsTabs
        openingHoursRows={rows}
        contactSettings={contactSettings}
        contactInquiries={contactInquiries}
      />
    </div>
  );
}
