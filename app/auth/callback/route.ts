import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user?.email) {
      return NextResponse.redirect(`${origin}/?error=auth_failed`);
    }

    // Check the allowlist
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("email", data.user.email)
      .maybeSingle();

    if (!member) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/?error=not_a_member`);
    }
  }

  return NextResponse.redirect(`${origin}/`);
}