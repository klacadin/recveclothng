import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
            Earn 15% sharing REVE
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Get a unique link, share with your community, and earn commission on confirmed paid
            orders. Free to join — approval required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" asChild>
              <Link to="/affiliate?action=register">
                Become an affiliate
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/affiliate?action=login">Sign in to manage</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Already approved?{" "}
            <Link to="/affiliate" className="underline underline-offset-2 hover:text-foreground">
              Open affiliate dashboard
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AffiliateCta;
