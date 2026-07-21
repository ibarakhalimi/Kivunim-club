"use client";

import { FormEvent, useState } from "react";
import { Smartphone } from "lucide-react";
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
  minHeight: 50,
  border: "none",
  borderRadius: "var(--shape-radius-3xl)",
  background: "var(--color-brand)",
  color: "var(--color-on-accent)",
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
  const [phone, setPhone] = useState(() => searchParams.get("phone") ?? "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const authError = searchParams.get("auth_error");
  const displayMessage = message ?? (authError ? AUTH_ERROR_MESSAGES[authError] ?? "שגיאת התחברות. נסה שוב." : null);

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
        width: "85%",
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
      <div style={{ textAlign: "center", padding: "2px 0 4px" }}>
        <p style={{ margin: 0, color: "var(--color-ink)", fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-black)" }}>
          התחברות עם קוד לנייד
        </p>
        <p style={{ margin: "4px 0 0", color: "var(--color-text-secondary)", fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)" }}>
          רק אם נרשמת בעבר
        </p>
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
