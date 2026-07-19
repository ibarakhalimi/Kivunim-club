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
        background: "var(--color-surface-muted)",
        padding: "24px 16px 46px",
        fontFamily: "var(--font-family-sans)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <a href="/admin" style={{ fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: "var(--font-weight-bold)" }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontSize: "var(--font-size-4xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-dark)" }}>הגדרות</h1>
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
