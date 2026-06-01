"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

const BG = "#e7e3da";
const DOTS = "radial-gradient(circle, rgba(0,0,0,0.1) 1.2px, transparent 1.2px)";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("972")) return "+" + digits;
  if (digits.startsWith("0")) return "+972" + digits.slice(1);
  return "+972" + digits;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  fontSize: 16,
  fontFamily: "var(--font-rubik)",
  border: "3px solid #000",
  borderRadius: 12,
  boxShadow: "4px 4px 0px #000",
  background: "#fff",
  color: "#111",
  outline: "none",
  boxSizing: "border-box",
  direction: "rtl",
  fontWeight: 500,
};

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

  return (
    <div
      style={{
        height: "100dvh",
        background: BG,
        backgroundImage: DOTS,
        backgroundSize: "18px 18px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "0 28px 52px",
      }}
    >
      {/* Header */}
      <div style={{ padding: "48px 0 0", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, position: "relative" }}>
        <Link href="/welcome" style={{ position: "absolute", top: 52, right: 0, textDecoration: "none", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, color: "#111" }}>
          → חזרה
        </Link>
        <Image src="/logo-aguda.png" alt="לוגו האגודה" width={110} height={110} style={{ display: "block" }} />
        <span style={{
          background: "#7DC8E8",
          border: "2.5px solid #000",
          borderRadius: 99,
          padding: "4px 16px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 14,
          color: "#111",
        }}>
          כניסה
        </span>
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-rubik)",
          fontWeight: 900,
          fontSize: 36,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "#111",
          textAlign: "center",
        }}>
          הקלאב הסטודנטיאלי
        </h1>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: 40, maxHeight: 120 }} />

      {/* Form area */}
      <div style={{ overflowY: "auto", padding: "0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px 0",
              background: "#fff",
              color: "#111",
              border: "3px solid #000",
              borderRadius: "var(--radius-md)",
              boxShadow: "4px 4px 0px #000",
              fontFamily: "var(--font-rubik)",
              fontWeight: 900,
              fontSize: 17,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <GoogleIcon />
            כניסה עם Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 2, background: "#000" }} />
            <span style={{ fontFamily: "var(--font-rubik)", fontSize: 14, fontWeight: 700, color: "#111" }}>או</span>
            <div style={{ flex: 1, height: 2, background: "#000" }} />
          </div>

          {/* Phone OTP */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  padding: "15px 0",
                  background: loading ? "#aaa" : "#5250DB",
                  color: "#fff",
                  border: "3px solid #000",
                  borderRadius: "var(--radius-md)",
                  boxShadow: loading ? "none" : "4px 4px 0px #000",
                  fontFamily: "'Comic Sans MS', cursive, sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "שולח..." : "שלח קוד"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontSize: 14, fontWeight: 600, color: "#555" }}>
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
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px 0",
                  background: loading ? "#aaa" : "#5250DB",
                  color: "#fff",
                  border: "3px solid #000",
                  borderRadius: "var(--radius-md)",
                  boxShadow: loading ? "none" : "4px 4px 0px #000",
                  fontFamily: "'Comic Sans MS', cursive, sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "מאמת..." : "אמת וכנס"}
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); setMessage(null); }}
                style={{ background: "none", border: "none", fontFamily: "var(--font-rubik)", fontSize: 14, fontWeight: 700, color: "#555", cursor: "pointer", textDecoration: "underline" }}
              >
                שינוי מספר טלפון
              </button>
            </form>
          )}

          {message && (
            <p style={{ margin: 0, color: "#c00", fontFamily: "var(--font-rubik)", fontSize: 14, fontWeight: 600 }}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Bottom link */}
      <p style={{ margin: "16px 0 0", textAlign: "center", fontFamily: "var(--font-rubik)", fontSize: 14, color: "#555" }}>
        עדיין לא חבר?{" "}
        <Link href="/register" style={{ color: "#111", fontWeight: 800, textDecoration: "underline" }}>
          הרשמה למועדון
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
