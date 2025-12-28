import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Hero products - top 10 bestsellers
const heroProducts = [
  { id: "1", name: "Classic Polo Tee - Earth Brown", price: 599, originalPrice: 799, isHero: true, tag: "New" },
  { id: "2", name: "Weekend Joggers - Charcoal", price: 899, isHero: true },
  { id: "3", name: "Countryside Cotton Shirt", price: 749, originalPrice: 999, isHero: true },
  { id: "4", name: "Relaxed Fit Hoodie - Forest", price: 1299, isHero: true, tag: "Limited" },
  { id: "5", name: "Essential V-Neck Tee", price: 449, isHero: true },
  { id: "6", name: "Premium Cargo Shorts", price: 799, originalPrice: 1099 },
  { id: "7", name: "Breathable Linen Blend Top", price: 699 },
  { id: "8", name: "Everyday Comfort Pants", price: 949, tag: "Restocked" },
  { id: "9", name: "Minimalist Cap - Stone", price: 399 },
  { id: "10", name: "Lightweight Jacket - Clay", price: 1499, originalPrice: 1999 },
];

const ProductsSection = () => {
  return (
    <section id="shop" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-primary mb-3">
            Curated Collection
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Our Top 10 Picks
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Handpicked favorites that our community loves. 
            Quality craftsmanship, everyday comfort, countryside soul.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {heroProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10 md:mt-14">
          <Button variant="outline" size="lg" className="gap-2">
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
