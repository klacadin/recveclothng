import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Heart, Mountain } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Performance First",
      description: "Every piece is designed for function, tested on trails and roads before it reaches you.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by athletes, for athletes. We listen to our community and design for real needs.",
    },
    {
      icon: Heart,
      title: "Made with Pride",
      description: "GAWANG BUKID—crafted in Bukidnon with care, quality, and attention to every detail.",
    },
    {
      icon: Mountain,
      title: "Built for Terrain",
      description: "Designed for Philippine conditions—the heat, the humidity, the mountains.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 md:py-32">
          <div className="container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                Our Story
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                Born in the Mountains. Built for Athletes.
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                REVE Clothing started during the pandemic in Bukidnon—when races stopped 
                but the passion for running never did.
              </p>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  The REVE Story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    In 2020, when the world stopped and races were cancelled, two runners 
                    in Bukidnon found themselves with nothing but time and a question: 
                    <em className="text-foreground"> why is it so hard to find quality running 
                    gear that's actually made for Philippine conditions?</em>
                  </p>
                  <p>
                    What started as frustration became a mission. Armed with a sewing machine, 
                    a lot of YouTube tutorials, and an obsession with getting the fabric right, 
                    REVE Clothing was born—literally in our living room.
                  </p>
                  <p>
                    We tested every prototype on mountain trails and provincial roads. 
                    We asked friends to run in our samples and tell us the truth. 
                    We failed. A lot. But we kept iterating until athletes started asking 
                    where to buy what we were wearing.
                  </p>
                  <p className="font-medium text-foreground">
                    GAWANG BUKID isn't just a tagline—it's our identity. Made in the province. 
                    Made with pride. Made for real athletes.
                  </p>
                </div>
              </div>
              <div className="aspect-square bg-secondary rounded-sm flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="font-display text-6xl font-bold text-foreground/10">2020</div>
                  <p className="text-sm text-muted-foreground">Bukidnon, Philippines</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NOBODY Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                  The Philosophy
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  NOBODY
                </h2>
              </div>
              <blockquote className="text-xl md:text-2xl font-light italic text-muted-foreground">
                "For every athlete who shows up when nobody's watching. Who trains when 
                nobody cares. Who finishes when nobody cheers."
              </blockquote>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                NOBODY is our performance sub-brand dedicated to the unsung heroes of 
                endurance sports. Not the podium finishers, but the ones who battle 
                cut-off times. Not the sponsored athletes, but the ones who fund their 
                own races. The 5AM starters. The back-of-the-pack warriors.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                NOBODY cares about your pace—but <span className="text-foreground font-medium">you</span> do. 
                And that's what matters.
              </p>
              <Button variant="red" size="lg" asChild>
                <Link to="/collections/nobody">
                  Shop NOBODY
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                What We Stand For
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="p-6 bg-secondary rounded-sm">
                  <div className="w-12 h-12 rounded-sm bg-background flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready to Gear Up?
            </h2>
            <p className="text-primary-foreground/70 mb-6">
              Explore our collection of performance apparel.
            </p>
            <Button variant="red" size="lg" asChild>
              <Link to="/shop">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
