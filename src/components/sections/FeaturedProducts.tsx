import { Link } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useActiveProducts, isProductNew } from "@/hooks/useProducts";
import { getProductDisplayImage } from "@/data/productImages";

const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useActiveProducts();
  const featuredProducts = products.slice(0, 4);

  if (isLoading) return null;

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
              <ProductCard
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                image={getProductDisplayImage(product)}
                category={product.category || undefined}
                isNew={isProductNew(product.created_at)}
                inStock={(product.stock_quantity ?? 0) > 0}
                product={product}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
