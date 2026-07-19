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
        borderRadius: "var(--shape-radius-pill)",
        background: "var(--color-surface)",
        border: "1px solid color-mix(in srgb, var(--color-surface-raised) 1%, transparent)",
        color: "var(--color-ink)",
        boxShadow: "0 18px 42px color-mix(in srgb, var(--color-overlay) 28%, transparent)",
        padding: "12px 18px",
        textAlign: "center",
        fontFamily: "var(--font-family-sans)",
        fontSize: "var(--font-size-base)",
        fontWeight: "var(--font-weight-extrabold)",
      }}
    >
      הצ׳קאין בוצע בהצלחה
    </div>
  );
}
