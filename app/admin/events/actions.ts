"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type EventActionState = {
  error?: string;
  success: boolean;
};

async function uploadImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from("events")
    .upload(fileName, file, { contentType: file.type, upsert: false });
  if (error) return null;
  const { data } = supabase.storage.from("events").getPublicUrl(fileName);
  return data.publicUrl;
}

async function resolveImageUrl(formData: FormData, existingUrl?: string | null): Promise<string | null> {
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    return await uploadImage(file);
  }
  return existingUrl ?? null;
}

function sanitizeRichText(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\s(href|src)="javascript:[^"]*"/gi, "")
    .replace(/\s(href|src)='javascript:[^']*'/gi, "")
    .trim();
}

function parsePrice(formData: FormData) {
  const is_paid = formData.get("is_paid") === "true";
  const rawPrice = (formData.get("price_amount") as string | null)?.trim() ?? "";

  if (!is_paid) {
    return { is_paid, price_amount: null, error: null };
  }

  const price_amount = Number(rawPrice);
  if (!rawPrice || !Number.isFinite(price_amount) || price_amount < 0) {
    return { is_paid, price_amount: null, error: "יש להזין סכום תקין לאירוע בתשלום" };
  }

  return { is_paid, price_amount, error: null };
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return `${fallback}: ${error.message}`;
  return fallback;
}

export async function addEvent(formData: FormData): Promise<EventActionState> {
  try {
    const title = (formData.get("title") as string)?.trim();
    const description = sanitizeRichText((formData.get("description") as string) ?? "");
    const event_date = formData.get("event_date") as string;
    const start_hour = (formData.get("start_hour") as string)?.trim();
    const end_hour = (formData.get("end_hour") as string)?.trim() || null;
    const location = (formData.get("location") as string)?.trim();
    const is_featured = formData.get("is_featured") === "on";
    const registration_url = (formData.get("registration_url") as string)?.trim() || null;
    const pricing = parsePrice(formData);

    if (!title || !description || !event_date || !start_hour || !location) {
      return { error: "יש למלא את כל השדות החובה", success: false };
    }
    if (pricing.error) return { error: pricing.error, success: false };

    const image_url = await resolveImageUrl(formData);

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("events")
      .insert({
        title,
        description,
        event_date,
        start_hour,
        end_hour,
        location,
        image_url,
        is_featured,
        is_paid: pricing.is_paid,
        price_amount: pricing.price_amount,
        registration_url,
      });

    if (error) return { error: `שגיאה בשמירת האירוע: ${error.message}`, success: false };

    revalidatePath("/");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    return { error: errorMessage(error, "שגיאה לא צפויה בשמירת האירוע"), success: false };
  }
}

export async function updateEvent(id: string, formData: FormData): Promise<EventActionState> {
  try {
    const title = (formData.get("title") as string)?.trim();
    const description = sanitizeRichText((formData.get("description") as string) ?? "");
    const event_date = formData.get("event_date") as string;
    const start_hour = (formData.get("start_hour") as string)?.trim();
    const end_hour = (formData.get("end_hour") as string)?.trim() || null;
    const location = (formData.get("location") as string)?.trim();
    const is_featured = formData.get("is_featured") === "on";
    const registration_url = (formData.get("registration_url") as string)?.trim() || null;
    const existing_image_url = (formData.get("existing_image_url") as string) || null;
    const pricing = parsePrice(formData);

    if (!title || !description || !event_date || !start_hour || !location) {
      return { error: "יש למלא את כל השדות החובה", success: false };
    }
    if (pricing.error) return { error: pricing.error, success: false };

    const image_url = await resolveImageUrl(formData, existing_image_url);

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("events")
      .update({
        title,
        description,
        event_date,
        start_hour,
        end_hour,
        location,
        image_url,
        is_featured,
        is_paid: pricing.is_paid,
        price_amount: pricing.price_amount,
        registration_url,
      })
      .eq("id", id);

    if (error) return { error: `שגיאה בעדכון האירוע: ${error.message}`, success: false };

    revalidatePath("/");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    return { error: errorMessage(error, "שגיאה לא צפויה בעדכון האירוע"), success: false };
  }
}

export async function toggleFeatured(id: string, current: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("events")
    .update({ is_featured: !current })
    .eq("id", id);

  if (error) return { error: "שגיאה בעדכון" };

  revalidatePath("/");
  revalidatePath("/admin/events");
  return { success: true };
}

export async function deleteEvent(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return { error: "שגיאה במחיקת האירוע" };

  revalidatePath("/");
  revalidatePath("/admin/events");
  return { success: true };
}
