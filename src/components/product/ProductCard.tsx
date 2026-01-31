import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  isNew?: boolean;
  inStock?: boolean;
  product?: Product;
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
  product,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  
  const isWishlisted = product ? isInWishlist(product.id) : false;
  
  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For quick add from card, we don't add to cart - redirect to product page for size selection
    // This is intentional UX - size selection is required
    if (product) {
      toast({
        title: "Select a size",
        description: "Please visit the product page to select your size.",
      });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product) {
      toggleWishlist(product);
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlisted 
          ? `${name} has been removed from your wishlist.`
          : `${name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div className="group relative bg-card border border-border rounded overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Wishlist Button */}
      {product && (
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
      )}

      {/* Image Container */}
      <Link to={`/product/${id}`} className="block relative aspect-[3/4] bg-secondary overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain bg-secondary group-hover:scale-105 transition-transform duration-500"
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
        {inStock && product && (
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full gap-2"
              onClick={handleAddToCart}
            >
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
