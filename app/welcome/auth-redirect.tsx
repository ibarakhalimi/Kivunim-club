"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase/client";

export function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  useEffect(() => {
    // Handle implicit flow — token arrives in the URL hash
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace(nextPath);
      }
    });

    // Also check if already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(nextPath);
    });
  }, [nextPath, router]);

  return null;
}
