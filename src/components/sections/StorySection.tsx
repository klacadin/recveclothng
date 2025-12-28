import { Button } from "@/components/ui/button";
import { Heart, Users, Leaf } from "lucide-react";
import storyImage from "@/assets/story-image.jpg";

const StorySection = () => {
  const values = [
    {
      icon: Heart,
      title: "Made with Heart",
      description: "Every piece is crafted with genuine care and attention to detail by our dedicated team.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "We support local artisans and believe in creating opportunities in our hometown.",
    },
    {
      icon: Leaf,
      title: "Conscious Craft",
      description: "Sustainable practices guide our work—from fabric selection to packaging.",
    },
  ];

  return (
    <section id="story" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-card overflow-hidden shadow-elevated">
              <img 
                src={storyImage} 
                alt="REVE Clothing workshop with handcrafted garments" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative quote */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-card p-4 md:p-6 rounded-xl shadow-card max-w-[240px]">
              <p className="font-serif text-lg md:text-xl italic text-foreground leading-snug">
                "From our small town to your wardrobe—with love."
              </p>
              <p className="text-sm text-muted-foreground mt-2">— The REVE Family</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-primary">
                Our Story
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                A Dream Stitched in the Countryside
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  REVE started as a simple dream shared by two partners in a small Philippine town. 
                  With nothing but determination, a sewing machine, and a vision—we began creating 
                  clothes that we ourselves wanted to wear.
                </p>
                <p>
                  Today, every piece that leaves our workshop carries that same spirit: 
                  the belief that quality fashion shouldn't only come from big cities, 
                  and that resilience is the most beautiful fabric of all.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="grid gap-4">
              {values.map((value) => (
                <div 
                  key={value.title}
                  className="flex gap-4 p-4 bg-card rounded-xl shadow-soft"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" asChild>
              <a href="#shop">Explore Our Craft</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
