import { NextResponse } from "next/server";
import { subscribe, isValidEmail } from "@/lib/subscribers/repository";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "");
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "email 格式不正確" }, { status: 400 });
    }
    const source = typeof body?.source === "string" ? body.source : "site";
    const { ok } = await subscribe(email, source);
    return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
