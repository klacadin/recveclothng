import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/athlete-trail-run.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Trail runner in NOBODY performance gear on Bukidnon trail" 
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>

      <div className="container relative z-10 pt-20">
        <div className="max-w-xl space-y-6">
          {/* Brand Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/80 backdrop-blur-sm rounded-sm animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              TIMING IS EVERYTHING
            </span>
          </div>

          {/* Headline: one H1 for SEO, visual hierarchy via smaller tagline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up stagger-1">
            Performance Built for{" "}
            <span className="text-accent block">
              Unsung Heroes
              <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold mt-0.5 opacity-90">
                of the track and trail
              </span>
            </span>
          </h1>

          {/* Subhead: keyword-rich for SEO, inclusive of everyone pursuing personal best */}
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md animate-fade-up stagger-2">
            <span className="font-medium text-foreground/90">Trail. Road. Endurance.</span>{" "}
            Technical performance apparel designed and crafted in Bukidnon for anyone pursuing their personal best—in sport, life, or wherever you push.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-up stagger-3">
            <Button variant="red" size="lg" asChild>
              <Link to="/shop">
                Shop Collection
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Our Story</Link>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap gap-6 pt-4 animate-fade-up stagger-4">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">2K+</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Athletes</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">PH</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Made</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">100%</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
