import { Suspense } from "react";
import { AdminSidebar } from "./admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "var(--color-surface-muted)",
        fontFamily: "var(--font-family-sans)",
      }}
    >
      <style>{`
        .kv-admin-shell {
          display: flex;
          align-items: stretch;
          min-height: 100dvh;
        }

        .kv-admin-main {
          flex: 1;
          min-width: 0;
        }

        .kv-admin-rich-text-editor,
        .kv-admin-rich-text-editor * {
          color: var(--color-admin-ink) !important;
        }

        @media (max-width: 760px) {
          .kv-admin-shell {
            display: block;
          }

          .kv-admin-sidebar {
            width: 100% !important;
            min-height: auto !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 30 !important;
            border-left: none !important;
            border-bottom: 1px solid color-mix(in srgb, var(--color-on-accent) 8%, transparent) !important;
            padding: 12px 10px !important;
          }

          .kv-admin-sidebar nav {
            flex-direction: row !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
            padding-bottom: 2px !important;
          }

          .kv-admin-sidebar nav::-webkit-scrollbar {
            display: none;
          }

          .kv-admin-sidebar a {
            flex: 0 0 auto;
            min-width: max-content;
          }
        }
      `}</style>
      <div className="kv-admin-shell">
        <Suspense fallback={null}>
          <AdminSidebar />
        </Suspense>
        <main className="kv-admin-main">{children}</main>
      </div>
    </div>
  );
}
