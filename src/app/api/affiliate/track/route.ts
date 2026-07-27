import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { resolveAffiliateByCode } from "@/db/affiliates";
import { AFFILIATE_COOKIE_DAYS, AFFILIATE_COOKIE_NAME } from "@/lib/affiliate-constants";

function clearCookie(res: NextResponse) {
  res.cookies.set(AFFILIATE_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = String(body?.code || "")
      .trim()
      .toLowerCase();
    if (!code) {
      const res = NextResponse.json({ error: "Missing affiliate code" }, { status: 400 });
      clearCookie(res);
      return res;
    }

    const affiliate = await resolveAffiliateByCode(code);
    if (!affiliate) {
      const res = NextResponse.json({ error: "Invalid affiliate code" }, { status: 404 });
      clearCookie(res);
      return res;
    }

    const res = NextResponse.json({
      ok: true,
      code: affiliate.code,
      name: affiliate.name,
    });
    res.cookies.set(AFFILIATE_COOKIE_NAME, affiliate.code, {
      path: "/",
      maxAge: AFFILIATE_COOKIE_DAYS * 24 * 60 * 60,
      sameSite: "lax",
      httpOnly: false,
    });
    return res;
  } catch (e) {
    console.error("affiliate track error", e);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}

export async function GET() {
  const jar = await cookies();
  const code = jar.get(AFFILIATE_COOKIE_NAME)?.value || null;
  return NextResponse.json({ code });
}
