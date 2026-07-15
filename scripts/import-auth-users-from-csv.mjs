import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const CSV_PATH = process.env.CSV_PATH
  ? path.resolve(projectRoot, process.env.CSV_PATH)
  : path.join(projectRoot, "private", "imports", "members-import-check - memberstokivunimclub.csv");
const RESULTS_DIR = path.join(projectRoot, "private", "auth-import-results");
const RESULTS_PATH = path.join(RESULTS_DIR, `auth-users-import-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`);

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
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+972")) {
    return `+${digits}`;
  }

  if (digits.startsWith("972")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+972${digits.slice(1)}`;
  }

  return `+${digits}`;
}

function isValidIsraeliMobileE164(phone) {
  return /^\+9725\d{8}$/.test(phone);
}

function rowsToObjects(rows) {
  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((header) => header.trim());
  const emailIndex = headers.indexOf("email");
  const phoneIndex = headers.indexOf("phone");

  if (emailIndex === -1 || phoneIndex === -1) {
    throw new Error("CSV must include email and phone columns.");
  }

  return dataRows.map((row, index) => ({
    rowNumber: index + 2,
    email: (row[emailIndex] ?? "").trim(),
    phone: (row[phoneIndex] ?? "").trim(),
  }));
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

function buildExistingIndexes(users) {
  const emails = new Map();
  const phones = new Map();

  for (const user of users) {
    if (user.email) emails.set(normalizeEmail(user.email), user.id);
    if (user.phone) {
      const phoneNormalized = normalizeIsraeliPhoneToE164(user.phone);
      if (isValidIsraeliMobileE164(phoneNormalized)) {
        phones.set(phoneNormalized, user.id);
      }
    }
  }

  return { emails, phones };
}

async function main() {
  console.log(`Reading CSV: ${CSV_PATH}`);
  console.log(`DRY_RUN: ${DRY_RUN ? "true" : "false"}`);

  const csvText = await readFile(CSV_PATH, "utf8");
  const importRows = rowsToObjects(parseCsv(csvText));
  const existingUsers = await listExistingAuthUsers();
  const existing = buildExistingIndexes(existingUsers);
  const seenEmails = new Map(existing.emails);
  const seenPhones = new Map(existing.phones);
  const results = [];

  for (const row of importRows) {
    const email = normalizeEmail(row.email);
    const phone = row.phone.trim();
    const phoneNormalized = phone ? normalizeIsraeliPhoneToE164(phone) : "";

    if (!email || !phone) {
      results.push({ email, phone, phone_normalized: phoneNormalized, auth_user_id: "", status: `skipped_missing_email_or_phone_row_${row.rowNumber}` });
      continue;
    }

    if (!isValidIsraeliMobileE164(phoneNormalized)) {
      results.push({ email, phone, phone_normalized: phoneNormalized, auth_user_id: "", status: "invalid_phone" });
      continue;
    }

    const existingEmailUserId = seenEmails.get(email);
    const existingPhoneUserId = seenPhones.get(phoneNormalized);

    if (existingEmailUserId && existingPhoneUserId && existingEmailUserId !== existingPhoneUserId) {
      results.push({ email, phone, phone_normalized: phoneNormalized, auth_user_id: "", status: "conflict_email_and_phone" });
      continue;
    }

    if (existingEmailUserId || existingPhoneUserId) {
      results.push({
        email,
        phone,
        phone_normalized: phoneNormalized,
        auth_user_id: existingEmailUserId ?? existingPhoneUserId,
        status: existingEmailUserId ? "skipped_existing_email" : "skipped_existing_phone",
      });
      continue;
    }

    if (DRY_RUN) {
      seenEmails.set(email, "__dry_run_user__");
      seenPhones.set(phoneNormalized, "__dry_run_user__");
      results.push({ email, phone, phone_normalized: phoneNormalized, auth_user_id: "", status: "dry_run_would_create" });
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      phone: phoneNormalized,
    });

    if (error) {
      results.push({ email, phone, phone_normalized: phoneNormalized, auth_user_id: "", status: `error: ${error.message}` });
      continue;
    }

    const createdUserId = data.user?.id ?? "";
    seenEmails.set(email, createdUserId);
    seenPhones.set(phoneNormalized, createdUserId);
    results.push({ email, phone, phone_normalized: phoneNormalized, auth_user_id: createdUserId, status: "created" });
  }

  await mkdir(RESULTS_DIR, { recursive: true });
  const output = [
    ["email", "phone", "phone_normalized", "auth_user_id", "status"].map(csvEscape).join(","),
    ...results.map((result) => [
      result.email,
      result.phone,
      result.phone_normalized,
      result.auth_user_id,
      result.status,
    ].map(csvEscape).join(",")),
  ].join("\n");

  await writeFile(RESULTS_PATH, `${output}\n`, "utf8");

  const summary = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] ?? 0) + 1;
    return acc;
  }, {});

  console.log("Import complete.");
  console.log(`Results file: ${RESULTS_PATH}`);
  console.table(summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
