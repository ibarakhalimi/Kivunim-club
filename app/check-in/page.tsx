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

  return (
    <CheckInResult
      ok
      title="כיף שבאת!"
      description="הצ׳קאין נשמר בהצלחה."
    />
  );
}

function CheckInResult({ ok, title, description }: { ok: boolean; title: string; description: string }) {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: ok ? "#F0FDF4" : "#FFF7ED",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "var(--font-rubik)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          borderRadius: 28,
          background: "#fff",
          border: `1px solid ${ok ? "#BBF7D0" : "#FED7AA"}`,
          padding: "30px 22px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: ok ? "#DCFCE7" : "#FFEDD5",
            color: ok ? "#16A34A" : "#EA580C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          {ok ? <CheckCircle2 size={42} strokeWidth={2.4} /> : <TriangleAlert size={40} strokeWidth={2.35} />}
        </div>
        <h1 style={{ margin: "0 0 6px", fontSize: 27, lineHeight: 1.1, fontWeight: 900, color: "#0F172A" }}>
          {title}
        </h1>
        <p style={{ margin: "0 0 22px", fontSize: 14, lineHeight: 1.55, fontWeight: 600, color: "#64748B" }}>
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
            borderRadius: 16,
            background: ok ? "#16A34A" : "#EA580C",
            color: "#fff",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          חזרה לאפליקציה
        </Link>
      </div>
    </main>
  );
}
