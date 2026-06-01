"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";

export function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Handle implicit flow — token arrives in the URL hash
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/");
      }
    });

    // Also check if already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
  }, [router]);

  return null;
}
