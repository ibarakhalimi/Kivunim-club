import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const CSV_PATH = process.env.CSV_PATH
  ? path.resolve(projectRoot, process.env.CSV_PATH)
  : path.join(projectRoot, "private", "imports", "check-4.csv");
const RESULTS_DIR = path.join(projectRoot, "private", "member-import-results");
const RESULTS_PATH = path.join(RESULTS_DIR, `members-import-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`);

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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim() !== "")) rows.push(row);

  return rows;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizeIsraeliPhoneToE164(phone) {
  const trimmed = String(phone ?? "").trim();
  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+972")) return `+${digits}`;
  if (digits.startsWith("972")) return `+${digits}`;
  if (digits.startsWith("0")) return `+972${digits.slice(1)}`;
  return `+${digits}`;
}

function isValidIsraeliMobileE164(phone) {
  return /^\+9725\d{8}$/.test(phone);
}

function dateOrNull(value) {
  const trimmed = String(value ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

function timestamptzOrNull(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed && !Number.isNaN(Date.parse(trimmed)) ? trimmed : null;
}

function rowsToObjects(rows) {
  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((header) => header.trim());
  const requiredHeaders = ["phone", "name", "email", "institution", "degree", "study_year", "region", "birth_date", "role", "created_at"];

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`CSV must include ${header} column`);
    }
  }

  return dataRows.map((row, index) => {
    const get = (header) => (row[headers.indexOf(header)] ?? "").trim();

    return {
      rowNumber: index + 2,
      phone: get("phone"),
      name: get("name"),
      email: get("email"),
      institution: get("institution"),
      degree: get("degree"),
      study_year: get("study_year"),
      region: get("region"),
      birth_date: get("birth_date"),
      role: get("role") || "member",
      created_at: get("created_at"),
    };
  });
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

async function listExistingMembers() {
  const members = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .range(from, to);

    if (error) {
      throw new Error(`Failed to list members from row ${from}: ${error.message}`);
    }

    const pageMembers = data ?? [];
    members.push(...pageMembers);

    if (pageMembers.length < pageSize) break;
    from += pageSize;
  }

  return members;
}

function groupByNormalizedPhone(items, getPhone) {
  const map = new Map();

  for (const item of items) {
    const phone = getPhone(item);
    if (!phone) continue;

    const phoneNormalized = normalizeIsraeliPhoneToE164(phone);
    if (!isValidIsraeliMobileE164(phoneNormalized)) continue;

    const existing = map.get(phoneNormalized) ?? [];
    existing.push(item);
    map.set(phoneNormalized, existing);
  }

  return map;
}

function buildMemberPayload(row, phoneNormalized, authUserId) {
  const payload = {
    user_id: authUserId,
    email: normalizeEmail(row.email),
    name: row.name,
    phone: phoneNormalized,
    role: row.role || "member",
    institution: row.institution,
    degree: row.degree,
    study_year: row.study_year,
    region: row.region,
  };

  const birthDate = dateOrNull(row.birth_date);
  if (birthDate) payload.birth_date = birthDate;

  const createdAt = timestamptzOrNull(row.created_at);
  if (createdAt) payload.created_at = createdAt;

  return payload;
}

function buildResult({ row, phoneNormalized, authUser, targetMember, status }) {
  return {
    row_number: row.rowNumber,
    email: normalizeEmail(row.email),
    phone: row.phone,
    phone_normalized: phoneNormalized,
    auth_user_id: authUser?.id ?? "",
    target_member_user_id: targetMember?.user_id ?? "",
    status,
  };
}

