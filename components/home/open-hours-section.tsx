"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Camera, CheckCircle2, QrCode } from "lucide-react";
import { checkIn } from "@/app/actions/check-in";

const HOURS = [
  { day: "ראשון", hours: "08:00-20:00", active: true },
  { day: "שני", hours: "08:00-20:00", active: true },
  { day: "שלישי", hours: "08:00-20:00", active: true },
  { day: "רביעי", hours: "08:00-20:00", active: true },
  { day: "חמישי", hours: "08:00-18:00", active: true },
  { day: "שישי", hours: "סגור", active: false },
  { day: "שבת", hours: "סגור", active: false },
];

type BarcodeResult = { rawValue: string };
type BarcodeDetectorInstance = {
  detect(source: CanvasImageSource): Promise<BarcodeResult[]>;
};
type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorInstance;

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

export function OpenHoursSection() {
  const [toast, setToast] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [scanState, setScanState] = useState<"intro" | "camera" | "welcome" | "error">("intro");
  const [scanError, setScanError] = useState("");
  const [isPending, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const completingRef = useRef(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (checkInOpen) return;
    stopCamera();
  }, [checkInOpen]);

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
    setScanError("");

    if (!window.BarcodeDetector) {
      setScanState("error");
      setScanError("הדפדפן הזה עדיין לא תומך בסריקת QR ישירה. אפשר לבדוק במכשיר נייד עם Chrome או Safari מעודכן.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setScanState("camera");

      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const video = videoRef.current;
      if (!video) throw new Error("Video element is not ready");

      video.srcObject = stream;
      await video.play();

      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      scanQrFrame(detector);
    } catch {
      stopCamera();
      setScanState("error");
      setScanError("לא הצלחתי לפתוח מצלמה. כדאי לבדוק הרשאות מצלמה ולנסות שוב.");
    }
  }

  function scanQrFrame(detector: BarcodeDetectorInstance) {
    const video = videoRef.current;
    if (!video || completingRef.current) return;

    detector
      .detect(video)
      .then((codes) => {
        const qrPayload = codes[0]?.rawValue;
        if (qrPayload) {
          completeCheckIn(qrPayload);
          return;
        }
        animationRef.current = requestAnimationFrame(() => scanQrFrame(detector));
      })
      .catch(() => {
        animationRef.current = requestAnimationFrame(() => scanQrFrame(detector));
      });
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
          border: "1px solid #BBF7D0",
          borderRadius: 22,
          background: "#F0FDF4",
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
                background: "#16A34A",
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 10, color: "#15803D" }}>
              פתוח עכשיו
            </span>
          </div>
          <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, lineHeight: 1, color: "#14532D" }}>
            עד 20:00
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setHoursOpen(true)}
            aria-label="שעות פתיחה"
            style={{
              width: 25,
              height: 25,
              borderRadius: "50%",
              border: "1px solid #BBF7D0",
              background: "rgba(255,255,255,0.7)",
              color: "#15803D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontFamily: "var(--font-rubik)",
              fontWeight: 900,
              fontSize: 14,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ↗
          </button>

        <button
          onClick={openCheckInSheet}
          disabled={isPending}
          style={{
            width: "auto",
            border: "1px solid #86EFAC",
            borderRadius: 999,
            background: isPending ? "#BBF7D0" : "#16A34A",
            color: "#fff",
            padding: "9px 18px",
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
            background: "#0F172A",
            color: "#fff",
            padding: "11px 22px",
            borderRadius: 99,
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 14,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          כיף שבאת!
        </div>
      )}

      {checkInOpen && (
        <>
          <div
            onClick={() => setCheckInOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.38)", zIndex: 60 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 61,
              background: "#fff",
              borderRadius: "22px 22px 0 0",
              border: "1px solid #DCFCE7",
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
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                fontSize: 14,
                cursor: "pointer",
                color: "#64748B",
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
                      background: "#DCFCE7",
                      color: "#16A34A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <QrCode size={22} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p style={{ margin: "0 0 3px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, color: "#0F172A" }}>
                      צ׳קאין מהיר
                    </p>
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#16A34A" }}>
                      סריקת QR בכניסה
                    </p>
                  </div>
                </div>

                <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, lineHeight: 1.55, color: "#475569" }}>
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
                          border: "2px solid rgba(134,239,172,0.95)",
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
                          background: "#86EFAC",
                          borderRadius: 999,
                          animation: "kv-qr-scan 1.35s ease-in-out infinite",
                        }}
                      />
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
                        color: "#DCFCE7",
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
                  disabled={scanState === "camera" || isPending}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 14,
                    background: scanState === "camera" ? "#BBF7D0" : "#16A34A",
                    color: "#fff",
                    padding: "13px 16px",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 900,
                    fontSize: 14,
                    cursor: scanState === "camera" || isPending ? "not-allowed" : "pointer",
                  }}
                >
                  {scanState === "camera" ? "מחפש QR..." : "פתח מצלמה לסריקה"}
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
                    background: "#DCFCE7",
                    color: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "kv-welcome-pop 520ms var(--ease-default)",
                  }}
                >
                  <CheckCircle2 size={42} strokeWidth={2.4} />
                </div>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 28, color: "#14532D" }}>
                  ברוך הבא
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13, color: "#16A34A" }}>
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
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 51,
              background: "#fff",
              borderRadius: "16px 16px 0 0",
              border: "1px solid #E2E8F0",
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
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                fontSize: 14,
                cursor: "pointer",
                color: "#64748B",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 18, color: "#0F172A" }}>
              שעות פתיחה
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {HOURS.map((row) => (
                <div
                  key={row.day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    background: row.active ? "#F0FDF4" : "#F8FAFC",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 13, color: "#0F172A" }}>
                    {row.day}
                  </span>
                  <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 13, color: row.active ? "#15803D" : "#94A3B8" }}>
                    {row.hours}
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
