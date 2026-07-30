import {
  isValidAffiliateCode,
  normalizeAffiliateCode,
  toAffiliateCode,
} from "@/lib/affiliate-constants";
import { affiliates, orders } from "@/db/schema";
import {
  getAffiliateStats,
  getAffiliateStatsForMany,
  listAffiliateAttributedOrders,
  listAffiliateCommissions,
  listAllAffiliateActivity,
  reconcileAffiliateCommissions,
} from "@/db/affiliates";
import { getDefaultAffiliateCommissionRate } from "@/db/settings";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { NextResponse } from "next/server";

function isUniqueViolation(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  return /unique|duplicate key/i.test(msg);
}

function statusMessage(status: string) {
  if (status === "pending") return "Your affiliate account is awaiting admin approval.";
  if (status === "inactive") return "Your affiliate account is suspended.";
  return null;
}

function isRealClerkUserId(id: string | null | undefined): boolean {
  return !!id && /^user_[a-zA-Z0-9]+$/.test(id);
}

/** Empty → null; invalid non-empty → throw-style error payload for callers. */
function parseOptionalClerkUserId(
  raw: unknown
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true, value: null };
  }
  const value = String(raw).trim();
  if (!value) return { ok: true, value: null };
  if (!isRealClerkUserId(value)) {
    return {
      ok: false,
      error:
        "clerk_user_id must be a real Clerk id starting with user_ (or leave blank to link by email on sign-in)",
    };
  }
  return { ok: true, value };
}

async function claimByEmail(
  db: ReturnType<typeof getDb>,
  userId: string,
  email: string
) {
  if (!email) return null;
  const [row] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.email, email))
    .limit(1);
  if (!row) return null;

  // Already correctly linked to this Clerk user
  if (row.clerkUserId === userId) return row;

  // Linked to a different real Clerk account — do not steal
  if (isRealClerkUserId(row.clerkUserId) && row.clerkUserId !== userId) {
    return null;
  }

  // Unlinked or invalid placeholder clerk id (e.g. admin typed a code) — bind now
  const [claimed] = await db
    .update(affiliates)
    .set({ clerkUserId: userId, updatedAt: new Date() })
    .where(eq(affiliates.id, row.id))
    .returning();
  return claimed ?? row;
}

async function loadPersonalAffiliate(
  db: ReturnType<typeof getDb>,
  userId: string,
  email: string
) {
  const [byClerk] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.clerkUserId, userId))
    .limit(1);
  if (byClerk) return byClerk;
  return claimByEmail(db, userId, email);
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    // Always resolve email/role from Clerk user — JWT claims often omit email
    const user = await currentUser();
    const role = (user?.publicMetadata?.role as string) || "";
    const email = (
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      ""
    )
      .trim()
      .toLowerCase();
    const isAdmin = role === "admin";

    const { searchParams } = new URL(req.url);
    // Admin dashboard requests full list; affiliate page uses personal view
    const wantAdminList = isAdmin && searchParams.get("all") === "1";

    if (wantAdminList) {
      const reconciled = await reconcileAffiliateCommissions();
      const activity = await listAllAffiliateActivity(200);
      const statsMap = await getAffiliateStatsForMany(activity.affiliates.map((a) => a.id));
      const withStats = activity.affiliates.map((a) => ({
        ...a,
        stats: statsMap.get(a.id) ?? {
          confirmedOrders: 0,
          totalSales: 0,
          totalEarnings: 0,
        },
      }));
      return NextResponse.json({
        role: "admin",
        affiliates: withStats,
        commissions: activity.commissions,
        reconciled,
      });
    }

    const affiliate = await loadPersonalAffiliate(db, userId, email);
    if (!affiliate) {
      return NextResponse.json({
        role: isAdmin ? "admin" : "affiliate",
        affiliate: null,
        stats: null,
        commissions: [],
        attributedOrders: [],
        message: null,
      });
    }

    const reconciled = await reconcileAffiliateCommissions(affiliate.id);
    const [stats, commissions, attributedOrders] = await Promise.all([
      getAffiliateStats(affiliate.id),
      listAffiliateCommissions(affiliate.id, 100),
      listAffiliateAttributedOrders(affiliate.id, 50),
    ]);
    return NextResponse.json({
      role: isAdmin ? "admin" : "affiliate",
      affiliate,
      stats,
      commissions,
      attributedOrders,
      reconciled,
      message: statusMessage(affiliate.status),
    });
  } catch (e) {
    console.error("affiliate GET", e);
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Failed to load affiliate data", detail },
      { status: 500 }
    );
  }
}

