import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  AFFILIATE_DASHBOARD_PATH,
  AFFILIATE_GUIDE_PATH,
  AFFILIATE_JOIN_PATH,
  AFFILIATE_LOGIN_PATH,
} from "@/lib/affiliate-constants";

/**
 * Homepage CTA for the affiliate program.
 */
const AffiliateCta = () => {
  return (
    <section className="py-16 md:py-20 border-t border-border bg-secondary/40">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Affiliate program
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Earn 10% sharing REVE
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Reve Clothing x Nobody affiliate program — get a unique link, share with your
            community, and earn commission on confirmed paid orders. Free to join — approval
            required.
          </p>
          <p className="text-sm">
            <Link
              to={AFFILIATE_GUIDE_PATH}
              className="underline underline-offset-2 hover:text-foreground"
            >
              How to use Affiliate (guide + PDF)
            </Link>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" asChild>
              <Link to={AFFILIATE_JOIN_PATH}>
                Become an affiliate
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={AFFILIATE_LOGIN_PATH}>Sign in to manage</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Already approved?{" "}
            <Link
              to={AFFILIATE_DASHBOARD_PATH}
              className="underline underline-offset-2 hover:text-foreground"
            >
              Open affiliate dashboard
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AffiliateCta;
