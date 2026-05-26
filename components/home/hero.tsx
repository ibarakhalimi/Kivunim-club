type Item = {
  emoji: string;
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  anim: 1 | 2 | 3 | 4;
  delay: string;
  dur: string;
};

const ITEMS: Item[] = [
  // ── TOP ROW (above title) ────────────────────────────────
  { emoji: "🎫", size: 52, top: "6%",  left: "6%",   anim: 1, delay: "0s",   dur: "3.2s" },
  { emoji: "🌟", size: 40, top: "2%",  left: "44%",  anim: 3, delay: "0.6s", dur: "2.6s" },
  { emoji: "👽", size: 60, top: "5%",  right: "7%",  anim: 2, delay: "0.3s", dur: "2.9s" },

  // ── SIDES (flanking the title) ───────────────────────────
  { emoji: "🎤", size: 44, top: "50%", left: "2%",   anim: 4, delay: "0.8s", dur: "3.1s" },
  { emoji: "🔮", size: 48, top: "48%", right: "2%",  anim: 1, delay: "0.4s", dur: "3.5s" },
];

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 24px 48px",
        background:
          "radial-gradient(ellipse at 50% 0%, #D3E7FF 0%, #EAF4FF 50%, var(--color-bg-primary) 100%)",
      }}
    >
      {/* Floating emojis */}
      {ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            fontSize: item.size,
            lineHeight: 1,
            animation: `kv-float-${item.anim} ${item.dur} ease-in-out ${item.delay} infinite`,
            filter:
              "drop-shadow(0 6px 14px rgba(0,0,0,0.18)) drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Title block */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            background:
              "linear-gradient(135deg, #3B82F6 0%, #2563EB 40%, #1D4ED8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          מועדון סטודנטים
        </h1>

        <p
          style={{
            margin: "18px 0 0",
            display: "inline-block",
            padding: "7px 20px 8px",
            background: "var(--color-text-primary)",
            color: "var(--color-accent-highlight)",
            borderRadius: 999,
            fontFamily: "var(--font-heebo)",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.04em",
          }}
        >
          Ashdod Student Club
        </p>
      </div>
    </section>
  );
}
