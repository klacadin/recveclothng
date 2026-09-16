import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM = "https://frontend-api.clerk.dev";
/**
 * Must match Clerk Dashboard proxy_url exactly.
 * Clerk rejects www as "different domain" from primary domain reveclothingxnobody.com.
 * Browser uses relative /__clerk on www; we still advertise the registered apex proxy URL.
 */
const REGISTERED_PROXY_URL = "https://reveclothingxnobody.com/__clerk";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
]);

async function proxy(req: NextRequest, path: string[] | undefined) {
  const secret = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_SECRET_KEY missing" },
      { status: 500 }
    );
  }

  const subpath = (path || []).join("/");
  const target = `${UPSTREAM}/${subpath}${new URL(req.url).search}`;
  const fapiHost = new URL(UPSTREAM).host;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!HOP_BY_HOP.has(lower)) headers.set(key, value);
  });

  headers.set("Host", fapiHost);
  headers.set("Clerk-Proxy-Url", REGISTERED_PROXY_URL);
  headers.set("Clerk-Secret-Key", secret);
  headers.set("Accept-Encoding", "identity");
  if (publishableKey) {
    // Help FAPI resolve the correct instance when proxying.
    headers.set("Clerk-Publishable-Key", publishableKey);
  }

  const clientIp =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0";
  headers.set("X-Forwarded-For", clientIp);

  // Prefer apex in forwarded host so cookies/redirects align with registered proxy domain.
  headers.set("X-Forwarded-Host", "reveclothingxnobody.com");
  headers.set("X-Forwarded-Proto", "https");

  const init: RequestInit = { method: req.method, headers, redirect: "manual" };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
    // @ts-expect-error duplex required for streaming body
    init.duplex = "half";
  }

  const upstream = await fetch(target, init);
  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "content-encoding" || lower === "transfer-encoding") return;
    if (lower === "set-cookie") {
      out.append(key, value);
    } else {
      out.set(key, value);
    }
  });
  out.delete("content-encoding");
  out.delete("transfer-encoding");
  out.delete("content-length");

  const loc = out.get("location");
  if (loc) {
    try {
      const u = new URL(loc, UPSTREAM);
      // Always return same-origin relative/absolute URL on the request host (www or apex)
      // so the browser does not bounce through apex→www 308 mid-script-load.
      const reqOrigin = (() => {
        const proto =
          req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
        const host =
          req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
          req.headers.get("host") ||
          "www.reveclothingxnobody.com";
        return `${proto}://${host}`;
      })();

      if (
        u.href.startsWith(REGISTERED_PROXY_URL) ||
        (u.hostname === "reveclothingxnobody.com" &&
          u.pathname.startsWith("/__clerk")) ||
        (u.hostname === "www.reveclothingxnobody.com" &&
          u.pathname.startsWith("/__clerk")) ||
        u.hostname === "frontend-api.clerk.dev" ||
        u.hostname === "clerk.reveclothingxnobody.com"
      ) {
        const pathPart =
          u.hostname === "frontend-api.clerk.dev" ||
          u.hostname === "clerk.reveclothingxnobody.com"
            ? `/__clerk${u.pathname}`
            : u.pathname.startsWith("/__clerk")
              ? u.pathname
              : `/__clerk${u.pathname}`;
        out.set("location", `${reqOrigin}${pathPart}${u.search}${u.hash}`);
      }
    } catch {
      /* keep upstream location */
    }
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}

type Ctx = { params: Promise<{ path?: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function OPTIONS(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function HEAD(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
