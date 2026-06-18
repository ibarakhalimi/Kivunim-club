"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase/client";

type WelcomeLoginFormProps = {
  nextPath: string;
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 54,
  border: "none",
  borderRadius: 18,
  background: "#303446",
  color: "#F7F8FF",
  fontFamily: "var(--font-rubik)",
  fontSize: 16,
  fontWeight: 700,
  outline: "none",
  padding: "0 16px",
  boxSizing: "border-box",
  direction: "rtl",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 54,
  border: "none",
  borderRadius: 18,
  background: "#F7F8FF",
  color: "#181A23",
  fontFamily: "var(--font-rubik)",
  fontWeight: 900,
  fontSize: 16,
  cursor: "pointer",
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  otp_expired: "הקישור פג תוקף. שלח קוד חדש.",
  access_denied: "הגישה נדחתה. נסה שוב.",
  user_not_found: "המשתמש לא נמצא במערכת.",
};

export function WelcomeLoginForm({ nextPath }: WelcomeLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const authError = searchParams.get("auth_error");
    if (authError) {
      setMessage(AUTH_ERROR_MESSAGES[authError] ?? "שגיאת התחברות. נסה שוב.");
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    setLoading(false);
    if (error) setMessage(error.message);
  };

  const handleSendEmailCode = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    setOtpSent(true);
    setMessage("שלחנו קוד אימות למייל");
  };

  const handleVerifyEmailCode = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace(nextPath);
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#252836",
        borderRadius: 26,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: "100%",
          minHeight: 54,
          background: "#F7F8FF",
          color: "#181A23",
          border: "none",
          borderRadius: 18,
          fontFamily: "var(--font-rubik)",
          fontWeight: 900,
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.75 : 1,
        }}
      >
        <GoogleIcon />
        כניסה עם Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "2px 0" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(247, 248, 255, 0.12)" }} />
        <span
          style={{
            color: "#9CA0AE",
            fontFamily: "var(--font-rubik)",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          או
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(247, 248, 255, 0.12)" }} />
      </div>

      {!otpSent ? (
        <form onSubmit={handleSendEmailCode} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Mail
              size={19}
              strokeWidth={2.3}
              style={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: "translateY(-50%)",
                color: "#9CA0AE",
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="כתובת מייל"
              required
              style={{ ...fieldStyle, paddingRight: 46, direction: "ltr", textAlign: "right" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ ...primaryButtonStyle, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "שולח..." : "שליחת קוד אימות"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmailCode} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="קוד אימות"
            required
            maxLength={6}
            style={{ ...fieldStyle, textAlign: "center", direction: "ltr", fontSize: 20 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ ...primaryButtonStyle, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "מאמת..." : "כניסה"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setMessage(null);
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "#9CA0AE",
              fontFamily: "var(--font-rubik)",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            שינוי כתובת מייל
          </button>
        </form>
      )}

      {message && (
        <p
          style={{
            margin: 0,
            color: message.includes("שלחנו") ? "#B9F5D0" : "#FFB4C8",
            fontFamily: "var(--font-rubik)",
            fontSize: 13,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
