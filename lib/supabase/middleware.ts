import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 刷新 session cookie,並守門 /admin。
// Fail-closed:沒設 Supabase env 或未登入 → /admin 一律導去 /login。
export async function updateSession(
  request: NextRequest
): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return isAdmin ? redirectToLogin(request) : response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() 會向 auth server 驗 token(比 getSession 安全)。
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdmin && !user) return redirectToLogin(request);
  return response;
}

function redirectToLogin(request: NextRequest): NextResponse {
  const redirect = request.nextUrl.clone();
  redirect.pathname = "/login";
  redirect.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(redirect);
}
