import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: "trail",
    name: "Trail",
    description: "Technical gear for mountain runners",
    count: 12,
  },
  {
    id: "road",
    name: "Road",
    description: "Lightweight performance for the streets",
    count: 8,
  },
  {
    id: "endurance",
    name: "Endurance",
    description: "Built for the long haul",
    count: 6,
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
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.id}`}
              className="group relative aspect-[4/3] bg-secondary rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-[10px] uppercase tracking-wider text-primary-foreground/60 mb-1">
                  {collection.count} Products
                </p>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsGrid;
