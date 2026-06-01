import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) =>
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → send to /welcome
  if (!user) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  return response;
}

// Which routes the middleware runs on (skip public ones + assets)
export const config = {
  matcher: [
    "/((?!welcome|auth|_next/static|_next/image|favicon.ico|manifest|sw.js).*)",
  ],
};