"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CheckInInput = {
  source?: "qr" | "qr_link" | "manual";
  qrPayload?: string | null;
};

const VALID_CHECK_IN_TOKENS = new Set(["kivunim:checkin:main"]);

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getLocationFromPayload(rawPayload: string) {
  try {
    const url = new URL(rawPayload, "https://kivunim.local");
    return url.searchParams.get("location")?.trim() || "main";
  } catch {
    const match = rawPayload.match(/[?&]location=([^&#]+)/);
    return match?.[1] ? safeDecodeURIComponent(match[1]).trim() || "main" : "main";
  }
}

function parseQrPayload(qrPayload: string | null | undefined) {
  const rawPayload = qrPayload?.trim();
  if (!rawPayload) return { ok: false };

  const decodedPayload = safeDecodeURIComponent(rawPayload);

  for (const validToken of VALID_CHECK_IN_TOKENS) {
    const encodedToken = encodeURIComponent(validToken);
    const tokenMatches =
      rawPayload === validToken ||
      rawPayload.includes(validToken) ||
      rawPayload.toLowerCase().includes(encodedToken.toLowerCase()) ||
      decodedPayload.includes(validToken);

    if (tokenMatches) {
      return { ok: true, payload: `${validToken}|location:${getLocationFromPayload(rawPayload)}` };
    }
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
