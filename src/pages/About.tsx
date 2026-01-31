import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Heart, Mountain } from "lucide-react";
import nobodyMission from "@/assets/nobody-mission.png";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Performance First",
      description: "Every piece is designed for function, tested on trail and road before it reaches you—for anyone who demands more.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built for everyone pursuing their personal best. We listen to our community and design for real needs.",
    },
    {
      icon: Heart,
      title: "Made with Pride",
      description: "GAWANG BUKID—crafted in Bukidnon with care, quality, and attention to every detail.",
    },
    {
      icon: Mountain,
      title: "Built for Terrain",
      description: "Designed for Philippine conditions—the heat, the humidity, the mountains. Trail. Road. Endurance.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Us"
        description="REVE Clothing was born during the pandemic in Maramag, Bukidnon. Founded by Jing and Ever Lopez. From Nobody to Somebody. Technical performance apparel for anyone pursuing their personal best—trail, road, endurance."
        url="/about"
      />
      <Header />
      <main id="main-content" className="pt-20" tabIndex={-1}>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 md:py-32">
          <div className="container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                Our Story
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                From Nobody to Somebody
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                REVE Clothing was born during the pandemic in Bukidnon—a time of uncertainty, 
                fear, and survival. From a small step to provide for family, to a brand built 
                on resilience and faith.
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
                    REVE Clothing was born during the pandemic, a time of uncertainty, fear, 
                    and survival. Instead of waiting for help, we chose to stand up. We chose 
                    to create. We chose to provide for our family with our own hands and determination.
                  </p>
                  <p>
                    Founded by <span className="text-foreground font-medium">Jing and Ever Lopez</span> in 
                    Maramag, Bukidnon, REVE started as a solution to cope with daily needs—to put food 
                    on the table and move forward despite the challenges. What began as a small step 
                    during the hardest times became the foundation of a dream built on hard work, 
                    resilience, and faith.
                  </p>
                  <p>
                    REVE is not just a business—it is our leap of faith. A dream we once whispered 
                    in prayer, now slowly becoming reality. This journey is for our family, for our 
                    future, and for the sacrifices behind every step.
                  </p>
                  <p className="font-medium text-foreground">
                    This brand is more than clothing. It is a symbol of perseverance. A reminder 
                    that even in crisis, growth is possible. From survival to purpose. From vision 
                    to reality. TIMING IS EVERYTHING.
                  </p>
                </div>
              </div>
              <div className="aspect-square bg-secondary rounded-sm flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="font-display text-6xl font-bold text-foreground/10">2020</div>
                  <p className="text-sm text-muted-foreground">Maramag, Bukidnon</p>
                  <p className="text-xs text-muted-foreground/70">Jing & Ever Lopez</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NOBODY Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* NOBODY Mission Image */}
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
                </div>
                <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  We believe that greatness isn't about recognition—it's about the 
                  relentless pursuit of personal bests.
                </blockquote>
                <p className="text-muted-foreground leading-relaxed">
                  Our apparel is a tribute to the unsung heroes of the track and trail—those 
                  who push not for applause, but for the love of the journey and the pursuit of their personal best.
                </p>
                <p className="text-muted-foreground leading-relaxed">
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
              Ready to Push Further?
            </h2>
            <p className="text-primary-foreground/70 mb-6">
              Technical performance apparel for anyone pursuing their personal best.
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
