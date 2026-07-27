import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Auth only — FAPI is proxied by src/app/%5F%5Fclerk route with registered
 * apex Clerk-Proxy-Url (www cannot be registered; Clerk rejects different domain).
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
