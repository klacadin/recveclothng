"use client";

import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import {
  AFFILIATE_DASHBOARD_PATH,
  AFFILIATE_HOWTO_PDF_PATH,
  AFFILIATE_JOIN_PATH,
  AFFILIATE_POSTER_SQUARE_PATH,
  AFFILIATE_POSTER_STORY_PATH,
} from "@/lib/affiliate-constants";
import SEO from "@/components/SEO";
import reveLogo from "@/assets/reve-logo.jpg";
import nobodyLogo from "@/assets/nobody-logo.png";

const BRAND = "Reve Clothing x Nobody";

/**
 * In-app guide — logos + posters displayed on the page (not download-only).
 */
export default function AffiliateGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={`${BRAND} | Affiliate How to Use`}
        description="How to join and use the Reve Clothing x Nobody affiliate program. Earn 10% on confirmed paid orders."
      />
      <Header />
      <main className="flex-1 container pt-24 pb-12 px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-10 gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <img
              src={reveLogo}
              alt="REVE logo"
              className="h-20 sm:h-24 w-auto object-contain bg-black rounded-sm p-1.5"
            />
            <span className="text-3xl font-bold text-foreground" aria-hidden>
              ×
            </span>
            <img
              src={nobodyLogo}
              alt="NOBODY logo"
              className="h-12 sm:h-14 w-auto object-contain bg-black rounded-sm px-3 py-2"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Affiliate program
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold">{BRAND}</h1>
          <p className="text-muted-foreground max-w-xl text-sm sm:text-base">
            How to use Affiliate — join free, get approved, share your unique link, and earn{" "}
            <strong className="text-foreground">10%</strong> on confirmed paid product subtotals.
          </p>
        </div>

        {/* Posters shown ON the page */}
        <section className="mb-12" aria-labelledby="posters-heading">
          <h2 id="posters-heading" className="font-display text-xl font-bold mb-2 text-center">
            Official invite posters
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-lg mx-auto">
            Use these when inviting partners. Add your unique affiliate link in the caption.
          </p>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <figure className="space-y-2">
              <div className="rounded-sm border border-border overflow-hidden bg-black shadow-sm">
                <img
                  src={AFFILIATE_POSTER_SQUARE_PATH}
                  alt={`${BRAND} affiliate invite poster — square feed version`}
                  className="w-full h-auto block"
                  loading="eager"
                />
              </div>
              <figcaption className="text-center text-sm text-muted-foreground">
                Square poster · Instagram / Facebook feed
              </figcaption>
            </figure>
            <figure className="space-y-2 max-w-sm mx-auto w-full">
              <div className="rounded-sm border border-border overflow-hidden bg-black shadow-sm">
                <img
                  src={AFFILIATE_POSTER_STORY_PATH}
                  alt={`${BRAND} affiliate invite poster — story version`}
                  className="w-full h-auto block"
                  loading="eager"
                />
              </div>
              <figcaption className="text-center text-sm text-muted-foreground">
                Story poster · Instagram / Facebook Stories
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="mb-10" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="font-display text-xl font-bold mb-4">
            Quick start
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-sm md:text-base">
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
        </section>

        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <Button asChild size="lg">
            <Link to={AFFILIATE_JOIN_PATH}>
              Become an affiliate
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to={AFFILIATE_DASHBOARD_PATH}>Open dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href={AFFILIATE_HOWTO_PDF_PATH} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              PDF instructions
            </a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
