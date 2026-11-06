import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/require-admin";

/** List Clerk users with publicMetadata.role === admin */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList({ limit: 100 });
    const admins = data
      .filter((u) => (u.publicMetadata?.role as string) === "admin")
      .map((u) => ({
        id: u.id,
        user_id: u.id,
        role: "admin" as const,
        created_at: new Date(u.createdAt).toISOString(),
        email: u.emailAddresses[0]?.emailAddress ?? "",
        full_name:
          [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || null,
      }));
    return NextResponse.json(admins);
  } catch (e) {
    console.error("admin users GET", e);
    return NextResponse.json({ error: "Failed to load admins" }, { status: 500 });
  }
}

/** Grant admin: body { user_id } sets Clerk publicMetadata.role = admin */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const userId = String(body.user_id || "").trim();
    if (!userId) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = { ...(user.publicMetadata || {}), role: "admin" };
    await client.users.updateUser(userId, { publicMetadata: meta });
    return NextResponse.json({
      id: userId,
      user_id: userId,
      role: "admin",
      created_at: new Date().toISOString(),
      email: user.emailAddresses[0]?.emailAddress ?? "",
      full_name:
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null,
    });
  } catch (e) {
    console.error("admin users POST", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Grant failed" },
      { status: 500 }
    );
  }
}

/** Revoke admin: body { user_id } clears role */
export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const userId = String(body.user_id || "").trim();
    if (!userId) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = { ...(user.publicMetadata || {}) };
    delete (meta as { role?: string }).role;
    await client.users.updateUser(userId, { publicMetadata: meta });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin users DELETE", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Revoke failed" },
      { status: 500 }
    );
  }
}
