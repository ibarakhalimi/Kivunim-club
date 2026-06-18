"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthErrorCatcher() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");

    if (!error && !errorCode) return;

    const params = new URLSearchParams();
    if (errorCode) params.set("auth_error", errorCode);
    router.replace(`/welcome?${params.toString()}`);
  }, [searchParams, router]);

  return null;
}
