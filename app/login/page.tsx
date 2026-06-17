"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("972")) return "+" + digits;
  if (digits.startsWith("0")) return "+972" + digits.slice(1);
  return "+972" + digits;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "var(--font-rubik)",
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  background: "#fff",
  color: "#0F172A",
  outline: "none",
  boxSizing: "border-box",
  direction: "rtl",
  fontWeight: 400,
};

export default function LoginPage() {
  const router = useRouter();
  const [nextPath] = useState(() => {
    if (typeof window === "undefined") return "/";
    const params = new URLSearchParams(window.location.search);
    return params.get("next") || "/";
  });
  const welcomeHref = nextPath !== "/" ? `/welcome?next=${encodeURIComponent(nextPath)}` : "/welcome";
  const registerHref = nextPath !== "/" ? `/register?next=${encodeURIComponent(nextPath)}` : "/register";
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
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` },
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
    router.push(nextPath);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 24px 48px",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "48px 0 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
        }}
      >
        <Link
          href={welcomeHref}
          style={{
            position: "absolute",
            top: 52,
            right: 0,
            textDecoration: "none",
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 14,
            color: "#64748B",
          }}
        >
          → חזרה
        </Link>
        <Image src="/logo-aguda.png" alt="לוגו האגודה" width={80} height={80} style={{ display: "block" }} />
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              background: "#DBEAFE",
              borderRadius: 20,
              padding: "3px 14px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 600,
              fontSize: 13,
              color: "#1E40AF",
              marginBottom: 8,
            }}
          >
            כניסה
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 28,
              lineHeight: 1.2,
              color: "#0F172A",
            }}
          >
            הקלאב הסטודנטיאלי
          </h1>
        </div>
      </div>

      {/* Form card */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "#fff",
              color: "#0F172A",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              fontFamily: "var(--font-rubik)",
              fontWeight: 600,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <GoogleIcon />
            כניסה עם Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
            <span style={{ fontFamily: "var(--font-rubik)", fontSize: 13, fontWeight: 500, color: "#94A3B8" }}>או</span>
            <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
          </div>

          {/* Phone OTP */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="מספר טלפון (05X-XXXXXXX)"
                required
                style={inputStyle}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  background: loading ? "#94A3B8" : "#1E40AF",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "שולח..." : "שלח קוד אימות"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontSize: 13, fontWeight: 500, color: "#64748B" }}>
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
                style={{ ...inputStyle, letterSpacing: "0.3em", textAlign: "center", fontSize: 20 }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  background: loading ? "#94A3B8" : "#1E40AF",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "מאמת..." : "כניסה"}
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); setMessage(null); }}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "var(--font-rubik)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#64748B",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                שינוי מספר טלפון
              </button>
            </form>
          )}

          {message && (
            <p style={{ margin: 0, color: "#DC2626", fontFamily: "var(--font-rubik)", fontSize: 13, fontWeight: 600 }}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Bottom link */}
      <p style={{ margin: "20px 0 0", textAlign: "center", fontFamily: "var(--font-rubik)", fontSize: 14, color: "#64748B" }}>
        עדיין לא חבר?{" "}
        <Link href={registerHref} style={{ color: "#1E40AF", fontWeight: 700, textDecoration: "none" }}>
          הרשמה למועדון
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
