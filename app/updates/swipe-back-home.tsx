"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function SwipeBackHome() {
  const router = useRouter();
  const start = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      start.current = { x: event.clientX, y: event.clientY };
    }

    function handlePointerUp(event: PointerEvent) {
      if (!start.current) return;

      const distanceX = event.clientX - start.current.x;
      const distanceY = event.clientY - start.current.y;
      start.current = null;

      if (Math.abs(distanceX) < 90) return;
      if (Math.abs(distanceX) < Math.abs(distanceY) * 1.4) return;

      router.push("/");
    }

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [router]);

  return null;
}
