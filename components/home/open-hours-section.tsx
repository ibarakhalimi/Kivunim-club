"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock3, QrCode } from "lucide-react";
import jsQR from "jsqr";
import { checkIn } from "@/app/actions/check-in";
import { getOpeningHoursWeek } from "@/app/admin/settings/actions";

export type OpeningHourRow = {
  date: string;
  day_key: string;
  day_label: string;
  sort_order: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  note: string | null;
};

function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: string, days: number) {
  const result = parseLocalDate(date);
  result.setDate(result.getDate() + days);
  return toDateString(result);
}

function formatDate(date: string) {
  return parseLocalDate(date).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
}

const DAY_KEYS_BY_JS_DAY = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const CHECK_IN_QR_PAYLOAD = "/check-in?token=kivunim%3Acheckin%3Amain&location=main";

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

export function OpenHoursSection({ rows }: { rows: OpeningHourRow[] }) {
  const [toast, setToast] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [scanState, setScanState] = useState<"intro" | "camera" | "welcome" | "error">("intro");
  const [scanError, setScanError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isHoursWeekPending, startHoursWeekTransition] = useTransition();
  const [hoursWeekOffset, setHoursWeekOffset] = useState(0);
  const [hoursRows, setHoursRows] = useState(rows);
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

  function moveHoursWeek(direction: -1 | 1) {
    const nextOffset = hoursWeekOffset + direction;
    if (nextOffset < 0 || nextOffset > 1 || !rows[0]?.date) return;

    startHoursWeekTransition(async () => {
      const nextRows = await getOpeningHoursWeek(addDays(rows[0].date, nextOffset * 7));
      setHoursRows(nextRows);
      setHoursWeekOffset(nextOffset);
    });
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
      completeCheckIn(CHECK_IN_QR_PAYLOAD);
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
          borderRadius: "var(--shape-radius-5xl)",
          background: "var(--color-surface)",
          padding: "16px 24px 16px 16px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ minWidth: 0, flex: 1, paddingRight: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 1 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "var(--shape-radius-circle)",
                background: isOpenToday ? "var(--color-success)" : "var(--color-warning)",
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-2xl)", lineHeight: 1.15, color: isOpenToday ? "var(--color-success-bright)" : "var(--color-warning)" }}>
              {isOpenToday ? "פתוח עכשיו" : "סגור עכשיו"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", lineHeight: 1.15, color: isOpenToday ? "var(--color-text-disabled)" : "var(--color-warning)", whiteSpace: "nowrap" }}>
              {isOpenToday && closeTime
                ? `עד ${closeTime}`
                : isOpenToday
                ? "פתוח"
                : nextOpenTime
                ? `נתראה מחר ב${nextOpenTime}`
                : "סגור"}
            </p>
            {todayNote && (
              <span
                style={{
                  borderRadius: "var(--shape-radius-pill)",
                  background: isOpenToday ? "color-mix(in srgb, var(--color-success-bright) 15%, transparent)" : "color-mix(in srgb, var(--color-warning) 15%, transparent)",
                  color: isOpenToday ? "var(--color-success-bright)" : "var(--color-warning)",
                  padding: "2px 7px",
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-black)",
                  fontSize: "var(--font-size-2xs)",
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
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setHoursOpen(true)}
            aria-label="שעות פתיחה"
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--shape-radius-circle)",
              border: "none",
              background: "var(--color-neutral-blue)",
              color: "var(--color-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Clock3 size={20} strokeWidth={2.15} />
          </button>

        <button
          onClick={openCheckInSheet}
          disabled={isPending}
          style={{
            height: 40,
            width: "auto",
            border: "none",
            borderRadius: "var(--shape-radius-pill)",
            background: isPending ? "color-mix(in srgb, var(--color-violet-500) 55%, transparent)" : "var(--color-violet-500)",
            color: "var(--color-neutral-deep)",
            padding: "0 22px",
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-black)",
            fontSize: "var(--font-size-md)",
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
            background: "var(--color-surface)",
            color: "var(--color-surface-raised)",
            padding: "11px 22px",
            borderRadius: "var(--shape-radius-pill)",
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-base)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            border: "1px solid color-mix(in srgb, var(--color-on-accent) 10%, transparent)",
          }}
        >
          כיף שבאת!
        </div>
      )}

      {checkInOpen && (
        <>
          <div
            onClick={() => setCheckInOpen(false)}
            style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--color-overlay) 55%, transparent)", zIndex: 60 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 61,
              background: "var(--color-surface)",
              borderRadius: "var(--shape-radius-sheet)",
              border: "1px solid color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
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
                background: "var(--color-neutral-dark)",
                border: "none",
                borderRadius: "var(--shape-radius-circle)",
                fontSize: "var(--font-size-base)",
                cursor: "pointer",
                color: "var(--color-text-disabled)",
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
                      borderRadius: "var(--shape-radius-xl)",
                      background: "color-mix(in srgb, var(--color-success-bright) 15%, transparent)",
                      color: "var(--color-success-bright)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <QrCode size={22} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p style={{ margin: "0 0 3px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-2xl)", color: "var(--color-ink)" }}>
                      צ׳קאין מהיר
                    </p>
                    <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-success-bright)" }}>
                      סריקת QR בכניסה
                    </p>
                  </div>
                </div>

                <p style={{ margin: "0 0 16px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-md)", lineHeight: 1.55, color: "var(--color-text-disabled)" }}>
                  הציגו את המצלמה מול קוד ה-QR שבכניסה. אחרי זיהוי מוצלח ההגעה תישמר אוטומטית באזור האישי ובדוח הניהול.
                </p>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1.28 / 1",
                    borderRadius: "var(--shape-radius-4xl)",
                    background: "var(--color-admin-dark)",
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
                          border: "2px solid color-mix(in srgb, var(--color-brand) 70%, transparent)",
                          borderRadius: "var(--shape-radius-3xl)",
                          boxShadow: "0 0 0 999px color-mix(in srgb, var(--color-admin-dark) 28%, transparent)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: 34,
                          right: 34,
                          top: "50%",
                          height: 2,
                          background: "var(--color-brand)",
                          borderRadius: "var(--shape-radius-pill)",
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
                            borderRadius: "var(--shape-radius-xl)",
                            background: "color-mix(in srgb, var(--color-admin-dark) 82%, transparent)",
                            color: "var(--color-brand)",
                            padding: "10px 12px",
                            fontFamily: "var(--font-family-sans)",
                            fontWeight: "var(--font-weight-bold)",
                            fontSize: "var(--font-size-sm)",
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
                        color: "var(--color-text-disabled)",
                        padding: 20,
                        textAlign: "center",
                      }}
                    >
                      <Camera size={34} strokeWidth={2.2} />
                      <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-md)" }}>
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
                    borderRadius: "var(--shape-radius-xl)",
                    background: scanState === "camera" && !scanError ? "color-mix(in srgb, var(--color-brand) 40%, transparent)" : "var(--color-brand)",
                    color: "var(--color-ink)",
                    padding: "13px 16px",
                    fontFamily: "var(--font-family-sans)",
                    fontWeight: "var(--font-weight-black)",
                    fontSize: "var(--font-size-base)",
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
                    borderRadius: "var(--shape-radius-circle)",
                    background: "color-mix(in srgb, var(--color-success-bright) 15%, transparent)",
                    color: "var(--color-success-bright)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "kv-welcome-pop 520ms var(--ease-default)",
                  }}
                >
                  <CheckCircle2 size={42} strokeWidth={2.4} />
                </div>
                <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-5xl)", color: "var(--color-success-bright)" }}>
                  ברוך הבא
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-md)", color: "var(--color-success-bright)" }}>
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
            style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--color-overlay) 50%, transparent)", zIndex: 50 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 51,
              background: "var(--color-surface)",
              borderRadius: "var(--shape-radius-sheet)",
              border: "1px solid color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
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
                background: "var(--color-neutral-dark)",
                border: "none",
                borderRadius: "var(--shape-radius-circle)",
                fontSize: "var(--font-size-base)",
                cursor: "pointer",
                color: "var(--color-text-disabled)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            <p style={{ margin: "0 0 12px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-2xl)", color: "var(--color-ink)" }}>
              שעות פתיחה
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
              <button type="button" onClick={() => moveHoursWeek(-1)} disabled={hoursWeekOffset === 0 || isHoursWeekPending} aria-label="חזרה לשבוע הנוכחי" style={{ ...hoursWeekButtonStyle, opacity: hoursWeekOffset === 0 ? 0.35 : 1 }}>
                <ChevronRight size={18} strokeWidth={2.4} />
              </button>
              <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-sm)", color: "var(--color-text-disabled)" }}>
                {isHoursWeekPending ? "טוען..." : hoursWeekOffset === 0 ? "השבוע הנוכחי" : "השבוע הבא"}
              </span>
              <button type="button" onClick={() => moveHoursWeek(1)} disabled={hoursWeekOffset === 1 || isHoursWeekPending} aria-label="מעבר לשבוע הבא" style={{ ...hoursWeekButtonStyle, opacity: hoursWeekOffset === 1 ? 0.35 : 1 }}>
                <ChevronLeft size={18} strokeWidth={2.4} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {hoursRows.map((row) => (
                <div
                  key={row.day_key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: "var(--shape-radius-lg)",
                    border: "1px solid color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
                    background: row.is_open ? "color-mix(in srgb, var(--color-success-bright) 8%, transparent)" : "var(--color-neutral-dark)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                    <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-md)", color: "var(--color-ink)" }}>
                      {row.day_label} · {formatDate(row.date)}
                    </span>
                    {row.note && (
                      <span
                        style={{
                          borderRadius: "var(--shape-radius-pill)",
                          background: row.is_open ? "color-mix(in srgb, var(--color-success-bright) 15%, transparent)" : "color-mix(in srgb, var(--color-on-accent) 6%, transparent)",
                          color: row.is_open ? "var(--color-success-bright)" : "var(--color-neutral-700)",
                          padding: "2px 7px",
                          fontFamily: "var(--font-family-sans)",
                          fontWeight: "var(--font-weight-black)",
                          fontSize: "var(--font-size-2xs)",
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
                  <span style={{ fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-md)", color: row.is_open ? "var(--color-success-bright)" : "var(--color-neutral-700)", flexShrink: 0 }}>
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

const hoursWeekButtonStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "var(--shape-radius-circle)",
  border: "none",
  background: "var(--color-neutral-blue)",
  color: "var(--color-brand)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
