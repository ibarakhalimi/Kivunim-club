"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CheckInInput = {
  source?: "qr" | "qr_link" | "manual";
  qrPayload?: string | null;
};

const VALID_CHECK_IN_TOKENS = new Set(["kivunim:checkin:main"]);

function parseQrPayload(qrPayload: string | null | undefined) {
  const rawPayload = qrPayload?.trim();
  if (!rawPayload) return { ok: false };

  if (VALID_CHECK_IN_TOKENS.has(rawPayload)) {
    return { ok: true, payload: rawPayload };
  }

  try {
    const url = new URL(rawPayload, "https://kivunim.local");
    const token = url.searchParams.get("token")?.trim() ?? "";
    const location = url.searchParams.get("location")?.trim() || "main";

    if (VALID_CHECK_IN_TOKENS.has(token)) {
      return { ok: true, payload: `${token}|location:${location}` };
    }
  } catch {
    // Invalid URL payloads are rejected below.
  }

  return { ok: false };
}

export async function checkIn(input: CheckInInput = {}) {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { error: "יש להתחבר כדי לאשר הגעה" };

  const isQrCheckIn = input.source === "qr" || input.source === "qr_link";
  const qrResult = isQrCheckIn ? parseQrPayload(input.qrPayload) : null;

  if (isQrCheckIn && !qrResult?.ok) {
    return { error: "קוד ה-QR לא תקין" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("check_ins")
    .insert({
      user_id: user.id,
      source: input.source ?? "manual",
      qr_payload: qrResult?.payload ?? input.qrPayload ?? null,
    });

  if (error) return { error: "שגיאה בשמירת ההגעה" };
  return { success: true };
}

export async function getMyCheckInCount() {
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return { count: 0 };

  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("check_ins")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) return { count: 0 };
  return { count: count ?? 0 };
}
