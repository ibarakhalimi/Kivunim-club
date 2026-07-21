import { getMembers } from "./actions";
import { MembersTable } from "./members-table";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div dir="rtl" style={{ minHeight: "100dvh", background: "var(--color-surface-muted)", padding: "24px 16px 60px", fontFamily: "var(--font-family-sans)" }}>
      <h1 style={{ margin: "0 0 4px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-4xl)", color: "var(--color-admin-ink)" }}>
        חברי מועדון
      </h1>
      <p style={{ margin: "0 0 22px", fontSize: "var(--font-size-base)", color: "var(--color-text-secondary)" }}>
        כל החברים הרשומים במועדון והפרטים שמסרו בהרשמה
      </p>
      <MembersTable initialMembers={members} />
    </div>
  );
}
