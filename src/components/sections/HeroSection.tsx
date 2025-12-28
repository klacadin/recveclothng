import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";
import heroImage from "@/assets/hero-model.jpg";

const HeroSection = () => {
  const trustBadges = [
    { icon: Truck, label: "Free Shipping ₱999+" },
    { icon: CreditCard, label: "COD & GCash" },
    { icon: Shield, label: "Quality Guaranteed" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 md:space-y-8">
            <div className="space-y-4">
              <p className="text-sm md:text-base font-medium uppercase tracking-[0.15em] text-primary animate-fade-up">
                Handcrafted in the Philippines
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.15] text-balance animate-fade-up stagger-1">
                Fashion Born from <span className="text-primary italic">Resilience</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-up stagger-2">
                From a small town dream to your wardrobe. Every stitch carries the spirit of Filipino craftsmanship and the determination to create something beautiful.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up stagger-3">
              <Button variant="hero" size="xl" asChild>
                <a href="#shop">
                  Shop Collection
                  <ArrowRight className="ml-1 h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#story">Our Story</a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-4 animate-fade-up stagger-4">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
                  <badge.icon className="h-4 w-4 text-accent" />
                  <span className="text-xs md:text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Area */}
          <div className="relative animate-fade-up stagger-2">
            <div className="aspect-[4/5] rounded-2xl bg-secondary overflow-hidden shadow-elevated relative">
              <img 
                src={heroImage} 
                alt="Filipino model wearing REVE Clothing in countryside setting" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
