import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: settings } = await supabase
    .from("app_settings")
    .select("test_mode")
    .eq("id", "main")
    .maybeSingle();

  if (settings?.test_mode ?? true) {
    return response;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const welcomeUrl = new URL("/welcome", request.url);
    welcomeUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(welcomeUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/check-in/:path*",
  ],
};
