"use client";

import { useEffect, useState } from "react";

export function CheckInSuccessToast({ show }: { show: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const visible = show && !dismissed;

  useEffect(() => {
    if (!show) return;

    window.history.replaceState(null, "", window.location.pathname);

    const timer = window.setTimeout(() => {
      setDismissed(true);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 28,
        transform: "translateX(-50%)",
        zIndex: 120,
        width: "min(calc(100vw - 32px), 360px)",
        borderRadius: 999,
        background: "#EFF2EC",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#290800",
        boxShadow: "0 18px 42px rgba(0,0,0,0.28)",
        padding: "12px 18px",
        textAlign: "center",
        fontFamily: "var(--font-rubik)",
        fontSize: 14,
        fontWeight: 800,
      }}
    >
      הצ׳קאין בוצע בהצלחה
    </div>
  );
}
