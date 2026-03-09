import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CartItemInput = {
  product_id: string;
  quantity: number;
  unit_price: number;
  category?: string | null;
};

function computeEligibleAmount(
  items: CartItemInput[],
  productIds: string[] | null,
  categoryNames: string[]
): number {
  if (!items.length) return 0;

  const productIdSet = productIds?.length ? new Set(productIds) : null;
  const categoryNameSet = categoryNames.length ? new Set(categoryNames.map((n) => n?.toLowerCase?.() ?? "")) : null;

  const appliesToAll = !productIdSet && !categoryNameSet;
  let eligible = 0;

  for (const item of items) {
    if (appliesToAll) {
      eligible += item.quantity * item.unit_price;
      continue;
    }
    const inProducts = productIdSet?.has(item.product_id);
    const categoryNorm = item.category?.toLowerCase?.() ?? "";
    const inCategory = categoryNameSet?.has(categoryNorm);
    if (inProducts || inCategory) {
      eligible += item.quantity * item.unit_price;
    }
  }

  return eligible;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const code = body.code;
    const subtotal = body.subtotal;
    const items = Array.isArray(body.items) ? body.items : [];

    const cleanCode = (code || "").trim().toUpperCase();

    if (!cleanCode) {
      return new Response(
        JSON.stringify({ valid: false, discount_amount: 0, message: "Voucher code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: voucher, error } = await supabase
      .from("vouchers")
      .select("*")
      .ilike("code", cleanCode)
      .maybeSingle();

    if (error) {
      console.error("validate-voucher DB error:", error);
      return new Response(
        JSON.stringify({ valid: false, discount_amount: 0, message: "Voucher service temporarily unavailable" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!voucher) {
      return new Response(
        JSON.stringify({ valid: false, discount_amount: 0, message: "Voucher not found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!voucher.is_active) {
      return new Response(
        JSON.stringify({ valid: false, discount_amount: 0, message: "Voucher has expired or is no longer valid" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fullSubtotal = Math.max(0, Number(subtotal) || 0);
    const minOrder = Number(voucher.min_order_amount) || 0;
    if (fullSubtotal < minOrder) {
      return new Response(
        JSON.stringify({
          valid: false,
          discount_amount: 0,
          message: `Minimum order amount is ₱${minOrder.toLocaleString()}`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const expiresAt = voucher.expires_at ? new Date(voucher.expires_at) : null;
    if (expiresAt && expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, discount_amount: 0, message: "Voucher has expired" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const maxUses = voucher.max_uses;
    const timesUsed = voucher.times_used ?? 0;
    if (maxUses != null && timesUsed >= maxUses) {
      return new Response(
        JSON.stringify({ valid: false, discount_amount: 0, message: "Voucher usage limit reached" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let categoryNames: string[] = [];
    const categoryIds = (voucher.category_ids ?? voucher["category_ids"]) as string[] | null | undefined;
    if (categoryIds?.length) {
      try {
        const { data: cats } = await supabase
          .from("categories")
          .select("name")
          .in("id", categoryIds);
        categoryNames = (cats ?? []).map((c: { name?: string }) => c.name).filter(Boolean);
      } catch (catErr) {
        console.warn("validate-voucher: could not fetch categories", catErr);
      }
    }

    const productIds = (voucher.product_ids ?? voucher["product_ids"]) as string[] | null | undefined;
    const cartItems: CartItemInput[] = items.map((i: { product_id?: string; quantity?: number; unit_price?: number; category?: string | null }) => ({
      product_id: String(i.product_id ?? ""),
      quantity: Math.max(0, Number(i.quantity) ?? 0),
      unit_price: Math.max(0, Number(i.unit_price) ?? 0),
      category: i.category ?? null,
    })).filter((i: CartItemInput) => i.product_id);

    const eligibleAmount = cartItems.length
      ? computeEligibleAmount(cartItems, productIds ?? null, categoryNames)
      : fullSubtotal;

    if (eligibleAmount <= 0 && (productIds?.length || categoryNames.length)) {
      return new Response(
        JSON.stringify({
          valid: false,
          discount_amount: 0,
          message: "Voucher does not apply to any items in your cart",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const val = Number(voucher.discount_value);
    let discountAmount = 0;
    if (voucher.discount_type === "percent") {
      discountAmount = Math.floor(eligibleAmount * (Math.min(100, val) / 100));
    } else {
      discountAmount = Math.min(eligibleAmount, val);
    }

    const scopeNote =
      productIds?.length || categoryNames.length
        ? " (on eligible items)"
        : "";

    return new Response(
      JSON.stringify({
        valid: true,
        discount_amount: discountAmount,
        message: voucher.discount_type === "percent"
          ? `${voucher.discount_value}% off${scopeNote}`
          : `₱${voucher.discount_value} off${scopeNote}`,
        code: voucher.code,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("validate-voucher error:", e);
    return new Response(
      JSON.stringify({ valid: false, discount_amount: 0, message: "Unable to validate voucher" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
