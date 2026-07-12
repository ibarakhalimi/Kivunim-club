"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BarChart3, FileText, Gift, Inbox, LogIn, Megaphone, Settings, Ticket } from "lucide-react";

const contentSubItems = [
  { label: "עדכונים", href: "/admin/content?tab=updates", tab: "updates", Icon: Megaphone },
  { label: "אירועים", href: "/admin/content?tab=events", tab: "events", Icon: Ticket },
  { label: "הטבות", href: "/admin/content?tab=benefits", tab: "benefits", Icon: Gift },
];

const CONTENT_PATHS = ["/admin/content"];

const items = [
  { label: "דשבורד ראשי", href: "/admin", Icon: BarChart3, match: (path: string) => path === "/admin" },
  {
    label: "ניהול תוכן",
    href: "/admin/content",
    Icon: FileText,
    match: (path: string) => CONTENT_PATHS.some((item) => path === item || path.startsWith(`${item}/`)),
    subItems: contentSubItems,
  },
  { label: "הגעות", href: "/admin/check-ins", Icon: LogIn, match: (path: string) => path.startsWith("/admin/check-ins") },
  { label: "פניות", href: "/admin/inquiries", Icon: Inbox, match: (path: string) => path.startsWith("/admin/inquiries") || path.startsWith("/admin/ideas") },
  { label: "הגדרות", href: "/admin/settings", Icon: Settings, match: (path: string) => path.startsWith("/admin/settings") },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeContentTab = searchParams.get("tab") ?? "updates";

  return (
    <aside
      className="kv-admin-sidebar"
      aria-label="תפריט ניהול"
      style={{
        width: 236,
        minHeight: "100dvh",
        background: "#0F172A",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        padding: "20px 14px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        flexShrink: 0,
      }}
    >
      <div style={{ marginBottom: 22, padding: "0 6px" }}>
        <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: "#FFFFFF" }}>
          פאנל ניהול
        </p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>
          מועדון כיוונים
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map(({ label, href, Icon, match, subItems }) => {
          const active = match(pathname);
          return (
            <div key={href} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                style={{
                  minHeight: 44,
                  borderRadius: 12,
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                  background: active ? "#F7F8FF" : "transparent",
                  color: active ? "#0F172A" : "#CBD5E1",
                  fontSize: 14,
                  fontWeight: 900,
                }}
              >
                <Icon size={18} strokeWidth={2.2} />
                <span>{label}</span>
              </Link>

              {subItems && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingRight: 14 }}>
                  {subItems.map((subItem) => {
                    const subActive = pathname === "/admin/content" && activeContentTab === subItem.tab;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        aria-current={subActive ? "page" : undefined}
                        style={{
                          minHeight: 34,
                          borderRadius: 10,
                          padding: "0 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          textDecoration: "none",
                          background: subActive ? "rgba(247,248,255,0.12)" : "transparent",
                          color: subActive ? "#FFFFFF" : "#94A3B8",
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        <subItem.Icon size={15} strokeWidth={2.2} />
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
