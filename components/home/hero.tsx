export function Hero() {
  return (
    <section
      style={{
        padding: "32px 20px 28px",
        background: "linear-gradient(135deg, var(--color-blue-50) 0%, var(--color-green-50) 100%)",
        borderRadius: "var(--shape-radius-2xl)",
        border: "1px solid var(--color-border-subtle)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-family-sans)",
          fontWeight: "var(--font-weight-extrabold)",
          fontSize: "var(--font-size-6xl)",
          lineHeight: 1.15,
          color: "var(--color-ink)",
        }}
      >
        מועדון סטודנטים
      </h1>
      <p
        style={{
          margin: "10px 0 0",
          display: "inline-block",
          padding: "5px 16px",
          background: "var(--color-brand-blue)",
          color: "var(--color-surface-raised)",
          borderRadius: "var(--shape-radius-pill)",
          fontFamily: "var(--font-family-sans)",
          fontWeight: "var(--font-weight-semibold)",
          fontSize: "var(--font-size-base)",
        }}
      >
        מועדון הסטודנטים של אשדוד
      </p>
    </section>
  );
}
