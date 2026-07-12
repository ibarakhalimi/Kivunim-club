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
  borderRadius: 14,
  background: "#303446",
  color: "#F7F8FF",
  fontFamily: "var(--font-rubik)",
  fontSize: 15,
  fontWeight: 700,
  outline: "none",
  padding: "0 14px",
  boxSizing: "border-box",
  direction: "rtl",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 46,
  border: "none",
  borderRadius: 14,
  background: "#F7F8FF",
  color: "#181A23",
  fontFamily: "var(--font-rubik)",
  fontWeight: 900,
  fontSize: 15,
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
  const [phone, setPhone] = useState("");
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
        width: "100%",
        background: "#252836",
        borderRadius: 22,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxSizing: "border-box",
      }}
    >
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
          כניסה עם קוד לנייד
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(247, 248, 255, 0.12)" }} />
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
                color: "#9CA0AE",
              }}
            />
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="מספר נייד"
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
            required
            maxLength={6}
            autoComplete="one-time-code"
            style={{ ...fieldStyle, textAlign: "center", direction: "ltr", fontSize: 20 }}
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
              color: "#9CA0AE",
              fontFamily: "var(--font-rubik)",
              fontSize: 13,
              fontWeight: 800,
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
            color: displayMessage.includes("שלחנו") ? "#B9F5D0" : "#FFB4C8",
            fontFamily: "var(--font-rubik)",
            fontSize: 13,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          {displayMessage}
        </p>
      )}
    </div>
  );
}
