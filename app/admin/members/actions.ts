"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type MemberRow = {
  user_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  institution: string | null;
  degree: string | null;
  study_year: string | null;
  region: string | null;
  birth_date: string | null;
  role: string;
  privacy_consent: boolean;
  created_at: string;
};

export type MemberFilters = {
  search: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  degree: string;
  studyYear: string;
  region: string;
  birthDate: string;
  role: string;
  privacyConsent: string;
  createdDate: string;
};

const MEMBER_COLUMNS = "user_id, name, email, phone, institution, degree, study_year, region, birth_date, role, privacy_consent, created_at";

function cleanFilter(value: string) {
  return value.trim().replace(/[,%()]/g, " ");
}

export async function getMembers(filters?: Partial<MemberFilters>): Promise<MemberRow[]> {
  const supabase = createAdminClient();
  let query = supabase.from("members").select(MEMBER_COLUMNS).order("created_at", { ascending: false });

  const search = cleanFilter(filters?.search ?? "");
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,institution.ilike.%${search}%,degree.ilike.%${search}%,study_year.ilike.%${search}%,region.ilike.%${search}%`);
  }

  for (const [column, value] of [
    ["name", filters?.name],
    ["email", filters?.email],
    ["phone", filters?.phone],
  ] as const) {
    const cleaned = cleanFilter(value ?? "");
    if (cleaned) query = query.ilike(column, `%${cleaned}%`);
  }

  if (filters?.institution) query = query.eq("institution", filters.institution);
  if (filters?.degree) query = query.eq("degree", filters.degree);
  if (filters?.studyYear) query = query.eq("study_year", filters.studyYear);
  if (filters?.region) query = query.eq("region", filters.region);
  if (filters?.birthDate) query = query.eq("birth_date", filters.birthDate);
  if (filters?.role) query = query.eq("role", filters.role);
  if (filters?.privacyConsent === "yes") query = query.eq("privacy_consent", true);
  if (filters?.privacyConsent === "no") query = query.eq("privacy_consent", false);
  if (filters?.createdDate) {
    query = query.gte("created_at", `${filters.createdDate}T00:00:00`).lt("created_at", `${filters.createdDate}T23:59:59.999`);
  }

  const { data, error } = await query;
  if (error) throw new Error("לא ניתן לטעון את חברי המועדון");
  return (data ?? []) as MemberRow[];
}
