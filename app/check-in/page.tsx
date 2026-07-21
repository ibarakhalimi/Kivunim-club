import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { checkIn } from "@/app/actions/check-in";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const VALID_TOKENS = new Set(["kivunim:checkin:main"]);

type CheckInPageProps = {
  searchParams: Promise<{
    token?: string;
    location?: string;
  }>;
};

export default async function CheckInPage({ searchParams }: CheckInPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";
  const location = params.location ?? "main";
  const checkInPath = `/check-in?token=${encodeURIComponent(token)}&location=${encodeURIComponent(location)}`;

  if (!VALID_TOKENS.has(token)) {
    return (
      <CheckInResult
        ok={false}
        title="הקישור לא תקין"
        description="לא ניתן לאשר צ׳קאין מהקוד הזה."
      />
    );
  }

  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();

  if (!user) {
    redirect(`/welcome?next=${encodeURIComponent(checkInPath)}`);
  }

  const result = await checkIn({
    source: "qr_link",
    qrPayload: checkInPath,
  });

  if (result?.error) {
    return (
      <CheckInResult
        ok={false}
        title="לא הצלחנו לשמור הגעה"
        description={result.error}
      />
    );
  }

  redirect("/?checkin=success");
}

function CheckInResult({ ok, title, description }: { ok: boolean; title: string; description: string }) {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: ok ? "var(--color-green-50)" : "var(--color-orange-50)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "var(--font-family-sans)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          borderRadius: "var(--shape-radius-7xl)",
          background: "var(--color-surface-raised)",
          border: `1px solid ${ok ? "var(--color-green-200)" : "var(--color-orange-200)"}`,
          padding: "30px 22px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "var(--shape-radius-circle)",
            background: ok ? "var(--color-green-100)" : "var(--color-orange-100)",
            color: ok ? "var(--color-success)" : "var(--color-orange-600)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          {ok ? <CheckCircle2 size={42} strokeWidth={2.4} /> : <TriangleAlert size={40} strokeWidth={2.35} />}
        </div>
        <h1 style={{ margin: "0 0 6px", fontSize: "var(--font-size-5xl)", lineHeight: 1.1, fontWeight: "var(--font-weight-black)", color: "var(--color-ink)" }}>
          {title}
        </h1>
        <p style={{ margin: "0 0 22px", fontSize: "var(--font-size-base)", lineHeight: 1.55, fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)" }}>
          {description}
        </p>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 46,
            borderRadius: "var(--shape-radius-2xl)",
            background: ok ? "var(--color-success)" : "var(--color-orange-600)",
            color: "var(--color-on-accent)",
            textDecoration: "none",
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-black)",
          }}
        >
          חזרה לאפליקציה
        </Link>
      </div>
    </main>
  );
}
