"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendMicropayOtp, verifyMicropayOtp } from "@/lib/sms/micropay";

type PhoneOtpResult =
  | { success: true; tokenHash?: string; nextPath?: string }
  | { error: string };

function normalizePhoneForSms(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("9725") && digits.length === 12) {
    return `0${digits.slice(3)}`;
  }

  if (digits.startsWith("5") && digits.length === 9) {
    return `0${digits}`;
  }

  if (digits.startsWith("05") && digits.length === 10) {
    return digits;
  }

  return "";
}

function phoneLookupVariants(phone: string) {
  const variants = new Set<string>();
  const digits = phone.replace(/\D/g, "");
  const localPhone = normalizePhoneForSms(phone);

  if (phone.trim()) variants.add(phone.trim());
  if (digits) variants.add(digits);
  if (localPhone) {
    variants.add(localPhone);
    variants.add(`972${localPhone.slice(1)}`);
    variants.add(`+972${localPhone.slice(1)}`);
    variants.add(`${localPhone.slice(0, 3)}-${localPhone.slice(3)}`);
  }

  return [...variants];
}

function isSafeNextPath(nextPath: string) {
  return nextPath.startsWith("/") && !nextPath.startsWith("//");
}

async function findMemberByPhone(phone: string) {
  const supabase = createAdminClient();
  const variants = phoneLookupVariants(phone);
  if (variants.length === 0) return null;

  const { data, error } = await supabase
    .from("members")
    .select("user_id, email, phone")
    .in("phone", variants)
    .limit(1)
    .maybeSingle();

  if (error || !data?.email) return null;
  return data;
}

export async function requestPhoneOtp(phone: string): Promise<PhoneOtpResult> {
  const smsPhone = normalizePhoneForSms(phone);
  if (!smsPhone) return { error: "מספר הטלפון לא תקין" };

  const member = await findMemberByPhone(phone);
  if (!member) {
    return { error: "מספר הנייד לא קיים במערכת" };
  }

  const result = await sendMicropayOtp({ phone: smsPhone });
  if (!result.ok) {
    if (result.message === "MAX_SENT") return { error: "נשלחו יותר מדי קודים. נסה שוב בעוד כמה דקות" };
    return { error: "לא הצלחנו לשלוח קוד כרגע. נסה שוב בעוד רגע" };
  }

  return { success: true };
}

export async function verifyPhoneOtp(phone: string, code: string, nextPath: string): Promise<PhoneOtpResult> {
  const smsPhone = normalizePhoneForSms(phone);
  const cleanCode = code.replace(/\D/g, "");

  if (!smsPhone) return { error: "מספר הטלפון לא תקין" };
  if (cleanCode.length !== 6) return { error: "קוד האימות צריך להכיל 6 ספרות" };

  const member = await findMemberByPhone(phone);
  if (!member?.email) return { error: "לא הצלחנו לאמת את הקוד" };

  const otpResult = await verifyMicropayOtp({ phone: smsPhone, code: cleanCode });
  if (!otpResult.ok) {
    if (otpResult.message === "WRONG_CODE") return { error: "קוד האימות שגוי או שפג תוקף" };
    return { error: "לא הצלחנו לאמת את הקוד. נסה שוב" };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: member.email,
  });

  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) {
    return { error: "לא הצלחנו להשלים התחברות" };
  }

  return {
    success: true,
    tokenHash,
    nextPath: isSafeNextPath(nextPath) ? nextPath : "/",
  };
}
