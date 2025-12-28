import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import nobodyMission from "@/assets/nobody-mission.png";

const NobodySection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Performance Sub-Brand
              </p>
            </div>
            
            <blockquote className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              We believe that greatness isn't about recognition—it's about the 
              relentless pursuit of personal bests.
            </blockquote>

            <p className="text-primary-foreground/70 leading-relaxed">
              Our apparel is a tribute to the unsung heroes of the track and trail—those 
              who run not for applause, but for the love of the journey. The 5AM starters. 
              The back-of-the-pack finishers who show up anyway.
            </p>

            <Button variant="red" size="lg" asChild>
              <Link to="/collections/nobody">
                Explore NOBODY
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Visual - NOBODY Mission Card */}
          <div className="relative">
            <div className="bg-background rounded-sm overflow-hidden shadow-lg">
              <img 
                src={nobodyMission} 
                alt="NOBODY - For the unsung heroes of the track and trail" 
                className="w-full h-auto"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-sm -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NobodySection;
