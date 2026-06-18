import Link from "next/link";
import { Megaphone } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BottomNav } from "@/components/home/bottom-nav";
import { SwipeBackHome } from "./swipe-back-home";

export const dynamic = "force-dynamic";

type Update = {
  id: string;
  title: string;
  description: string | null;
  published_at: string;
  author: string | null;
  button_link_url: string | null;
  button_text: string | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function UpdatesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("updates")
    .select("*")
    .eq("is_active", true)
    .order("published_at", { ascending: false });

  const updates = (data ?? []) as Update[];

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#181A23",
        padding: "18px 14px 104px",
      }}
    >
      <SwipeBackHome />
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "-18px -14px 26px",
          background: "#111522",
          borderRadius: 0,
          padding: "26px 22px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(251,146,60,0.15)",
              color: "#FB923C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Megaphone size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#FFFFFF" }}>
              עדכונים
            </p>
          </div>
        </div>
        <Link
          href="/"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#252836",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "#FFFFFF",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
          }}
        >
          ←
        </Link>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {updates.map((update) => (
          <div key={update.id} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <p style={{ margin: "0 2px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, lineHeight: 1.2, color: "#FB923C" }}>
              {formatDate(update.published_at)}
            </p>
            <article
              style={{
                background: "#252836",
                border: "none",
                borderRadius: 22,
                padding: 18,
              }}
            >
              <h2 style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 21, lineHeight: 1.22, color: "#FFFFFF" }}>
                {update.title}
              </h2>
              {update.description && (
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 15.5, lineHeight: 1.7, color: "#B4B8C6" }}>
                  {update.description}
                </p>
              )}
              {update.button_link_url && update.button_text && (
                <a
                  href={update.button_link_url}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 14,
                    padding: "9px 14px",
                    borderRadius: 999,
                    background: "#FB923C",
                    color: "#fff",
                    textDecoration: "none",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 900,
                    fontSize: 13,
                  }}
                >
                  {update.button_text}
                </a>
              )}
            </article>
          </div>
        ))}
      </section>
      <BottomNav activeKey="updates" alwaysOpen />
    </main>
  );
}
