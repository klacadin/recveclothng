import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-athlete.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Trail runner in performance gear" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="container relative z-10 pt-20">
        <div className="max-w-xl space-y-6">
          {/* Brand Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/80 backdrop-blur-sm rounded-sm animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              GAWANG BUKID
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] animate-fade-up stagger-1">
            Performance Built for
            <span className="text-accent block">Real Athletes</span>
          </h1>

          {/* Subhead */}
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md animate-fade-up stagger-2">
            Trail. Road. Endurance. Technical apparel designed and crafted in Bukidnon 
            for athletes who demand more from their gear.
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
              <div className="font-display text-2xl font-bold text-foreground">50+</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Events</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">2K+</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Athletes</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">PH</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Made</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
