"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useRef(false);
  const pendingTimer = useRef<number | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (isModifiedClick(event)) return;
      if (event.defaultPrevented) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const nextUrl = new URL(anchor.href);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.origin !== currentUrl.origin) return;
      if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) return;

      event.preventDefault();
      if (pendingTimer.current !== null) {
        window.clearTimeout(pendingTimer.current);
      }

      pendingTimer.current = window.setTimeout(() => {
        router.push(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
      }, 20);
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (pendingTimer.current !== null) {
        window.clearTimeout(pendingTimer.current);
      }
    };
  }, [router]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    document.body.classList.remove("kv-route-exiting");
    document.body.classList.add("kv-route-entering");
    const timer = window.setTimeout(() => {
      document.body.classList.remove("kv-route-entering");
    }, 280);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
