export default function AdminPage() {
  const sections = [
    { label: "עדכונים", emoji: "📢", href: "/admin/updates", bg: "var(--color-card-butter)" },
    { label: "אירועים", emoji: "📅", href: "/admin/events", bg: "var(--color-card-sky)" },
    { label: "הטבות", emoji: "🎁", href: "/admin/benefits", bg: "var(--color-card-mint)" },
    { label: "סקרים", emoji: "📊", href: "/admin/polls", bg: "var(--color-card-peach)" },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg-primary)",
        padding: "32px 16px 40px",
        fontFamily: "var(--font-heebo)",
        direction: "rtl",
      }}
    >
      <h1
        style={{
          margin: "0 0 8px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 30,
          color: "var(--color-text-primary)",
        }}
      >
        פאנל ניהול
      </h1>
      <p
        style={{
          margin: "0 0 32px",
          fontSize: 15,
          color: "var(--color-text-muted)",
          fontWeight: 500,
        }}
      >
        כיוונים · ניהול תוכן
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
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
              padding: "28px 16px",
              background: s.bg,
              border: "2px solid #0F0F0F",
              borderRadius: 0,
              boxShadow: "4px 4px 0 0 #0F0F0F",
              textDecoration: "none",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            <span style={{ fontSize: 36 }}>{s.emoji}</span>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
