export default function AdminPage() {
  const sections = [
    { label: "עדכונים", emoji: "📢", href: "/admin/content?tab=updates", bg: "#FFFBEB", color: "#B45309" },
    { label: "אירועים", emoji: "📅", href: "/admin/content?tab=events", bg: "#EFF6FF", color: "#1E40AF" },
    { label: "הטבות",   emoji: "🎁", href: "/admin/content?tab=benefits", bg: "#F0FDF4", color: "#15803D" },
    { label: "סקרים",   emoji: "📊", href: "/admin/polls", bg: "#F5F3FF", color: "#6D28D9" },
    { label: "פניות",   emoji: "✉️", href: "/admin/inquiries", bg: "#EEF2FF", color: "#4338CA" },
    { label: "רעיונות", emoji: "💡", href: "/admin/ideas", bg: "#FEFCE8", color: "#A16207" },
    { label: "הגעות",   emoji: "🚪", href: "/admin/check-ins", bg: "#FFF1F2", color: "#BE123C" },
    { label: "הגדרות",  emoji: "⚙️", href: "/admin/settings", bg: "#F0FDF4", color: "#15803D" },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "32px 16px 40px",
        fontFamily: "var(--font-rubik)",
        direction: "rtl",
      }}
    >
      <h1
        style={{
          margin: "0 0 4px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 28,
          color: "#0F172A",
        }}
      >
        פאנל ניהול
      </h1>
      <p
        style={{
          margin: "0 0 28px",
          fontSize: 14,
          color: "#64748B",
          fontWeight: 500,
        }}
      >
        כיוונים · ניהול תוכן
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {sections.map((s) => (
          <a
            key={s.href}
            href={s.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "24px 12px",
              background: s.bg,
              border: "1px solid #E2E8F0",
              borderRadius: 14,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              textDecoration: "none",
              color: s.color,
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            <span style={{ fontSize: 32 }}>{s.emoji}</span>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
