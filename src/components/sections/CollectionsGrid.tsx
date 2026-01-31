import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: "nobody",
    name: "NOBODY",
    description: "Running apparel sub-brand — Shirt, Shorts, Singlets, Long Sleeves. For the unsung heroes of the track and trail.",
    href: "/collections/nobody",
    comingSoon: false,
  },
  {
    id: "coming-soon-1",
    name: "More collections",
    description: "Coming soon.",
    href: "#",
    comingSoon: true,
  },
  {
    id: "coming-soon-2",
    name: "More collections",
    description: "Coming soon.",
    href: "#",
    comingSoon: true,
  },
];

const CollectionsGrid = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            Collections
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Shop by Category
          </h2>
        </div>

        {/* Collections */}
        <div className="grid md:grid-cols-3 gap-4">
          {collections.map((collection) =>
            collection.comingSoon ? (
              <div
                key={collection.id}
                className="relative aspect-[4/3] bg-secondary rounded-sm overflow-hidden border border-dashed border-border opacity-75"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Coming soon
                  </p>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
              </div>
            ) : (
              <Link
                key={collection.id}
                to={collection.href}
                className="group relative aspect-[4/3] bg-secondary rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-display text-2xl font-bold text-primary-foreground mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-primary-foreground/70 mb-4">
                    {collection.description}
                  </p>
                  <Button variant="white" size="sm" className="self-start opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionsGrid;
