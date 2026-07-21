import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// 只跑在 /admin 子樹(其餘頁面不需要,省開銷)。
export const config = {
  matcher: ["/admin/:path*"],
};
