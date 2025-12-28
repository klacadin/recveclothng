import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  isNew?: boolean;
  inStock?: boolean;
}

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image, 
  category,
  isNew = false,
  inStock = true,
}: ProductCardProps) => {
  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <div className="group relative bg-card border border-border rounded overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <Link to={`/product/${id}`} className="block relative aspect-[3/4] bg-secondary overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-2 py-1 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-1 bg-foreground text-background text-[10px] font-bold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        {!inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="px-3 py-1.5 bg-foreground text-background text-xs font-semibold uppercase tracking-wide">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick Add */}
        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="default" size="sm" className="w-full gap-2">
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-1">
        {category && (
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {category}
          </p>
        )}
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-display font-semibold text-foreground">
            ₱{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₱{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
