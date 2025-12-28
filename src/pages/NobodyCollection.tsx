import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import nobodyLogo from "@/assets/nobody-logo.png";
import nobodyMission from "@/assets/nobody-mission.png";
import nobodyJersey from "@/assets/product-nobody-jersey.jpg";
import heroTee from "@/assets/product-hero-tee.jpg";
import athleteEvent from "@/assets/athlete-event.jpg";

// NOBODY products
const nobodyProducts = [
  { id: "1", name: "NOBODY Jersey - Red/Black Graffiti", price: 1299, image: nobodyJersey, category: "Jersey", isNew: true, inStock: true },
  { id: "2", name: "Be Your Own Hero Tee - Pink", price: 899, image: heroTee, category: "Tee", isNew: true, inStock: true },
  { id: "6", name: "NOBODY Jersey - Teal/Black", price: 1299, image: nobodyJersey, category: "Jersey", isNew: false, inStock: true },
  { id: "7", name: "Be Your Own Hero Tee - Black", price: 899, image: heroTee, category: "Tee", isNew: false, inStock: true },
  { id: "9", name: "NOBODY Singlet - Gradient", price: 799, image: heroTee, category: "Singlet", isNew: true, inStock: true },
  { id: "10", name: "NOBODY Long Sleeve - Black", price: 1499, image: nobodyJersey, category: "Long Sleeve", isNew: false, inStock: true },
];

const NobodyCollection = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="pt-16">
        {/* Hero Section - Dark Theme */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={athleteEvent} 
              alt="NOBODY athletes at trail running event" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/60" />
          </div>

          <div className="container relative z-10 py-20">
            <div className="max-w-2xl space-y-8">
              {/* NOBODY Logo */}
              <div className="animate-fade-up">
                <img 
                  src={nobodyLogo} 
                  alt="NOBODY" 
                  className="h-12 md:h-16 w-auto brightness-0 invert"
                />
              </div>

              {/* Tagline */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight animate-fade-up stagger-1">
                For the Unsung Heroes of the Track and Trail
              </h1>

              {/* Philosophy */}
              <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl animate-fade-up stagger-2">
                We believe that greatness isn't about recognition—it's about the 
                relentless pursuit of personal bests. Be your own hero.
              </p>

              {/* CTA */}
              <div className="animate-fade-up stagger-3">
                <Button variant="red" size="lg" asChild>
                  <a href="#products">
                    Shop NOBODY
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Mission Image */}
              <div className="bg-background rounded-sm overflow-hidden shadow-lg">
                <img 
                  src={nobodyMission} 
                  alt="NOBODY - For the unsung heroes of the track and trail" 
                  className="w-full h-auto"
                />
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                    The Philosophy
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    Be Your Own Hero
                  </h2>
                </div>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    NOBODY is for athletes who don't chase podiums—but chase personal bests. 
                    Performance gear for those who understand that the real competition is 
                    with yourself.
                  </p>
                  <p>
                    Our apparel is a tribute to the unsung heroes of the track and trail—those 
                    who run not for applause, but for the love of the journey. The 5AM starters. 
                    The back-of-the-pack finishers who show up anyway.
                  </p>
                  <p className="font-medium text-foreground">
                    No sponsors. No glory. Just the work.
                  </p>
                </div>

                {/* Values */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-secondary rounded-sm">
                    <div className="font-display text-2xl font-bold text-accent">5AM</div>
                    <div className="text-xs text-muted-foreground mt-1">Starters</div>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-sm">
                    <div className="font-display text-2xl font-bold text-accent">100%</div>
                    <div className="text-xs text-muted-foreground mt-1">Effort</div>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-sm">
                    <div className="font-display text-2xl font-bold text-accent">YOU</div>
                    <div className="text-xs text-muted-foreground mt-1">vs YOU</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 md:py-24 bg-secondary scroll-mt-20">
          <div className="container">
            {/* Section Header */}
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                Performance Collection
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                NOBODY Apparel
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
                Technical performance gear designed for athletes who train when nobody's watching.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {nobodyProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Banner */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <img 
                src={nobodyLogo} 
                alt="NOBODY" 
                className="h-8 w-auto mx-auto brightness-0 invert opacity-60"
              />
              <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                "NOBODY cares about your pace—but you do. And that's what matters."
              </blockquote>
              <p className="text-primary-foreground/60 text-sm uppercase tracking-[0.2em]">
                Be Confident. Be You.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-accent">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-accent-foreground">
                  Ready to Join the Movement?
                </h3>
                <p className="text-accent-foreground/80 mt-1">
                  Gear up with NOBODY performance apparel.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="black" size="lg" asChild>
                  <Link to="/shop">
                    Shop All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent" asChild>
                  <Link to="/about">Our Story</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NobodyCollection;