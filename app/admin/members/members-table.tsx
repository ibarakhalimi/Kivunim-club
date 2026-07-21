"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { getMembers, type MemberFilters, type MemberRow } from "./actions";

const EMPTY_FILTERS: MemberFilters = {
  search: "",
  name: "",
  email: "",
  phone: "",
  institution: "",
  degree: "",
  studyYear: "",
  region: "",
  birthDate: "",
  role: "",
  privacyConsent: "",
  createdDate: "",
};

function uniqueValues(members: MemberRow[], key: "institution" | "degree" | "study_year" | "region" | "role") {
  return [...new Set(members.map((member) => member[key]).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, "he"));
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`);
  return date.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function MembersTable({ initialMembers }: { initialMembers: MemberRow[] }) {
  const [filters, setFilters] = useState<MemberFilters>(EMPTY_FILTERS);
  const [members, setMembers] = useState(initialMembers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const isFirstRender = useRef(true);

  const options = useMemo(() => ({
    institutions: uniqueValues(initialMembers, "institution"),
    degrees: uniqueValues(initialMembers, "degree"),
    studyYears: uniqueValues(initialMembers, "study_year"),
    regions: uniqueValues(initialMembers, "region"),
    roles: uniqueValues(initialMembers, "role"),
  }), [initialMembers]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentRequest = ++requestId.current;
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setError("");
      try {
        const nextMembers = await getMembers(filters);
        if (requestId.current === currentRequest) setMembers(nextMembers);
      } catch {
        if (requestId.current === currentRequest) setError("לא הצלחנו לעדכן את רשימת החברים");
      } finally {
        if (requestId.current === currentRequest) setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [filters]);

  function updateFilter<K extends keyof MemberFilters>(key: K, value: MemberFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <section>
      <div style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-2xl)", padding: 14, marginBottom: 14 }}>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <Search size={18} strokeWidth={2.2} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)", pointerEvents: "none" }} />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="חיפוש חופשי בכל העמודות..."
            aria-label="חיפוש חברים"
            style={{ ...filterControlStyle, width: "100%", paddingRight: 40 }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
          <FilterInput label="שם" value={filters.name} onChange={(value) => updateFilter("name", value)} />
          <FilterInput label="אימייל" value={filters.email} onChange={(value) => updateFilter("email", value)} />
          <FilterInput label="טלפון" value={filters.phone} onChange={(value) => updateFilter("phone", value)} />
          <FilterSelect label="מוסד לימוד" value={filters.institution} options={options.institutions} onChange={(value) => updateFilter("institution", value)} />
          <FilterSelect label="תואר" value={filters.degree} options={options.degrees} onChange={(value) => updateFilter("degree", value)} />
          <FilterSelect label="שנת לימוד" value={filters.studyYear} options={options.studyYears} onChange={(value) => updateFilter("studyYear", value)} />
          <FilterSelect label="אזור מגורים" value={filters.region} options={options.regions} onChange={(value) => updateFilter("region", value)} />
          <FilterInput label="תאריך לידה" type="date" value={filters.birthDate} onChange={(value) => updateFilter("birthDate", value)} />
          <FilterSelect label="תפקיד" value={filters.role} options={options.roles} onChange={(value) => updateFilter("role", value)} />
          <FilterSelect label="אישור פרטיות" value={filters.privacyConsent} options={["yes", "no"]} optionLabels={{ yes: "אושר", no: "לא אושר" }} onChange={(value) => updateFilter("privacyConsent", value)} />
          <FilterInput label="תאריך הרשמה" type="date" value={filters.createdDate} onChange={(value) => updateFilter("createdDate", value)} />
        </div>

        <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} style={{ marginTop: 10, minHeight: 36, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-lg)", background: "var(--color-surface-muted)", color: "var(--color-admin-ink)", padding: "0 12px", display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", cursor: "pointer" }}>
          <RotateCcw size={15} strokeWidth={2.2} />
          איפוס פילטרים
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--font-weight-black)", color: "var(--color-admin-ink)" }}>
          {members.length} חברים
        </p>
        {isLoading && <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-brand-blue)" }}>מעדכן...</span>}
      </div>

      {error && <p style={{ color: "var(--color-danger)", fontWeight: "var(--font-weight-bold)" }}>{error}</p>}

      <div style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-2xl)", overflowX: "auto", opacity: isLoading ? 0.65 : 1, transition: "opacity 0.15s ease" }}>
        <table style={{ width: "100%", minWidth: 1320, borderCollapse: "collapse", textAlign: "right" }}>
          <thead>
            <tr style={{ background: "var(--color-surface-muted)" }}>
              {["שם", "אימייל", "טלפון", "מוסד", "תואר", "שנה", "אזור", "תאריך לידה", "תפקיד", "פרטיות", "תאריך הרשמה"].map((heading) => (
                <th key={heading} style={headerCellStyle}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.user_id}>
                <Cell strong>{member.name}</Cell>
                <Cell>{member.email}</Cell>
                <Cell>{member.phone}</Cell>
                <Cell>{member.institution}</Cell>
                <Cell>{member.degree}</Cell>
                <Cell>{member.study_year}</Cell>
                <Cell>{member.region}</Cell>
                <Cell>{formatDate(member.birth_date)}</Cell>
                <Cell>{member.role === "admin" ? "מנהל" : "חבר"}</Cell>
                <Cell>{member.privacy_consent ? "אושר" : "לא אושר"}</Cell>
                <Cell>{formatDate(member.created_at)}</Cell>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && members.length === 0 && (
          <p style={{ margin: 0, padding: 28, textAlign: "center", color: "var(--color-text-secondary)", fontWeight: "var(--font-weight-bold)" }}>לא נמצאו חברים שתואמים לפילטרים</p>
        )}
      </div>
    </section>
  );
}

function FilterInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "date" }) {
  return (
    <label style={filterLabelStyle}>
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} style={filterControlStyle} />
    </label>
  );
}

function FilterSelect({ label, value, options, onChange, optionLabels = {} }: { label: string; value: string; options: string[]; onChange: (value: string) => void; optionLabels?: Record<string, string> }) {
  return (
    <label style={filterLabelStyle}>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} style={filterControlStyle}>
        <option value="">הכול</option>
        {options.map((option) => <option key={option} value={option}>{optionLabels[option] ?? option}</option>)}
      </select>
    </label>
  );
}

function Cell({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--color-border-subtle)", color: strong ? "var(--color-admin-ink)" : "var(--color-slate-600)", fontSize: "var(--font-size-sm)", fontWeight: strong ? "var(--font-weight-extrabold)" : "var(--font-weight-semibold)", whiteSpace: "nowrap" }}>{children || "—"}</td>;
}

const filterLabelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 5, color: "var(--color-text-secondary)", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-extrabold)" };
const filterControlStyle: React.CSSProperties = { minHeight: 40, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--shape-radius-lg)", background: "var(--color-surface-muted)", color: "var(--color-admin-ink)", padding: "0 10px", fontFamily: "var(--font-family-sans)", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", outline: "none", boxSizing: "border-box" };
const headerCellStyle: React.CSSProperties = { padding: "11px 10px", borderBottom: "1px solid var(--color-border-subtle)", color: "var(--color-text-secondary)", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-black)", whiteSpace: "nowrap" };
