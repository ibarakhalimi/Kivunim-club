import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const CSV_PATH = process.env.CSV_PATH
  ? path.resolve(projectRoot, process.env.CSV_PATH)
  : path.join(projectRoot, "private", "imports", "member-load-2.csv");
const RESULTS_DIR = path.join(projectRoot, "private", "member-import-results");
const RESULTS_PATH = path.join(RESULTS_DIR, `auth-members-import-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`);

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

function normalizeHeader(header) {
  return header.trim().replaceAll(" ", "_");
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function normalizeIsraeliPhoneToE164(phone) {
  const trimmed = String(phone ?? "").trim();
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
  const headers = headerRow.map(normalizeHeader);
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

function groupBy(items, getKey) {
  const map = new Map();

  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;

    const existing = map.get(key) ?? [];
    existing.push(item);
    map.set(key, existing);
  }

  return map;
}

function oneOrConflict(map, key) {
  const matches = map.get(key) ?? [];
  if (matches.length === 0) return { item: null, conflict: false };
  if (matches.length === 1) return { item: matches[0], conflict: false };
  return { item: null, conflict: true };
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

function buildResult({ row, phoneNormalized, authUserId, authStatus, memberStatus }) {
  return {
    row_number: row.rowNumber,
    email: normalizeEmail(row.email),
    phone: row.phone,
    phone_normalized: phoneNormalized,
    auth_user_id: authUserId,
    auth_status: authStatus,
    member_status: memberStatus,
  };
}

async function updateMemberByUserId(userId, payload) {
  return supabase
    .from("members")
    .update(payload)
    .eq("user_id", userId);
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

  const authByEmail = groupBy(authUsers, (user) => normalizeEmail(user.email));
  const authByPhone = groupBy(authUsers, (user) => {
    const phoneNormalized = normalizeIsraeliPhoneToE164(user.phone);
    return isValidIsraeliMobileE164(phoneNormalized) ? phoneNormalized : "";
  });
  const membersByUserId = new Map(members.filter((member) => member.user_id).map((member) => [member.user_id, member]));
  const membersByEmail = groupBy(members, (member) => normalizeEmail(member.email));
  const seenCsvEmails = new Set();
  const seenCsvPhones = new Set();
  const results = [];

  for (const row of importRows) {
    const email = normalizeEmail(row.email);
    const phoneNormalized = normalizeIsraeliPhoneToE164(row.phone);

    if (!email || !row.phone) {
      results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus: "skipped_missing_email_or_phone", memberStatus: "skipped" }));
      continue;
    }

    if (!isValidIsraeliMobileE164(phoneNormalized)) {
      results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus: "invalid_phone", memberStatus: "skipped" }));
      continue;
    }

    if (seenCsvEmails.has(email)) {
      results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus: "conflict_duplicate_csv_email", memberStatus: "skipped" }));
      continue;
    }

    if (seenCsvPhones.has(phoneNormalized)) {
      results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus: "conflict_duplicate_csv_phone", memberStatus: "skipped" }));
      continue;
    }

    seenCsvEmails.add(email);
    seenCsvPhones.add(phoneNormalized);

    const emailLookup = oneOrConflict(authByEmail, email);
    const phoneLookup = oneOrConflict(authByPhone, phoneNormalized);

    if (emailLookup.conflict) {
      results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus: "conflict_multiple_auth_users_same_email", memberStatus: "skipped" }));
      continue;
    }

    if (phoneLookup.conflict) {
      results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus: "conflict_multiple_auth_users_same_phone", memberStatus: "skipped" }));
      continue;
    }

    if (emailLookup.item && phoneLookup.item && emailLookup.item.id !== phoneLookup.item.id) {
      results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus: "conflict_email_and_phone_auth_users", memberStatus: "skipped" }));
      continue;
    }

    let authUser = emailLookup.item ?? phoneLookup.item;
    let authStatus = authUser ? "skipped_existing_auth_user" : "dry_run_would_create_auth_user";

    if (!DRY_RUN && !authUser) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        phone: phoneNormalized,
      });

      if (error) {
        results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus: `error: ${error.message}`, memberStatus: "skipped" }));
        continue;
      }

      authUser = data.user;
      authStatus = "created_auth_user";
    }

    const authUserId = authUser?.id ?? "";
    const memberByUserId = authUserId ? membersByUserId.get(authUserId) : null;
    const memberEmailLookup = oneOrConflict(membersByEmail, email);

    if (memberEmailLookup.conflict) {
      results.push(buildResult({ row, phoneNormalized, authUserId, authStatus, memberStatus: "conflict_multiple_members_same_email" }));
      continue;
    }

    if (memberEmailLookup.item && authUserId && memberEmailLookup.item.user_id !== authUserId) {
      results.push(buildResult({ row, phoneNormalized, authUserId, authStatus, memberStatus: "conflict_member_email_user_id_mismatch" }));
      continue;
    }

    if (DRY_RUN) {
      const memberStatus = memberByUserId || memberEmailLookup.item
        ? "dry_run_would_update_member"
        : "dry_run_would_update_member_after_auth_trigger";
      results.push(buildResult({ row, phoneNormalized, authUserId, authStatus, memberStatus }));
      continue;
    }

    if (!authUserId) {
      results.push(buildResult({ row, phoneNormalized, authUserId: "", authStatus, memberStatus: "skipped_missing_auth_user_id" }));
      continue;
    }

    const payload = buildMemberPayload(row, phoneNormalized, authUserId);
    const { error } = await updateMemberByUserId(authUserId, payload);

    if (error) {
      results.push(buildResult({ row, phoneNormalized, authUserId, authStatus, memberStatus: `error: ${error.message}` }));
      continue;
    }

    membersByUserId.set(authUserId, payload);
    membersByEmail.set(email, [payload]);
    results.push(buildResult({ row, phoneNormalized, authUserId, authStatus, memberStatus: "updated_member" }));
  }

  await mkdir(RESULTS_DIR, { recursive: true });
  const output = [
    ["row_number", "email", "phone", "phone_normalized", "auth_user_id", "auth_status", "member_status"].map(csvEscape).join(","),
    ...results.map((result) => [
      result.row_number,
      result.email,
      result.phone,
      result.phone_normalized,
      result.auth_user_id,
      result.auth_status,
      result.member_status,
    ].map(csvEscape).join(",")),
  ].join("\n");

  await writeFile(RESULTS_PATH, `${output}\n`, "utf8");

  const summary = results.reduce((acc, result) => {
    const key = `${result.auth_status} / ${result.member_status}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  console.log("Auth and members import complete.");
  console.log(`CSV rows checked: ${importRows.length}`);
  console.log(`Auth users checked: ${authUsers.length}`);
  console.log(`Members checked: ${members.length}`);
  console.log(`Results file: ${RESULTS_PATH}`);
  console.table(summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
