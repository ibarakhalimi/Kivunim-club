"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type RegistrationInput = {
  email: string;
  name: string;
  phone: string;
  institution: string;
  degree: string;
  study_year: string;
  region: string;
  birth_date: string;
  privacy_consent: boolean;
};

type RegistrationResult =
  | { success: true }
  | { duplicatePhone: true }
  | { error: string };

function phoneLookupVariants(phone: string) {
  return [
    phone,
    `${phone.slice(0, 3)}-${phone.slice(3)}`,
    `972${phone.slice(1)}`,
    `+972${phone.slice(1)}`,
  ];
}

export async function registerMember(input: RegistrationInput): Promise<RegistrationResult> {
  const member = {
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    institution: input.institution.trim(),
    degree: input.degree.trim(),
    study_year: input.study_year.trim(),
    region: input.region.trim(),
    birth_date: input.birth_date.trim(),
    privacy_consent: input.privacy_consent,
  };

  if (Object.values(member).some((value) => value === "" || value === false)) {
    return { error: "יש למלא את כל הפרטים ולאשר את תנאי הפרטיות כדי להמשיך" };
  }

  if (!/^\S+@\S+\.\S+$/.test(member.email)) {
    return { error: "כתובת האימייל אינה תקינה" };
  }

  if (!/^05\d{8}$/.test(member.phone)) {
    return { error: "מספר הטלפון חייב להכיל 10 ספרות ולהתחיל ב־05" };
  }

  try {
    const supabase = createAdminClient();
    const { data: existingPhone, error: phoneLookupError } = await supabase
      .from("members")
      .select("user_id")
      .in("phone", phoneLookupVariants(member.phone))
      .limit(1)
      .maybeSingle();

    if (phoneLookupError) {
      return { error: "לא הצלחנו לבדוק את מספר הטלפון. נסה שוב" };
    }

    if (existingPhone) {
      return { duplicatePhone: true };
    }

    const { data, error: createUserError } = await supabase.auth.admin.createUser({
      email: member.email,
      email_confirm: true,
      user_metadata: member,
    });

    if (createUserError || !data.user) {
      const isExistingUser = createUserError?.code === "email_exists" || createUserError?.message.toLowerCase().includes("already");
      return { error: isExistingUser ? "כתובת האימייל כבר רשומה במועדון" : "לא הצלחנו להשלים את ההרשמה. נסה שוב" };
    }

    const { error: memberError } = await supabase.from("members").upsert(
      {
        user_id: data.user.id,
        ...member,
      },
      { onConflict: "user_id" }
    );

    if (memberError) {
      await supabase.auth.admin.deleteUser(data.user.id);
      return { error: "לא הצלחנו לשמור את פרטי ההרשמה. נסה שוב" };
    }

    return { success: true };
  } catch {
    return { error: "לא הצלחנו להשלים את ההרשמה. נסה שוב" };
  }
}