/** Admin creates affiliates; anyone can self-register (pending) for themselves. */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const role = (user?.publicMetadata?.role as string) || "";
    const isAdmin = role === "admin";
    const body = await req.json();

    // Self-register from /affiliate (no admin create payload) even if user is admin
    const isSelfRegister = body.self === true || body.for_self === true || !isAdmin;

    const db = getDb();
    const name = String(body.name || "").trim();
    const email = String(body.email || user?.primaryEmailAddress?.emailAddress || "")
      .trim()
      .toLowerCase();
    let code = normalizeAffiliateCode(String(body.code || ""));
    if (!code) {
      code = toAffiliateCode(name || email.split("@")[0] || `aff${Date.now()}`);
    }
    if (!isValidAffiliateCode(code)) {
      return NextResponse.json(
        {
          error:
            "Affiliate code must be exactly 8 characters (a–z, 0–9). Example: reve2026",
        },
        { status: 400 }
      );
    }
    if (!name || !email) {
      return NextResponse.json({ error: "name and email required" }, { status: 400 });
    }

    const defaultRate = await getDefaultAffiliateCommissionRate(db);
    // Self-signup always uses the admin-configured default (cannot set own rate).
    const rate = isSelfRegister
      ? defaultRate
      : body.commission_rate != null
        ? Number(body.commission_rate)
        : defaultRate;
    if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
      return NextResponse.json(
        { error: "commission_rate must be between 0 and 1 (e.g. 0.10 for 10%)" },
        { status: 400 }
      );
    }

    if (isSelfRegister) {
      // Always bind to the signed-in Clerk account — ignore spoofed client email.
      const clerkEmail = (
        user?.primaryEmailAddress?.emailAddress ||
        user?.emailAddresses?.[0]?.emailAddress ||
        ""
      )
        .trim()
        .toLowerCase();
      const selfEmail = clerkEmail || email;
      const selfName =
        name ||
        [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
        selfEmail.split("@")[0] ||
        "Affiliate";

      if (!selfEmail) {
        return NextResponse.json(
          { error: "Your account has no email. Add an email in your profile and try again." },
          { status: 400 }
        );
      }

      const [existingByUser] = await db
        .select()
        .from(affiliates)
        .where(eq(affiliates.clerkUserId, userId))
        .limit(1);
      if (existingByUser) {
        return NextResponse.json(
          { error: "You already have an affiliate account", affiliate: existingByUser },
          { status: 409 }
        );
      }

      const claimed = await claimByEmail(db, userId, selfEmail);
      if (claimed) {
        // Let them set their preferred code when claiming an admin-created invite
        if (code && code !== claimed.code) {
          try {
            const [updated] = await db
              .update(affiliates)
              .set({ code, name: selfName, updatedAt: new Date() })
              .where(eq(affiliates.id, claimed.id))
              .returning();
            const row = updated ?? claimed;
            const stats = await getAffiliateStats(row.id);
            const commissions = await listAffiliateCommissions(row.id);
            return NextResponse.json({
              affiliate: row,
              stats,
              commissions,
              message: statusMessage(row.status),
              claimed: true,
            });
          } catch (e) {
            if (isUniqueViolation(e)) {
              return NextResponse.json(
                { error: "That affiliate code is already taken" },
                { status: 409 }
              );
            }
            throw e;
          }
        }
        const stats = await getAffiliateStats(claimed.id);
        const commissions = await listAffiliateCommissions(claimed.id);
        return NextResponse.json({
          affiliate: claimed,
          stats,
          commissions,
          message: statusMessage(claimed.status),
          claimed: true,
        });
      }

      try {
        const [created] = await db
          .insert(affiliates)
          .values({
            clerkUserId: userId,
            code,
            name: selfName,
            email: selfEmail,
            status: "pending",
            commissionRate: String(rate),
          })
          .returning();

        return NextResponse.json({
          affiliate: created,
          message: statusMessage(created.status),
        });
      } catch (e) {
        if (isUniqueViolation(e)) {
          return NextResponse.json(
            {
              error:
                "An affiliate with this email or code already exists. Try a different code, or sign in with the email that was invited.",
            },
            { status: 409 }
          );
        }
        throw e;
      }
    }

    // Admin creating invite-style or linked affiliate
    const parsedClerk = parseOptionalClerkUserId(body.clerk_user_id);
    if (!parsedClerk.ok) {
      return NextResponse.json({ error: parsedClerk.error }, { status: 400 });
    }
    const status = ["active", "inactive", "pending"].includes(body.status)
      ? body.status
      : "active";

    try {
      const [created] = await db
        .insert(affiliates)
        .values({
          clerkUserId: parsedClerk.value,
          code,
          name,
          email,
          status,
          commissionRate: String(rate),
        })
        .returning();

      return NextResponse.json({
        affiliate: created,
        message: statusMessage(created.status),
      });
    } catch (e) {
        if (isUniqueViolation(e)) {
          return NextResponse.json(
            {
              error:
                "An affiliate with this email, code, or Clerk user already exists",
            },
            { status: 409 }
          );
        }
      throw e;
    }
  } catch (e) {
    console.error("affiliate POST", e);
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Failed to create affiliate", detail },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await currentUser();
    const isAdmin = (user?.publicMetadata?.role as string) === "admin";
    const body = await req.json();
    const db = getDb();

    // Affiliates may update their own 8-char code
    if (!isAdmin) {
      const code = normalizeAffiliateCode(String(body.code || ""));
      if (!isValidAffiliateCode(code)) {
        return NextResponse.json(
          { error: "Code must be exactly 8 characters (a–z, 0–9)" },
          { status: 400 }
        );
      }
      const email = (
        user?.primaryEmailAddress?.emailAddress ||
        user?.emailAddresses?.[0]?.emailAddress ||
        ""
      )
        .trim()
        .toLowerCase();
      const mine = await loadPersonalAffiliate(db, userId, email);
      if (!mine) {
        return NextResponse.json({ error: "Affiliate account not found" }, { status: 404 });
      }
      if (mine.status === "inactive") {
        return NextResponse.json({ error: "Account is suspended" }, { status: 403 });
      }
      try {
        const [updated] = await db
          .update(affiliates)
          .set({ code, updatedAt: new Date() })
          .where(eq(affiliates.id, mine.id))
          .returning();
        return NextResponse.json({
          affiliate: updated,
          message: statusMessage(updated.status),
        });
      } catch (e) {
        if (isUniqueViolation(e)) {
          return NextResponse.json({ error: "That code is already taken" }, { status: 409 });
        }
        throw e;
      }
    }

    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const patch: Partial<typeof affiliates.$inferInsert> & { updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (body.status != null) {
      const status = String(body.status);
      if (!["active", "inactive", "pending"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      patch.status = status as "active" | "inactive" | "pending";
    }
    if (body.commission_rate != null) {
      const rate = Number(body.commission_rate);
      if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
        return NextResponse.json(
          { error: "commission_rate must be between 0 and 1" },
          { status: 400 }
        );
      }
      patch.commissionRate = String(rate);
    }
    if (body.name != null) patch.name = String(body.name).trim();
    if (body.email != null) patch.email = String(body.email).trim().toLowerCase();
    if (body.code != null) {
      const code = normalizeAffiliateCode(String(body.code));
      if (!isValidAffiliateCode(code)) {
        return NextResponse.json(
          { error: "Code must be exactly 8 characters (a–z, 0–9)" },
          { status: 400 }
        );
      }
      patch.code = code;
    }
    if (body.clerk_user_id !== undefined) {
      const parsedClerk = parseOptionalClerkUserId(body.clerk_user_id);
      if (!parsedClerk.ok) {
        return NextResponse.json({ error: parsedClerk.error }, { status: 400 });
      }
      patch.clerkUserId = parsedClerk.value;
    }

    try {
      const [updated] = await db
        .update(affiliates)
        .set(patch)
        .where(eq(affiliates.id, id))
        .returning();

      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json({ affiliate: updated });
    } catch (e) {
      if (isUniqueViolation(e)) {
        return NextResponse.json(
          { error: "Email, code, or Clerk user already in use" },
          { status: 409 }
        );
      }
      throw e;
    }
  } catch (e) {
    console.error("affiliate PATCH", e);
    return NextResponse.json({ error: "Failed to update affiliate" }, { status: 500 });
  }
}

/** Admin-only: delete an affiliate entry (commissions cascade; orders unlink). */
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await currentUser();
    const isAdmin = (user?.publicMetadata?.role as string) === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const id = String(body.id || searchParams.get("id") || "").trim();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const db = getDb();

    // Unlink orders first (FK may be RESTRICT depending on migration history)
    await db
      .update(orders)
      .set({ affiliateId: null, updatedAt: new Date() })
      .where(eq(orders.affiliateId, id));

    const [removed] = await db
      .delete(affiliates)
      .where(eq(affiliates.id, id))
      .returning({ id: affiliates.id, code: affiliates.code, email: affiliates.email });

    if (!removed) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: removed });
  } catch (e) {
    console.error("affiliate DELETE", e);
    return NextResponse.json(
      {
        error: "Failed to delete affiliate",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}
