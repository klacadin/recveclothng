"use client";

import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowRight } from "lucide-react";
import {
  AFFILIATE_DASHBOARD_PATH,
  AFFILIATE_HOWTO_PDF_PATH,
  AFFILIATE_JOIN_PATH,
  AFFILIATE_POSTER_SQUARE_PATH,
  AFFILIATE_POSTER_STORY_PATH,
} from "@/lib/affiliate-constants";
import SEO from "@/components/SEO";

/**
 * In-app guide so partners don't hit SPA 404 when opening docs/PDF paths.
 */
export default function AffiliateGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Affiliate How to Use"
        description="How to join and use the REVE Clothing affiliate program. Earn 10% on confirmed paid orders."
      />
      <Header />
      <main className="flex-1 container pt-24 pb-12 px-4 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Affiliate program
        </p>
        <h1 className="font-display text-3xl font-bold mb-3">How to use Affiliate</h1>
        <p className="text-muted-foreground mb-8">
          Join free, get approved, share your unique link, and earn <strong>10%</strong> on
          confirmed paid product subtotals.
        </p>

        <ol className="space-y-4 mb-10 list-decimal list-inside text-sm md:text-base">
          <li>
            Register at{" "}
            <Link to={AFFILIATE_JOIN_PATH} className="underline underline-offset-2">
              /affiliate/join
            </Link>
          </li>
          <li>Pick an 8-character code (letters and numbers only)</li>
          <li>Wait for admin approval (status becomes Active)</li>
          <li>Copy your link from the dashboard and share it</li>
          <li>Earn when shoppers buy through your link and the order is paid</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Button asChild size="lg">
            <Link to={AFFILIATE_JOIN_PATH}>
              Become an affiliate
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to={AFFILIATE_DASHBOARD_PATH}>Open dashboard</Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Downloads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <a href={AFFILIATE_HOWTO_PDF_PATH} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                How to Use PDF
              </a>
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={AFFILIATE_POSTER_SQUARE_PATH} target="_blank" rel="noopener noreferrer">
                  Square poster (feed)
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={AFFILIATE_POSTER_STORY_PATH} target="_blank" rel="noopener noreferrer">
                  Story poster (9:16)
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Direct PDF link:{" "}
              <a
                href={AFFILIATE_HOWTO_PDF_PATH}
                className="underline underline-offset-2 break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                reveclothingxnobody.com{AFFILIATE_HOWTO_PDF_PATH}
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
