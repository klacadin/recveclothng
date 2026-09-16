import {
  getDefaultAffiliateCommissionRate,
  setDefaultAffiliateCommissionRate,
} from "@/db/settings";
import { getDb } from "@/db/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const user = await currentUser();
  const role = (user?.publicMetadata?.role as string) || "";
  if (role !== "admin") {
    return { error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
  }
  return { userId };
}

/** GET default affiliate commission rate (admin). */
export async function GET() {
  try {
    const gate = await requireAdmin();
    if ("error" in gate && gate.error) return gate.error;

    const db = getDb();
    const rate = await getDefaultAffiliateCommissionRate(db);
    return NextResponse.json({
      default_commission_rate: rate,
      default_commission_percent: Number((rate * 100).toFixed(2)),
    });
  } catch (e) {
    console.error("affiliate-settings GET", e);
    return NextResponse.json(
      { error: "Failed to load affiliate settings", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

/**
 * PATCH body:
 *   commission_rate: number (0–1) OR commission_percent: number (0–100)
 *   apply_to_all?: boolean — also update every affiliate's rate
 */
export async function PATCH(req: Request) {
  try {
    const gate = await requireAdmin();
    if ("error" in gate && gate.error) return gate.error;

    const body = await req.json();
    let rate: number;
    if (body.commission_rate != null) {
      rate = Number(body.commission_rate);
    } else if (body.commission_percent != null) {
      rate = Number(body.commission_percent) / 100;
    } else {
      return NextResponse.json(
        { error: "Provide commission_rate (0–1) or commission_percent (0–100)" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
      return NextResponse.json(
        { error: "Rate must be between 0% and 100%" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await setDefaultAffiliateCommissionRate(db, rate, {
      applyToAll: Boolean(body.apply_to_all),
    });

    return NextResponse.json({
      default_commission_rate: result.rate,
      default_commission_percent: Number((result.rate * 100).toFixed(2)),
      updated_affiliates: result.updatedCount,
    });
  } catch (e) {
    console.error("affiliate-settings PATCH", e);
    return NextResponse.json(
      { error: "Failed to update affiliate settings", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
