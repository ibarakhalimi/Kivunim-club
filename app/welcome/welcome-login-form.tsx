"use client";

import { FormEvent, useState } from "react";
import { Lock, Mail, Smartphone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { requestPhoneOtp, verifyPhoneOtp } from "@/app/actions/phone-otp";

type WelcomeLoginFormProps = {
  nextPath: string;
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 46,
  border: "none",
  borderRadius: "var(--shape-radius-xl)",
  background: "var(--color-stone-border)",
  color: "var(--color-ink)",
  WebkitTextFillColor: "var(--color-ink)",
  fontFamily: "var(--font-family-sans)",
  fontSize: "var(--font-size-lg)",
  fontWeight: "var(--font-weight-bold)",
  outline: "none",
  padding: "0 14px",
  boxSizing: "border-box",
  direction: "rtl",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 46,
  border: "none",
  borderRadius: "var(--shape-radius-xl)",
  background: "var(--color-warm-ink)",
  color: "var(--color-surface-raised)",
  fontFamily: "var(--font-family-sans)",
  fontWeight: "var(--font-weight-black)",
  fontSize: "var(--font-size-lg)",
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
  const [passwordEmail, setPasswordEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(() => searchParams.get("phone") ?? "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const authError = searchParams.get("auth_error");
  const displayMessage = message ?? (authError ? AUTH_ERROR_MESSAGES[authError] ?? "שגיאת התחברות. נסה שוב." : null);

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

  const handlePasswordLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: passwordEmail,
      password,
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace(nextPath);
  };

  const handleSendPhoneCode = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await requestPhoneOtp(phone);

    setLoading(false);
    if ("error" in result) {
      setMessage(result.error);
      return;
    }

    setPhoneOtpSent(true);
    setMessage("אם המספר רשום במערכת, שלחנו אליו קוד אימות");
  };

  const handleVerifyPhoneCode = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await verifyPhoneOtp(phone, phoneOtp, nextPath);
    if ("error" in result) {
      setLoading(false);
      setMessage(result.error);
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      token_hash: result.tokenHash!,
      type: "magiclink",
    });

    setLoading(false);
    if (error) {
      setMessage("לא הצלחנו להשלים התחברות");
      return;
    }

    router.replace(result.nextPath ?? nextPath);
  };

  return (
    <div
      style={{
        width: "100%",
        background: "var(--color-surface)",
        borderRadius: "var(--shape-radius-5xl)",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .kv-welcome-field::placeholder {
          color: var(--color-ink);
          -webkit-text-fill-color: var(--color-ink);
          opacity: 1;
        }
      `}</style>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: "100%",
          minHeight: 46,
          background: "var(--color-surface-tinted)",
          color: "var(--color-ink)",
          border: "none",
          borderRadius: "var(--shape-radius-xl)",
          fontFamily: "var(--font-family-sans)",
          fontWeight: "var(--font-weight-black)",
          fontSize: "var(--font-size-lg)",
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
        <div style={{ flex: 1, height: 1, background: "color-mix(in srgb, var(--color-surface-tinted) 12%, transparent)" }} />
        <span
          style={{
            color: "var(--color-ink)",
            fontFamily: "var(--font-family-sans)",
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-extrabold)",
          }}
        >
          או
        </span>
        <div style={{ flex: 1, height: 1, background: "color-mix(in srgb, var(--color-surface-tinted) 12%, transparent)" }} />
      </div>

      <form onSubmit={handlePasswordLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <Mail
            size={19}
            strokeWidth={2.3}
            style={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              color: "var(--color-ink)",
            }}
          />
          <input
            type="email"
            value={passwordEmail}
            onChange={(event) => setPasswordEmail(event.target.value)}
            placeholder="מייל"
            className="kv-welcome-field"
            required
            autoComplete="email"
            style={{ ...fieldStyle, paddingRight: 46, direction: "ltr", textAlign: "right" }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <Lock
            size={19}
            strokeWidth={2.3}
            style={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              color: "var(--color-ink)",
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="סיסמה"
            className="kv-welcome-field"
            required
            autoComplete="current-password"
            style={{ ...fieldStyle, paddingRight: 46, direction: "ltr", textAlign: "right" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ ...primaryButtonStyle, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "מתחבר..." : "כניסה עם סיסמה"}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "2px 0" }}>
        <div style={{ flex: 1, height: 1, background: "color-mix(in srgb, var(--color-surface-tinted) 12%, transparent)" }} />
        <span
          style={{
            color: "var(--color-ink)",
            fontFamily: "var(--font-family-sans)",
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-extrabold)",
          }}
        >
          כניסה עם קוד לנייד
        </span>
        <div style={{ flex: 1, height: 1, background: "color-mix(in srgb, var(--color-surface-tinted) 12%, transparent)" }} />
      </div>

      {!phoneOtpSent ? (
        <form onSubmit={handleSendPhoneCode} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Smartphone
              size={19}
              strokeWidth={2.3}
              style={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: "translateY(-50%)",
                color: "var(--color-ink)",
              }}
            />
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="מספר נייד"
              className="kv-welcome-field"
              required
              autoComplete="tel"
              style={{ ...fieldStyle, paddingRight: 46, direction: "ltr", textAlign: "right" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ ...primaryButtonStyle, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "שולח..." : "שליחת קוד לנייד"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyPhoneCode} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            inputMode="numeric"
            value={phoneOtp}
            onChange={(event) => setPhoneOtp(event.target.value)}
            placeholder="קוד שקיבלת ב-SMS"
            className="kv-welcome-field"
            required
            maxLength={6}
            autoComplete="one-time-code"
            style={{ ...fieldStyle, textAlign: "center", direction: "ltr", fontSize: "var(--font-size-3xl)" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ ...primaryButtonStyle, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "מאמת..." : "כניסה עם קוד"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPhoneOtpSent(false);
              setPhoneOtp("");
              setMessage(null);
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--color-ink)",
              fontFamily: "var(--font-family-sans)",
              fontSize: "var(--font-size-md)",
              fontWeight: "var(--font-weight-extrabold)",
              cursor: "pointer",
            }}
          >
            שינוי מספר נייד
          </button>
        </form>
      )}

      {displayMessage && (
        <p
          style={{
            margin: 0,
            color: displayMessage.includes("שלחנו") ? "var(--color-auth-success)" : "var(--color-pink-soft)",
            fontFamily: "var(--font-family-sans)",
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-extrabold)",
            textAlign: "center",
          }}
        >
          {displayMessage}
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
        fill="var(--color-google-blue)"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="var(--color-google-green)"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="var(--color-google-yellow)"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="var(--color-google-red)"
      />
    </svg>
  );
}
