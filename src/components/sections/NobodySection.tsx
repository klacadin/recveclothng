import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NobodySection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Sub-Brand
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]">
                NOBODY
              </h2>
            </div>
            
            <blockquote className="text-xl md:text-2xl font-light italic text-primary-foreground/80 border-l-4 border-accent pl-6">
              "For the unsung heroes. The 5AM starters. The back-of-the-pack finishers 
              who show up anyway."
            </blockquote>

            <p className="text-primary-foreground/70 leading-relaxed">
              NOBODY is for athletes who don't chase podiums—but chase personal bests. 
              Performance gear for those who understand that the real competition is 
              with yourself. No sponsors. No glory. Just the work.
            </p>

            <Button variant="red" size="lg" asChild>
              <Link to="/collections/nobody">
                Explore NOBODY
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square bg-primary-foreground/5 rounded-sm flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="font-display text-8xl md:text-9xl font-bold text-primary-foreground/10">
                  N
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/40">
                  Be your own hero
                </p>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-sm" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NobodySection;
