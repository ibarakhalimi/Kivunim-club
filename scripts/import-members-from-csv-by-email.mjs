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
const RESULTS_PATH = path.join(RESULTS_DIR, `members-import-by-email-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`);

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

function groupMembersByEmail(members) {
  const map = new Map();

  for (const member of members) {
    const email = normalizeEmail(member.email);
    if (!email) continue;

    const existing = map.get(email) ?? [];
    existing.push(member);
    map.set(email, existing);
  }

  return map;
}

function buildMemberPayload(row) {
  const phoneNormalized = normalizeIsraeliPhoneToE164(row.phone);
  const payload = {
    email: normalizeEmail(row.email),
    name: row.name,
    phone: isValidIsraeliMobileE164(phoneNormalized) ? phoneNormalized : row.phone,
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

function buildResult({ row, member, status }) {
  return {
    row_number: row.rowNumber,
    email: normalizeEmail(row.email),
    phone: row.phone,
    phone_normalized: normalizeIsraeliPhoneToE164(row.phone),
    member_user_id: member?.user_id ?? "",
    status,
  };
}

async function updateMember(member, payload) {
  const query = supabase.from("members").update(payload);

  if (member.user_id) {
    return query.eq("user_id", member.user_id);
  }

  return query.eq("email", member.email);
}

async function main() {
  console.log(`Reading CSV: ${CSV_PATH}`);
  console.log(`DRY_RUN: ${DRY_RUN ? "true" : "false"}`);

  const csvText = await readFile(CSV_PATH, "utf8");
  const importRows = rowsToObjects(parseCsv(csvText));
  const members = await listExistingMembers();
  const membersByEmail = groupMembersByEmail(members);
  const seenCsvEmails = new Set();
  const results = [];

  for (const row of importRows) {
    const email = normalizeEmail(row.email);

    if (!email) {
      results.push(buildResult({ row, member: null, status: "skipped_missing_email" }));
      continue;
    }

    if (seenCsvEmails.has(email)) {
      results.push(buildResult({ row, member: null, status: "conflict_duplicate_csv_email" }));
      continue;
    }
    seenCsvEmails.add(email);

    const matchingMembers = membersByEmail.get(email) ?? [];

    if (matchingMembers.length === 0) {
      results.push(buildResult({ row, member: null, status: "no_member_for_email" }));
      continue;
    }

    if (matchingMembers.length > 1) {
      results.push(buildResult({ row, member: null, status: "conflict_multiple_members_same_email" }));
      continue;
    }

    const member = matchingMembers[0];
    const payload = buildMemberPayload(row);

    if (DRY_RUN) {
      results.push(buildResult({ row, member, status: "dry_run_would_update_by_email" }));
      continue;
    }

    const { error } = await updateMember(member, payload);

    if (error) {
      results.push(buildResult({ row, member, status: `error: ${error.message}` }));
      continue;
    }

    results.push(buildResult({ row, member, status: "updated_by_email" }));
  }

  await mkdir(RESULTS_DIR, { recursive: true });
  const output = [
    ["row_number", "email", "phone", "phone_normalized", "member_user_id", "status"].map(csvEscape).join(","),
    ...results.map((result) => [
      result.row_number,
      result.email,
      result.phone,
      result.phone_normalized,
      result.member_user_id,
      result.status,
    ].map(csvEscape).join(",")),
  ].join("\n");

  await writeFile(RESULTS_PATH, `${output}\n`, "utf8");

  const summary = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] ?? 0) + 1;
    return acc;
  }, {});

  console.log("Members import by email complete.");
  console.log(`Members checked: ${members.length}`);
  console.log(`Results file: ${RESULTS_PATH}`);
  console.table(summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