async function main() {
  console.log(`Reading CSV: ${CSV_PATH}`);
  console.log(`DRY_RUN: ${DRY_RUN ? "true" : "false"}`);

  const csvText = await readFile(CSV_PATH, "utf8");
  const importRows = rowsToObjects(parseCsv(csvText));
  const [authUsers, members] = await Promise.all([
    listExistingAuthUsers(),
    listExistingMembers(),
  ]);

  const authUsersByPhone = groupByNormalizedPhone(authUsers, (user) => user.phone);
  const membersByPhone = groupByNormalizedPhone(members, (member) => member.phone);
  const membersByUserId = new Map(members.filter((member) => member.user_id).map((member) => [member.user_id, member]));
  const seenCsvPhones = new Set();
  const results = [];

  for (const row of importRows) {
    const phoneNormalized = row.phone ? normalizeIsraeliPhoneToE164(row.phone) : "";

    if (!row.email || !row.phone) {
      results.push(buildResult({ row, phoneNormalized, authUser: null, targetMember: null, status: "skipped_missing_email_or_phone" }));
      continue;
    }

    if (!isValidIsraeliMobileE164(phoneNormalized)) {
      results.push(buildResult({ row, phoneNormalized, authUser: null, targetMember: null, status: "invalid_phone" }));
      continue;
    }

    if (seenCsvPhones.has(phoneNormalized)) {
      results.push(buildResult({ row, phoneNormalized, authUser: null, targetMember: null, status: "conflict_duplicate_csv_phone" }));
      continue;
    }
    seenCsvPhones.add(phoneNormalized);

    const matchingAuthUsers = authUsersByPhone.get(phoneNormalized) ?? [];
    if (matchingAuthUsers.length === 0) {
      results.push(buildResult({ row, phoneNormalized, authUser: null, targetMember: null, status: "no_auth_user_for_phone" }));
      continue;
    }

    if (matchingAuthUsers.length > 1) {
      results.push(buildResult({ row, phoneNormalized, authUser: null, targetMember: null, status: "conflict_multiple_auth_users_same_phone" }));
      continue;
    }

    const authUser = matchingAuthUsers[0];
    const matchingMembersByPhone = membersByPhone.get(phoneNormalized) ?? [];
    if (matchingMembersByPhone.length > 1) {
      results.push(buildResult({ row, phoneNormalized, authUser, targetMember: null, status: "conflict_multiple_members_same_phone" }));
      continue;
    }

    const memberByPhone = matchingMembersByPhone[0] ?? null;
    const memberByAuthUserId = membersByUserId.get(authUser.id) ?? null;

    if (memberByPhone && memberByPhone.user_id !== authUser.id) {
      results.push(buildResult({ row, phoneNormalized, authUser, targetMember: memberByPhone, status: "conflict_member_phone_user_id_mismatch" }));
      continue;
    }

    const targetMember = memberByPhone ?? memberByAuthUserId ?? null;
    const payload = buildMemberPayload(row, phoneNormalized, authUser.id);

    if (DRY_RUN) {
      const status = targetMember
        ? (memberByPhone ? "dry_run_would_update_by_phone" : "dry_run_would_update_by_auth_user")
        : "dry_run_would_insert";
      results.push(buildResult({ row, phoneNormalized, authUser, targetMember, status }));
      continue;
    }

    if (targetMember) {
      const { error } = await supabase
        .from("members")
        .update(payload)
        .eq("user_id", targetMember.user_id);

      if (error) {
        results.push(buildResult({ row, phoneNormalized, authUser, targetMember, status: `error: ${error.message}` }));
        continue;
      }

      const status = memberByPhone ? "updated_by_phone" : "updated_by_auth_user";
      results.push(buildResult({ row, phoneNormalized, authUser, targetMember, status }));
      continue;
    }

    const { error } = await supabase
      .from("members")
      .insert(payload);

    if (error) {
      results.push(buildResult({ row, phoneNormalized, authUser, targetMember: null, status: `error: ${error.message}` }));
      continue;
    }

    membersByUserId.set(authUser.id, payload);
    membersByPhone.set(phoneNormalized, [payload]);
    results.push(buildResult({ row, phoneNormalized, authUser, targetMember: payload, status: "inserted" }));
  }

  await mkdir(RESULTS_DIR, { recursive: true });
  const output = [
    ["row_number", "email", "phone", "phone_normalized", "auth_user_id", "target_member_user_id", "status"].map(csvEscape).join(","),
    ...results.map((result) => [
      result.row_number,
      result.email,
      result.phone,
      result.phone_normalized,
      result.auth_user_id,
      result.target_member_user_id,
      result.status,
    ].map(csvEscape).join(",")),
  ].join("\n");

  await writeFile(RESULTS_PATH, `${output}\n`, "utf8");

  const summary = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] ?? 0) + 1;
    return acc;
  }, {});

  console.log("Members import complete.");
  console.log(`Auth users checked: ${authUsers.length}`);
  console.log(`Members checked: ${members.length}`);
  console.log(`Results file: ${RESULTS_PATH}`);
  console.table(summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
