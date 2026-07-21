"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BarChart3, ClipboardList, FileText, Gift, Inbox, Lightbulb, LogIn, Mail, Megaphone, Settings, Ticket, Users } from "lucide-react";

const contentSubItems = [
  { label: "עדכונים", href: "/admin/content?tab=updates", tab: "updates", Icon: Megaphone },
  { label: "אירועים", href: "/admin/content?tab=events", tab: "events", Icon: Ticket },
  { label: "הטבות", href: "/admin/content?tab=benefits", tab: "benefits", Icon: Gift },
  { label: "עמודי מידע", href: "/admin/content?tab=info", tab: "info", Icon: ClipboardList },
];

const inquirySubItems = [
  { label: "פניות", href: "/admin/inquiries?tab=inquiries", tab: "inquiries", Icon: Mail },
  { label: "רעיונות", href: "/admin/inquiries?tab=ideas", tab: "ideas", Icon: Lightbulb },
];

const CONTENT_PATHS = ["/admin/content"];
const INQUIRY_PATHS = ["/admin/inquiries", "/admin/ideas"];

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
  { label: "חברי מועדון", href: "/admin/members", Icon: Users, match: (path: string) => path.startsWith("/admin/members") },
  {
    label: "פניות",
    href: "/admin/inquiries",
    Icon: Inbox,
    match: (path: string) => INQUIRY_PATHS.some((item) => path === item || path.startsWith(`${item}/`)),
    subItems: inquirySubItems,
  },
  { label: "הגדרות", href: "/admin/settings", Icon: Settings, match: (path: string) => path.startsWith("/admin/settings") },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeContentTab = searchParams.get("tab") ?? "updates";
  const activeInquiryTab = pathname.startsWith("/admin/ideas") ? "ideas" : searchParams.get("tab") ?? "inquiries";

  return (
    <aside
      className="kv-admin-sidebar"
      aria-label="תפריט ניהול"
      style={{
        width: 236,
        minHeight: "100dvh",
        background: "var(--color-admin-dark)",
        borderLeft: "1px solid color-mix(in srgb, var(--color-on-accent) 8%, transparent)",
        padding: "20px 14px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        flexShrink: 0,
      }}
    >
      <div style={{ marginBottom: 22, padding: "0 6px" }}>
        <p style={{ margin: "0 0 4px", fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-black)", color: "var(--color-on-accent)" }}>
          פאנל ניהול
        </p>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-tertiary)" }}>
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
                  borderRadius: "var(--shape-radius-lg)",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                  background: active ? "var(--color-surface-tinted)" : "transparent",
                  color: active ? "var(--color-admin-ink)" : "var(--color-text-on-dark)",
                  fontSize: "var(--font-size-base)",
                  fontWeight: "var(--font-weight-black)",
                }}
              >
                <Icon size={18} strokeWidth={2.2} />
                <span>{label}</span>
              </Link>

              {subItems && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingRight: 14 }}>
                  {subItems.map((subItem) => {
                    const subActive =
                      (pathname === "/admin/content" && activeContentTab === subItem.tab) ||
                      ((pathname === "/admin/inquiries" || pathname.startsWith("/admin/ideas")) && activeInquiryTab === subItem.tab);
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        aria-current={subActive ? "page" : undefined}
                        style={{
                          minHeight: 34,
                          borderRadius: "var(--shape-radius-md)",
                          padding: "0 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          textDecoration: "none",
                          background: subActive ? "color-mix(in srgb, var(--color-surface-tinted) 12%, transparent)" : "transparent",
                          color: subActive ? "var(--color-surface-raised)" : "var(--color-text-tertiary)",
                          fontSize: "var(--font-size-md)",
                          fontWeight: "var(--font-weight-extrabold)",
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
