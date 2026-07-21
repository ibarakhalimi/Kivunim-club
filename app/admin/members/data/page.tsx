import { getMembers } from "../actions";
import { MemberDataChart } from "./member-data-chart";

export const dynamic = "force-dynamic";

function countBy(values: Array<string | null>) {
  const counts = new Map<string, number>();

  for (const value of values) {
    const label = value?.trim() || "לא צוין";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "he"));
}

export default async function MemberDataPage() {
  const members = await getMembers();
  const institutionData = countBy(members.map((member) => member.institution));
  const regionData = countBy(members.map((member) => member.region));

  return (
    <div dir="rtl" style={{ minHeight: "100dvh", background: "var(--color-surface-muted)", padding: "24px 16px 60px", fontFamily: "var(--font-family-sans)" }}>
      <h1 style={{ margin: "0 0 4px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-4xl)", color: "var(--color-admin-ink)" }}>
        נתוני חברי המועדון
      </h1>
      <p style={{ margin: "0 0 22px", fontSize: "var(--font-size-base)", color: "var(--color-text-secondary)" }}>
        התפלגות {members.length} החברים הרשומים לפי נתוני ההרשמה
      </p>
      <MemberDataChart institutionData={institutionData} regionData={regionData} />
    </div>
  );
}
