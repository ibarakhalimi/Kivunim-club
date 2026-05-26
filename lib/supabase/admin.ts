import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database";

// Service role client — server-side only. Never import from client components.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
