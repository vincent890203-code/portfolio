"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function SignOutButton() {
  const router = useRouter();
  const signOut = async () => {
    await createSupabaseBrowser().auth.signOut();
    router.push("/login");
    router.refresh();
  };
  return (
    <button
      onClick={signOut}
      className="font-mono text-xs text-dim transition-colors hover:text-warm"
    >
      登出
    </button>
  );
}
