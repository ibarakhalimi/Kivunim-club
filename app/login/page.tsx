"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background:
          "radial-gradient(circle at top, rgba(255, 236, 211, 0.95) 0%, rgba(250, 250, 245, 0.9) 45%, var(--color-bg-primary) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        direction: "rtl",
      }}
    >
      <div style={{ width: "100%", maxWidth: 760, textAlign: "center", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%) scale(1.1)",
            opacity: 0.22,
            fontSize: 112,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          🔐
        </div>

        <p
          style={{
            margin: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "10px 18px",
            borderRadius: 999,
            background: "var(--color-card-butter)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          כניסה
        </p>

        <h1
          style={{
            margin: "28px 0 14px",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            color: "var(--color-text-primary)",
          }}
        >
          התחבר לחשבונך
        </h1>

        <p
          style={{
            margin: "0 auto",
            maxWidth: 520,
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 18,
            lineHeight: 1.75,
            color: "var(--color-text-secondary)",
          }}
        >
          התחבר באמצעות Google או כתובת אימייל וסיסמה.
        </p>

        <div
          style={{
            display: "grid",
            gap: 16,
            marginTop: 36,
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              maxWidth: 360,
              minHeight: 52,
              borderRadius: 999,
              border: "2px solid var(--color-accent-primary)",
              background: "#fff",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 17,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            כניסה עם Google
          </button>

          <form
            onSubmit={handleLogin}
            style={{
              width: "100%",
              maxWidth: 360,
              display: "grid",
              gap: 14,
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="אימייל"
              required
              style={{
                width: "100%",
                minHeight: 52,
                padding: "0 16px",
                borderRadius: 18,
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-body)",
                fontSize: 16,
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="סיסמה"
              required
              style={{
                width: "100%",
                minHeight: 52,
                padding: "0 16px",
                borderRadius: 18,
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-body)",
                fontSize: 16,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                minHeight: 52,
                borderRadius: 999,
                background: "var(--color-accent-primary)",
                color: "var(--color-text-inverse)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 17,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "טוען..." : "התחבר"}
            </button>
          </form>

          <Link href="/welcome" style={{ width: "100%", maxWidth: 360, textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                minHeight: 52,
                display: "grid",
                placeItems: "center",
                borderRadius: 999,
                background: "transparent",
                border: "2px solid var(--color-accent-primary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: "0.01em",
                cursor: "pointer",
              }}
            >
              חזרה לדף קבלת פנים
            </div>
          </Link>
        </div>

        {message ? (
          <div
            style={{
              marginTop: 24,
              color: "var(--color-error)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
            }}
          >
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
