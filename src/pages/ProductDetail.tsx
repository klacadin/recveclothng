import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Truck, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: product, isLoading, error } = useProduct(id || '');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock_quantity < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${product.stock_quantity} items available.`,
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} x${quantity} added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    toggleWishlist(product);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.image_url ? [product.image_url] : [];
  const inStock = product.stock_quantity > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container py-4">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        <div className="container pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] bg-secondary rounded-sm overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image available
                  </div>
                )}
                
                {/* Gallery Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Stock Status Overlay */}
                {!inStock && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="px-4 py-2 bg-foreground text-background text-sm font-semibold uppercase">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                        currentImageIndex === idx ? "border-foreground" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.category && (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                    {product.category}
                  </p>
                )}
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {product.name}
                </h1>
                <p className="font-display text-2xl font-bold text-foreground mt-2">
                  ₱{product.price.toLocaleString()}
                </p>
                
                {/* Stock indicator */}
                <p className={`text-sm mt-2 ${inStock ? 'text-green-600' : 'text-destructive'}`}>
                  {inStock ? `${product.stock_quantity} in stock` : 'Out of stock'}
                </p>
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Quantity */}
              {inStock && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Quantity</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-secondary"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                      className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-secondary"
                      disabled={quantity >= product.stock_quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-3">
                <Button 
                  variant="red" 
                  size="xl" 
                  className="flex-1" 
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {inStock ? 'Add to Cart' : 'Sold Out'}
                </Button>
                <Button 
                  variant={isWishlisted ? "default" : "outline"} 
                  size="xl"
                  onClick={handleToggleWishlist}
                  className={isWishlisted ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Nationwide Shipping</p>
                    <p className="text-xs text-muted-foreground">Free on orders ₱1,500+ • 3-7 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">7-day return policy for unworn items</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="px-2 py-1 bg-secondary text-xs font-medium rounded">COD</span>
                  <span className="px-2 py-1 bg-secondary text-xs font-medium rounded">GCash</span>
                  <span className="px-2 py-1 bg-secondary text-xs font-medium rounded">Maya</span>
                </div>
              </div>

              {/* SKU */}
              {product.sku && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
