"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("972")) return "+" + digits;
  if (digits.startsWith("0")) return "+972" + digits.slice(1);
  return "+972" + digits;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setMessage(error.message);
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({ phone: normalizePhone(phone) });
    setLoading(false);
    if (error) { setMessage(error.message); return; }
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.verifyOtp({
      phone: normalizePhone(phone),
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) { setMessage(error.message); return; }
    router.push("/");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 52,
    padding: "0 16px",
    borderRadius: 18,
    border: "1px solid var(--color-border)",
    background: "var(--color-bg-secondary)",
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: 16,
    textAlign: "right",
    direction: "rtl",
    boxSizing: "border-box",
  };

  const primaryBtnStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 52,
    borderRadius: 999,
    background: loading ? "rgba(0,0,0,0.2)" : "var(--color-accent-primary)",
    color: "var(--color-text-inverse)",
    border: "none",
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontSize: 17,
    cursor: loading ? "not-allowed" : "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background:
          "radial-gradient(circle at top, rgba(255, 236, 211, 0.95) 0%, rgba(250, 250, 245, 0.9) 45%, var(--color-bg-primary) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "32px 24px 40px",
        direction: "rtl",
      }}
    >
      {/* Main content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
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
            התחבר באמצעות Google או מספר טלפון.
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              marginTop: 36,
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {/* Google */}
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

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 360 }}>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-text-muted)" }}>או</span>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            </div>

            {/* Phone OTP — step 1 */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} style={{ width: "100%", maxWidth: 360, display: "grid", gap: 12 }}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="מספר טלפון (05X-XXXXXXX)"
                  required
                  style={inputStyle}
                />
                <button type="submit" disabled={loading} style={primaryBtnStyle}>
                  {loading ? "שולח..." : "שלח קוד"}
                </button>
              </form>
            ) : (
              /* Phone OTP — step 2 */
              <form onSubmit={handleVerifyOtp} style={{ width: "100%", maxWidth: 360, display: "grid", gap: 12 }}>
                <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-text-secondary)" }}>
                  שלחנו קוד אימות ל-{phone}
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="קוד אימות"
                  required
                  maxLength={6}
                  style={{ ...inputStyle, letterSpacing: "0.3em", textAlign: "center" }}
                />
                <button type="submit" disabled={loading} style={primaryBtnStyle}>
                  {loading ? "מאמת..." : "אמת וכנס"}
                </button>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); setMessage(null); }}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  שינוי מספר טלפון
                </button>
              </form>
            )}

            {/* Error */}
            {message && (
              <p style={{ margin: 0, color: "var(--color-error)", fontFamily: "var(--font-body)", fontSize: 15 }}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom plain text link */}
      <Link
        href="/welcome"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 15,
          color: "var(--color-text-muted)",
          textDecoration: "none",
        }}
      >
        חזרה לדף קבלת פנים
      </Link>
    </div>
  );
}
