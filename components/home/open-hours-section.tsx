"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Camera, CheckCircle2, Info, QrCode } from "lucide-react";
import jsQR from "jsqr";
import { checkIn } from "@/app/actions/check-in";

export type OpeningHourRow = {
  day_key: string;
  day_label: string;
  sort_order: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  note: string | null;
};

const DAY_KEYS_BY_JS_DAY = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const CHECK_IN_TOKEN = "kivunim:checkin:main";

function formatTime(value: string | null) {
  return value ? value.slice(0, 5) : "";
}

function formatHours(row: OpeningHourRow) {
  if (!row.is_open) return "סגור";
  const openTime = formatTime(row.open_time);
  const closeTime = formatTime(row.close_time);
  if (openTime && closeTime) return `${openTime}-${closeTime}`;
  if (closeTime) return `עד ${closeTime}`;
  return "פתוח";
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getQrPayloadVariants(payload: string) {
  const variants = new Set<string>();
  let current = payload.trim().replaceAll("&amp;", "&");

  for (let i = 0; i < 4; i++) {
    if (!current) break;
    variants.add(current);

    const decoded = safeDecodeURIComponent(current).replaceAll("&amp;", "&");
    if (decoded === current) break;
    current = decoded;
  }

  return [...variants];
}

function getQrLocation(payload: string) {
  for (const variant of getQrPayloadVariants(payload)) {
    try {
      const url = new URL(variant, window.location.origin);
      const location = url.searchParams.get("location")?.trim();
      if (location) return location;
    } catch {
      const match = variant.match(/[?&]location=([^&#]+)/);
      const location = match?.[1] ? safeDecodeURIComponent(match[1]).trim() : "";
      if (location) return location;
    }
  }

  return "main";
}

function normalizeCheckInQrPayload(payload: string) {
  const encodedToken = encodeURIComponent(CHECK_IN_TOKEN).toLowerCase();
  const hasToken = getQrPayloadVariants(payload).some((variant) =>
    variant === CHECK_IN_TOKEN ||
    variant.includes(CHECK_IN_TOKEN) ||
    variant.toLowerCase().includes(encodedToken)
  );

  if (!hasToken) return null;

  return `/check-in?token=${encodeURIComponent(CHECK_IN_TOKEN)}&location=${encodeURIComponent(getQrLocation(payload))}`;
}

export function OpenHoursSection({ rows }: { rows: OpeningHourRow[] }) {
  const [toast, setToast] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [scanState, setScanState] = useState<"intro" | "camera" | "welcome" | "error">("intro");
  const [scanError, setScanError] = useState("");
  const [isPending, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const completingRef = useRef(false);
  const startScannerRef = useRef<(() => Promise<void>) | null>(null);
  const todayKey = DAY_KEYS_BY_JS_DAY[new Date().getDay()];
  const today = rows.find((row) => row.day_key === todayKey) ?? rows[0];
  const todayNote = today?.note?.trim() || null;
  const isOpenToday = Boolean(today?.is_open);
  const closeTime = formatTime(today?.close_time ?? null);

  const nextOpenTime = (() => {
    for (let i = 1; i <= 7; i++) {
      const key = DAY_KEYS_BY_JS_DAY[(new Date().getDay() + i) % 7];
      const row = rows.find((r) => r.day_key === key);
      if (row?.is_open && row.open_time) return formatTime(row.open_time);
    }
    return null;
  })();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (checkInOpen) return;
    stopCamera();
  }, [checkInOpen]);

  useEffect(() => {
    startScannerRef.current = startScanner;
  });

  useEffect(() => {
    if (!checkInOpen || scanState !== "intro") return;
    const timer = window.setTimeout(() => {
      void startScannerRef.current?.();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [checkInOpen, scanState]);

  useEffect(() => () => stopCamera(), []);

  function stopCamera() {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function openCheckInSheet() {
    setScanState("intro");
    setScanError("");
    completingRef.current = false;
    setCheckInOpen(true);
  }

  async function startScanner() {
    stopCamera();
    setScanError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanState("error");
      setScanError("הדפדפן לא מאפשר פתיחת מצלמה מהעמוד הזה. במובייל צריך לפתוח דרך HTTPS או localhost.");
      return;
    }

    try {
      setScanState("camera");
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const video = videoRef.current;
      if (!video) throw new Error("Video element is not ready");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;

      video.srcObject = stream;
      await video.play();

      scanQrFrame();
    } catch {
      stopCamera();
      setScanState("error");
      setScanError("לא הצלחתי לפתוח מצלמה. כדאי לבדוק הרשאות מצלמה ולנסות שוב.");
    }
  }

  function scanQrFrame() {
    const video = videoRef.current;
    if (!video || completingRef.current) return;

    if (!video.videoWidth || !video.videoHeight) {
      animationRef.current = requestAnimationFrame(scanQrFrame);
      return;
    }

    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      animationRef.current = requestAnimationFrame(scanQrFrame);
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });

    if (code?.data) {
      const normalizedPayload = normalizeCheckInQrPayload(code.data);
      if (!normalizedPayload) {
        setScanError("זה לא קוד הצ׳קאין הנכון");
        animationRef.current = requestAnimationFrame(scanQrFrame);
        return;
      }

      completeCheckIn(normalizedPayload);
      return;
    }

    animationRef.current = requestAnimationFrame(scanQrFrame);
  }

  function completeCheckIn(qrPayload: string | null = null) {
    if (completingRef.current) return;
    completingRef.current = true;
    stopCamera();

    startTransition(async () => {
      const result = await checkIn({ source: qrPayload ? "qr" : "manual", qrPayload });
      if (result?.error) {
        completingRef.current = false;
        setScanState("error");
        setScanError(result.error);
        return;
      }

      window.dispatchEvent(new Event("check-in-created"));
      setScanState("welcome");
      window.setTimeout(() => {
        setCheckInOpen(false);
        setToast(true);
      }, 1450);
    });
  }

  return (
    <section style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          border: "none",
          borderRadius: 22,
          background: "#252836",
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: isOpenToday ? "#16A34A" : "#F97316",
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 10, color: isOpenToday ? "#34D399" : "#F97316" }}>
              {isOpenToday ? "פתוח עכשיו" : "סגור עכשיו"}
            </span>
            {todayNote && (
              <span
                style={{
                  borderRadius: 999,
                  background: isOpenToday ? "rgba(52,211,153,0.15)" : "rgba(249,115,22,0.15)",
                  color: isOpenToday ? "#34D399" : "#F97316",
                  padding: "2px 7px",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 10,
                  lineHeight: 1.2,
                  maxWidth: 130,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {todayNote}
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 17, lineHeight: 1.1, color: isOpenToday ? "#FFFFFF" : "#F97316" }}>
            {isOpenToday && closeTime
              ? `עד ${closeTime}`
              : isOpenToday
              ? "פתוח"
              : nextOpenTime
              ? `נתראה מחר ב${nextOpenTime}`
              : "סגור"}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setHoursOpen(true)}
            aria-label="שעות פתיחה"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.06)",
              color: "#9CA0AE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Info size={16} strokeWidth={2.2} />
          </button>

        <button
          onClick={openCheckInSheet}
          disabled={isPending}
          style={{
            height: 36,
            width: "auto",
            border: "none",
            borderRadius: 999,
            background: isPending ? "rgba(216,245,0,0.4)" : "#D8F500",
            color: "#181A23",
            padding: "0 18px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 12,
            cursor: isPending ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {isPending ? "מסמן..." : "צ׳קאין"}
        </button>
        </div>
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99,
            background: "#252836",
            color: "#fff",
            padding: "11px 22px",
            borderRadius: 99,
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 14,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          כיף שבאת!
        </div>
      )}

      {checkInOpen && (
        <>
          <div
            onClick={() => setCheckInOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 60 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 61,
              background: "#252836",
              borderRadius: "26px 26px 0 0",
              border: "1px solid rgba(255,255,255,0.06)",
              borderBottom: "none",
              direction: "rtl",
              padding: "22px 18px 42px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setCheckInOpen(false)}
              style={{
                position: "absolute",
                top: 14,
                left: 16,
                width: 32,
                height: 32,
                background: "#2F3344",
                border: "none",
                borderRadius: "50%",
                fontSize: 14,
                cursor: "pointer",
                color: "#9CA0AE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            {scanState !== "welcome" ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 15,
                      background: "rgba(52,211,153,0.15)",
                      color: "#34D399",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <QrCode size={22} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p style={{ margin: "0 0 3px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, color: "#FFFFFF" }}>
                      צ׳קאין מהיר
                    </p>
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#34D399" }}>
                      סריקת QR בכניסה
                    </p>
                  </div>
                </div>

                <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, lineHeight: 1.55, color: "#9CA0AE" }}>
                  הציגו את המצלמה מול קוד ה-QR שבכניסה. אחרי זיהוי מוצלח ההגעה תישמר אוטומטית באזור האישי ובדוח הניהול.
                </p>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1.28 / 1",
                    borderRadius: 20,
                    background: "#0F172A",
                    overflow: "hidden",
                    marginBottom: 14,
                  }}
                >
                  {scanState === "camera" ? (
                    <>
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 22,
                          border: "2px solid rgba(216,245,0,0.7)",
                          borderRadius: 18,
                          boxShadow: "0 0 0 999px rgba(15,23,42,0.28)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: 34,
                          right: 34,
                          top: "50%",
                          height: 2,
                          background: "#D8F500",
                          borderRadius: 999,
                          animation: "kv-qr-scan 1.35s ease-in-out infinite",
                          display: scanError ? "none" : "block",
                        }}
                      />
                      {scanError && (
                        <div
                          style={{
                            position: "absolute",
                            left: 14,
                            right: 14,
                            bottom: 14,
                            borderRadius: 14,
                            background: "rgba(15,23,42,0.82)",
                            color: "#D8F500",
                            padding: "10px 12px",
                            fontFamily: "var(--font-rubik)",
                            fontWeight: 700,
                            fontSize: 12,
                            lineHeight: 1.45,
                            textAlign: "center",
                          }}
                        >
                          {scanError}
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        color: "#9CA0AE",
                        padding: 20,
                        textAlign: "center",
                      }}
                    >
                      <Camera size={34} strokeWidth={2.2} />
                      <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13 }}>
                        {scanState === "error" ? scanError : "המצלמה תיפתח כאן"}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={startScanner}
                  disabled={(scanState === "camera" && !scanError) || isPending}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 14,
                    background: scanState === "camera" && !scanError ? "rgba(216,245,0,0.4)" : "#D8F500",
                    color: "#181A23",
                    padding: "13px 16px",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 900,
                    fontSize: 14,
                    cursor: (scanState === "camera" && !scanError) || isPending ? "not-allowed" : "pointer",
                  }}
                >
                  {scanState === "camera" && !scanError ? "מחפש QR..." : scanError ? "נסה שוב" : "פתח מצלמה לסריקה"}
                </button>
              </>
            ) : (
              <div
                style={{
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: "50%",
                    background: "rgba(52,211,153,0.15)",
                    color: "#34D399",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "kv-welcome-pop 520ms var(--ease-default)",
                  }}
                >
                  <CheckCircle2 size={42} strokeWidth={2.4} />
                </div>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 28, color: "#34D399" }}>
                  ברוך הבא
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13, color: "#34D399" }}>
                  ההגעה נשמרה בהצלחה
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {hoursOpen && (
        <>
          <div
            onClick={() => setHoursOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 51,
              background: "#252836",
              borderRadius: "26px 26px 0 0",
              border: "1px solid rgba(255,255,255,0.06)",
              borderBottom: "none",
              direction: "rtl",
              padding: "24px 20px 44px",
            }}
          >
            <button
              onClick={() => setHoursOpen(false)}
              style={{
                position: "absolute", top: 14, left: 16,
                width: 32, height: 32,
                background: "#2F3344",
                border: "none",
                borderRadius: "50%",
                fontSize: 14,
                cursor: "pointer",
                color: "#9CA0AE",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 18, color: "#FFFFFF" }}>
              שעות פתיחה
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rows.map((row) => (
                <div
                  key={row.day_key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: row.is_open ? "rgba(52,211,153,0.08)" : "#2F3344",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13, color: "#FFFFFF" }}>
                      {row.day_label}
                    </span>
                    {row.note && (
                      <span
                        style={{
                          borderRadius: 999,
                          background: row.is_open ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)",
                          color: row.is_open ? "#34D399" : "#7C808E",
                          padding: "2px 7px",
                          fontFamily: "var(--font-rubik)",
                          fontWeight: 900,
                          fontSize: 10,
                          maxWidth: 120,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.note}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, color: row.is_open ? "#34D399" : "#7C808E", flexShrink: 0 }}>
                    {formatHours(row)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
