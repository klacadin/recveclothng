"use client";

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AFFILIATE_COOKIE_DAYS, AFFILIATE_COOKIE_NAME } from "@/lib/affiliate-constants";

function setAffiliateCookie(code: string) {
  const maxAge = AFFILIATE_COOKIE_DAYS * 24 * 60 * 60;
  document.cookie = `${AFFILIATE_COOKIE_NAME}=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function clearAffiliateCookie() {
  document.cookie = `${AFFILIATE_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

/**
 * Legacy query capture: ?ref=CODE or ?aff=CODE.
 * Preferred share links use /affiliate/{code} (see AffiliateReferralLanding).
 */
export function AffiliateTracker() {
  const [params] = useSearchParams();

  useEffect(() => {
    const code = (params.get("ref") || params.get("aff") || "").trim().toLowerCase();
    if (!code) return;

    void fetch("/api/affiliate/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = (await res.json()) as { code?: string };
          setAffiliateCookie(data.code || code);
          return;
        }
        clearAffiliateCookie();
      })
      .catch(() => {
        // Leave existing cookie alone on network errors
      });
  }, [params]);

  return null;
}
