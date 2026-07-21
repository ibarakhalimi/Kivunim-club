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

function getPayloadVariants(rawPayload: string) {
  const variants = new Set<string>();
  let current = rawPayload.trim().replaceAll("&amp;", "&");

  for (let i = 0; i < 4; i++) {
    if (!current) break;
    variants.add(current);

    const decoded = safeDecodeURIComponent(current).replaceAll("&amp;", "&");
    if (decoded === current) break;
    current = decoded;
  }

  return [...variants];
}

function getLocationFromPayload(rawPayload: string) {
  for (const payload of getPayloadVariants(rawPayload)) {
    try {
      const url = new URL(payload, "https://kivunim.local");
      const location = url.searchParams.get("location")?.trim();
      if (location) return location;
    } catch {
      const match = payload.match(/[?&]location=([^&#]+)/);
      const location = match?.[1] ? safeDecodeURIComponent(match[1]).trim() : "";
      if (location) return location;
    }
  }

  return "main";
}

function parseQrPayload(qrPayload: string | null | undefined) {
  const rawPayload = qrPayload?.trim();
  if (!rawPayload) return { ok: false };

  const payloadVariants = getPayloadVariants(rawPayload);

  for (const validToken of VALID_CHECK_IN_TOKENS) {
    const encodedToken = encodeURIComponent(validToken);
    const tokenMatches = payloadVariants.some((payload) =>
      payload === validToken ||
      payload.includes(validToken) ||
      payload.toLowerCase().includes(encodedToken.toLowerCase())
    );

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
  if (!user) return { count: 0, lastCheckIn: null };

  const supabase = createAdminClient();
  const [{ count, error }, { data: latestCheckIn, error: latestError }] = await Promise.all([
    supabase
      .from("check_ins")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("check_ins")
      .select("checked_in_at")
      .eq("user_id", user.id)
      .order("checked_in_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (error || latestError) return { count: 0, lastCheckIn: null };
  return { count: count ?? 0, lastCheckIn: latestCheckIn?.checked_in_at ?? null };
}
