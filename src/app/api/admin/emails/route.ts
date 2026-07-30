import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

/** List recent Resend emails (admin). */
export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured", data: [] },
        { status: 500 }
      );
    }
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Number(searchParams.get("limit") || 100));
    const emailId = searchParams.get("id");

    if (emailId) {
      const res = await fetch(`https://api.resend.com/emails/${encodeURIComponent(emailId)}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: data?.message || "Failed to load email" },
          { status: 502 }
        );
      }
      return NextResponse.json(data);
    }

    const res = await fetch(`https://api.resend.com/emails?limit=${limit}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "Failed to list emails", data: [] },
        { status: 502 }
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("admin emails", e);
    return NextResponse.json({ error: "Failed", data: [] }, { status: 500 });
  }
}
