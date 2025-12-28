import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  tag?: string;
  isHero?: boolean;
}

const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  image, 
  tag,
  isHero = false 
}: ProductCardProps) => {
  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <div className={`group relative bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 ${isHero ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
        {/* Product Image Placeholder */}
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-card">
            <span className="font-serif text-4xl text-primary/30">R</span>
          </div>
        )}

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isHero && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
              Bestseller
            </span>
          )}
          {tag && (
            <span className="px-2 py-1 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
              {tag}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background">
          <Heart className="h-4 w-4 text-foreground" />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="secondary" size="sm" className="w-full gap-2">
            <ShoppingBag className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">
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
