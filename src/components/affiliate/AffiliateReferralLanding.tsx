"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AFFILIATE_COOKIE_DAYS,
  AFFILIATE_COOKIE_NAME,
  AFFILIATE_DASHBOARD_PATH,
  AFFILIATE_RESERVED_SEGMENTS,
  isValidAffiliateCode,
  normalizeAffiliateCode,
} from "@/lib/affiliate-constants";

function setAffiliateCookie(code: string) {
  const maxAge = AFFILIATE_COOKIE_DAYS * 24 * 60 * 60;
  document.cookie = `${AFFILIATE_COOKIE_NAME}=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function clearAffiliateCookie() {
  document.cookie = `${AFFILIATE_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

/**
 * /affiliate/:code — validate, set referral cookie, then send shoppers home.
 * Program pages: /affiliate/join | /login | /dashboard
 */
export default function AffiliateReferralLanding() {
  const { code: rawCode } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"working" | "invalid">("working");

  useEffect(() => {
    const segment = (rawCode || "").trim().toLowerCase();
    if (AFFILIATE_RESERVED_SEGMENTS.has(segment)) {
      navigate(`/affiliate/${segment}`, { replace: true });
      return;
    }

    const code = normalizeAffiliateCode(rawCode || "");
    if (!isValidAffiliateCode(code)) {
      setStatus("invalid");
      navigate(AFFILIATE_DASHBOARD_PATH, { replace: true });
      return;
    }

    let cancelled = false;

    void fetch("/api/affiliate/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) {
          const data = (await res.json()) as { code?: string };
          setAffiliateCookie(data.code || code);
        } else {
          clearAffiliateCookie();
        }
      })
      .catch(() => {
        // Keep any existing cookie on network errors
      })
      .finally(() => {
        if (!cancelled) navigate("/", { replace: true });
      });

    return () => {
      cancelled = true;
    };
  }, [rawCode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="text-sm text-muted-foreground">
          {status === "invalid" ? "Opening affiliate dashboard…" : "Applying your invite…"}
        </p>
      </div>
    </div>
  );
}
