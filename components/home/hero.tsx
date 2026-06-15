export function Hero() {
  return (
    <section
      style={{
        padding: "32px 20px 28px",
        background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 32,
          lineHeight: 1.15,
          color: "#0F172A",
        }}
      >
        מועדון סטודנטים
      </h1>
      <p
        style={{
          margin: "10px 0 0",
          display: "inline-block",
          padding: "5px 16px",
          background: "#1E40AF",
          color: "#fff",
          borderRadius: 999,
          fontFamily: "var(--font-rubik)",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        מועדון הסטודנטים של אשדוד
      </p>
    </section>
  );
}
