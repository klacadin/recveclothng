import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Auth only — FAPI is proxied by src/app/%5F%5Fclerk route with registered
 * apex Clerk-Proxy-Url (www cannot be registered; Clerk rejects different domain).
 * HitPay webhooks must stay public (no auth gate).
 */
export default clerkMiddleware((auth, req) => {
  if (req.nextUrl.pathname.startsWith("/api/webhooks/")) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip static assets (include pdf) so public files are not treated as app routes
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|pdf)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
