import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@/index.css";

export const metadata: Metadata = {
  title: "Reve Clothing x Nobody | Performance Apparel",
  description:
    "Nobody by Reve Clothing — performance apparel for trail, road & endurance athletes. Crafted in Bukidnon, Philippines. COD, GCash & nationwide shipping.",
  metadataBase: new URL("https://www.reveclothingxnobody.com"),
};

/**
 * Same-origin relative path. Hardcoded — do not read empty Sensitive env.
 * Apex→www redirect breaks absolute apex proxyUrl (Failed to fetch / white screen).
 */
const CLERK_PROXY_URL = "/__clerk";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        {publishableKey ? (
          <ClerkProvider
            publishableKey={publishableKey}
            proxyUrl={CLERK_PROXY_URL}
            signInUrl="/admin/login"
            signUpUrl="/admin/login"
          >
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
