import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const RESULTS_DIR = path.join(projectRoot, "private", "member-link-results");
const RESULTS_PATH = path.join(RESULTS_DIR, `member-auth-link-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`);

const DRY_RUN = process.env.DRY_RUN !== "false";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function normalizeEmail(email) {
  return (email ?? "").trim().toLowerCase();
}

function normalizeIsraeliPhoneToE164(phone) {
  const trimmed = (phone ?? "").trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return "";
  if (trimmed.startsWith("+972")) return `+${digits}`;
  if (digits.startsWith("972")) return `+${digits}`;
  if (digits.startsWith("0")) return `+972${digits.slice(1)}`;
  return `+${digits}`;
}

function isValidIsraeliMobileE164(phone) {
  return /^\+9725\d{8}$/.test(phone);
}

async function listExistingAuthUsers() {
  const users = [];
  const perPage = 1000;
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(`Failed to list auth users on page ${page}: ${error.message}`);
    }

    const pageUsers = data?.users ?? [];
    users.push(...pageUsers);

    if (pageUsers.length < perPage) break;
    page += 1;
  }

  return users;
}

async function listMembers() {
  const rows = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .range(from, from + pageSize - 1);

    if (error) {
      throw new Error(`Failed to list members from row ${from}: ${error.message}`);
    }

    const pageRows = data ?? [];
    rows.push(...pageRows);

    if (pageRows.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

function groupBy(items, keyFn) {
  const grouped = new Map();

  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    const current = grouped.get(key) ?? [];
    current.push(item);
    grouped.set(key, current);
  }

  return grouped;
}

function buildResult({ member, phoneNormalized, authUser, status }) {
  return {
    member_email: normalizeEmail(member.email),
    member_phone: member.phone ?? "",
    phone_normalized: phoneNormalized,
    member_current_user_id: member.user_id ?? "",
    auth_user_id: authUser?.id ?? "",
    auth_email: normalizeEmail(authUser?.email),
    status,
  };
}

async function main() {
  console.log(`DRY_RUN: ${DRY_RUN ? "true" : "false"}`);

  const [authUsers, members] = await Promise.all([
    listExistingAuthUsers(),
    listMembers(),
  ]);

  const authUsersByPhone = groupBy(authUsers, (user) => {
    const phoneNormalized = normalizeIsraeliPhoneToE164(user.phone);
    return isValidIsraeliMobileE164(phoneNormalized) ? phoneNormalized : "";
  });
  const membersByPhone = groupBy(members, (member) => {
    const phoneNormalized = normalizeIsraeliPhoneToE164(member.phone);
    return isValidIsraeliMobileE164(phoneNormalized) ? phoneNormalized : "";
  });
  const membersByUserId = new Map(
    members
      .filter((member) => member.user_id)
      .map((member) => [member.user_id, member])
  );

  const results = [];

  for (const member of members) {
    const phoneNormalized = normalizeIsraeliPhoneToE164(member.phone);

    if (!member.phone || !phoneNormalized) {
      results.push(buildResult({ member, phoneNormalized, authUser: null, status: "skipped_missing_member_phone" }));
      continue;
    }

    if (!isValidIsraeliMobileE164(phoneNormalized)) {
      results.push(buildResult({ member, phoneNormalized, authUser: null, status: "invalid_member_phone" }));
      continue;
    }

    const matchingMembers = membersByPhone.get(phoneNormalized) ?? [];
    if (matchingMembers.length > 1) {
      results.push(buildResult({ member, phoneNormalized, authUser: null, status: "conflict_multiple_members_same_phone" }));
      continue;
    }

    const matchingAuthUsers = authUsersByPhone.get(phoneNormalized) ?? [];
    if (matchingAuthUsers.length === 0) {
      results.push(buildResult({ member, phoneNormalized, authUser: null, status: "no_auth_user_with_phone" }));
      continue;
    }

    if (matchingAuthUsers.length > 1) {
      results.push(buildResult({ member, phoneNormalized, authUser: matchingAuthUsers[0], status: "conflict_multiple_auth_users_same_phone" }));
      continue;
    }

    const authUser = matchingAuthUsers[0];

    if (member.user_id === authUser.id) {
      results.push(buildResult({ member, phoneNormalized, authUser, status: "already_linked" }));
      continue;
    }

    if (member.user_id && member.user_id !== authUser.id) {
      results.push(buildResult({ member, phoneNormalized, authUser, status: "conflict_member_has_other_user_id" }));
      continue;
    }

    const existingMemberForAuthUser = membersByUserId.get(authUser.id);
    if (existingMemberForAuthUser && existingMemberForAuthUser.phone !== member.phone) {
      results.push(buildResult({ member, phoneNormalized, authUser, status: "conflict_auth_user_id_already_used_by_other_member" }));
      continue;
    }

    if (DRY_RUN) {
      results.push(buildResult({ member, phoneNormalized, authUser, status: "dry_run_would_link" }));
      continue;
    }

    const { error } = await supabase
      .from("members")
      .update({ user_id: authUser.id })
      .eq("phone", member.phone);

    if (error) {
      results.push(buildResult({ member, phoneNormalized, authUser, status: `error: ${error.message}` }));
      continue;
    }

    results.push(buildResult({ member, phoneNormalized, authUser, status: "linked" }));
  }

  await mkdir(RESULTS_DIR, { recursive: true });
  const output = [
    ["member_email", "member_phone", "phone_normalized", "member_current_user_id", "auth_user_id", "auth_email", "status"].map(csvEscape).join(","),
    ...results.map((result) => [
      result.member_email,
      result.member_phone,
      result.phone_normalized,
      result.member_current_user_id,
      result.auth_user_id,
      result.auth_email,
      result.status,
    ].map(csvEscape).join(",")),
  ].join("\n");

  await writeFile(RESULTS_PATH, `${output}\n`, "utf8");

  const summary = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Auth users checked: ${authUsers.length}`);
  console.log(`Members checked: ${members.length}`);
  console.log(`Results file: ${RESULTS_PATH}`);
  console.table(summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
