import { Link } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import jerseyImage from "@/assets/product-jersey-1.jpg";
import singletImage from "@/assets/product-singlet-1.jpg";
import shortsImage from "@/assets/product-shorts-1.jpg";

// Featured products
const featuredProducts = [
  { 
    id: "1", 
    name: "NOBODY Trail Jersey - Red/Black", 
    price: 1299, 
    image: jerseyImage, 
    category: "Trail", 
    isNew: true,
    inStock: true,
  },
  { 
    id: "2", 
    name: "Performance Singlet - Black", 
    price: 899, 
    image: singletImage, 
    category: "Run", 
    isNew: false,
    inStock: true,
  },
  { 
    id: "3", 
    name: "Elite Running Shorts", 
    price: 999, 
    originalPrice: 1299,
    image: shortsImage, 
    category: "Run", 
    isNew: false,
    inStock: true,
  },
  { 
    id: "4", 
    name: "NOBODY Trail Jersey - Black", 
    price: 1299, 
    image: singletImage, 
    category: "Trail", 
    isNew: true,
    inStock: false,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              Featured
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Top Picks
            </h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="self-start md:self-auto">
            <Link to="/shop">
              View All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
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
  );
};

export default FeaturedProducts;
