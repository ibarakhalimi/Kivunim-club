import { Bell } from "lucide-react";

interface TopBarProps {
  unread?: number;
}

export function TopBar({ unread = 0 }: TopBarProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 20px 14px",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "var(--color-text-primary)",
            color: "var(--color-accent-highlight)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "-0.04em",
            flexShrink: 0,
          }}
        >
          כ
        </div>
        <div style={{ lineHeight: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
            }}
          >
            כיוונים
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--color-text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            מועדון · תל אביב
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Bell */}
        <button
          aria-label="התראות"
          className="kv-tap"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            display: "grid",
            placeItems: "center",
            position: "relative",
            color: "var(--color-text-primary)",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <Bell size={20} strokeWidth={1.8} />
          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                minWidth: 16,
                height: 16,
                padding: "0 4px",
                borderRadius: 999,
                background: "var(--color-accent-primary)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                display: "grid",
                placeItems: "center",
                border: "2px solid var(--color-bg-card)",
              }}
            >
              {unread}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div
          className="kv-tap"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "linear-gradient(135deg, #FFD9B8 0%, #FF8C42 100%)",
            border: "2px solid var(--color-text-primary)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-rubik)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--color-text-primary)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          מ
        </div>
      </div>
    </header>
  );
}
