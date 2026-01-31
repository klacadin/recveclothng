import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Truck, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import { productCodeToImageFilename } from "@/data/productImageMap";
import { getProductImageUrl } from "@/data/productImages";
import { getProductById } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Database } from "@/integrations/supabase/types";

type ProductSize = Database['public']['Enums']['product_size'];
const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: product, isLoading, error } = useProduct(id || '');
  const { data: variants, isLoading: variantsLoading } = useProductVariants(product?.id ?? '');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Get stock for selected size
  const getStockForSize = (size: ProductSize): number => {
    if (!variants) return 0;
    const variant = variants.find(v => v.size === size);
    return variant?.stock_quantity || 0;
  };

  const selectedSizeStock = selectedSize ? getStockForSize(selectedSize) : 0;
  const totalStock = variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;

  // Reset quantity when size changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast({
        title: "Select a size",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedSizeStock < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${selectedSizeStock} items available in size ${selectedSize}.`,
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, selectedSize, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) x${quantity} added to your cart.`,
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

  // Fallback: if Supabase has no product, show from spreadsheet (e.g. before migration is run)
  const fallbackProduct = !product && !isLoading && id ? getProductById(id) : null;

  if (isLoading || (product && variantsLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="pt-20 flex items-center justify-center min-h-[60vh]" tabIndex={-1}>
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || (!product && !fallbackProduct)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="pt-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-4" tabIndex={-1}>
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

  // Use Supabase product when available, otherwise spreadsheet fallback (no add-to-cart)
  const displayProduct = product ?? fallbackProduct;
  const isFromSpreadsheet = !product && !!fallbackProduct;
  const sku = product?.sku ?? (fallbackProduct && "code" in fallbackProduct ? fallbackProduct.code : null);
  const displayDescription = product?.description ?? (fallbackProduct && "specs" in fallbackProduct && fallbackProduct.whyCustomersBuy
    ? `${fallbackProduct.specs || ""}\n\nWhy customers buy: ${fallbackProduct.whyCustomersBuy}`.trim()
    : (fallbackProduct && "description" in fallbackProduct ? fallbackProduct.description : ""));

  // Prefer batch1 image when we have sku (canonical NOBODY products)
  const batch1Filename = sku ? productCodeToImageFilename[sku] : null;
  const primaryImageUrl = batch1Filename ? getProductImageUrl(batch1Filename) : null;
  const allImages: string[] = [];
  if (primaryImageUrl) allImages.push(primaryImageUrl);
  if (product?.image_url && !allImages.includes(product.image_url)) allImages.push(product.image_url);
  if (product?.images && Array.isArray(product.images)) {
    product.images.forEach((img: string) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }
  if (fallbackProduct && "image" in fallbackProduct && fallbackProduct.image && !allImages.includes(fallbackProduct.image)) {
    allImages.push(fallbackProduct.image);
  }
  const images = allImages.length ? allImages : (product?.image_url ? [product.image_url] : (fallbackProduct && "image" in fallbackProduct && fallbackProduct.image ? [fallbackProduct.image] : []));
  const inStock = isFromSpreadsheet ? true : totalStock > 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={displayProduct.name}
        description={displayDescription || `Shop ${displayProduct.name} from REVE Clothing. Premium quality athletic wear. ₱${Number(displayProduct.price).toLocaleString()}. Sizes S-XL. Nationwide delivery.`}
        url={`/product/${id}`}
        type="product"
        price={Number(displayProduct.price)}
        image={images[0]}
      />
      <Header />
      <main id="main-content" className="pt-20" tabIndex={-1}>
        {/* Breadcrumb */}
        <div className="container py-4">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{displayProduct.name}</span>
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
                    alt={displayProduct.name}
                    className="w-full h-full object-contain bg-secondary"
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
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
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
                      <img src={img} alt={`${displayProduct.name} - View ${idx + 1}`} className="w-full h-full object-contain bg-secondary" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {(displayProduct.category || (fallbackProduct && "category" in fallbackProduct && fallbackProduct.category)) && (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                    {displayProduct.category || (fallbackProduct && "category" in fallbackProduct ? fallbackProduct.category : "")}
                  </p>
                )}
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {displayProduct.name}
                </h1>
                <p className="font-display text-2xl font-bold text-foreground mt-2">
                  ₱{Number(displayProduct.price).toLocaleString()}
                </p>
                
                {/* Stock indicator (Supabase only); spreadsheet fallback shows CTA below) */}
                {!isFromSpreadsheet && (
                  <p className={`text-sm mt-2 ${inStock ? 'text-green-600' : 'text-destructive'}`}>
                    {inStock ? `${totalStock} total in stock` : 'Out of stock'}
                  </p>
                )}
              </div>

              {displayDescription && (
                <div className="space-y-4">
                  {displayDescription.includes("Why customers buy:") ? (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Specs</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {displayDescription.split("Why customers buy:")[0].trim().replace(/\n\n/g, " ")}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Why customers buy</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {displayDescription.split("Why customers buy:")[1]?.trim() || ""}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{displayDescription}</p>
                  )}
                </div>
              )}

              {/* Size Selector (Supabase product only) */}
              {!isFromSpreadsheet && inStock && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Size {selectedSize && <span className="text-muted-foreground font-normal">({selectedSizeStock} available)</span>}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => {
                      const stock = getStockForSize(size);
                      const isAvailable = stock > 0;
                      const isSelected = selectedSize === size;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={`
                            w-12 h-12 border rounded flex items-center justify-center text-sm font-medium transition-all
                            ${isSelected 
                              ? 'border-foreground bg-foreground text-background' 
                              : isAvailable 
                                ? 'border-border hover:border-foreground' 
                                : 'border-border/50 text-muted-foreground/50 cursor-not-allowed line-through'
                            }
                          `}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedSize && (
                    <p className="text-xs text-muted-foreground mt-2">Please select a size</p>
                  )}
                </div>
              )}

              {/* Quantity (Supabase product only) */}
              {!isFromSpreadsheet && inStock && selectedSize && (
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
                      onClick={() => setQuantity((q) => Math.min(selectedSizeStock, q + 1))}
                      className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-secondary"
                      disabled={quantity >= selectedSizeStock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart & Wishlist (Supabase product only) */}
              {!isFromSpreadsheet && (
                <div className="flex gap-3">
                  <Button variant="red" size="xl" className="flex-1" onClick={handleAddToCart} disabled={!inStock || !selectedSize}>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {!inStock ? 'Sold Out' : !selectedSize ? 'Select Size' : 'Add to Cart'}
                  </Button>
                  <Button variant={isWishlisted ? "default" : "outline"} size="xl" onClick={handleToggleWishlist} className={isWishlisted ? 'bg-red-500 hover:bg-red-600 text-white' : ''}>
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              )}

              {/* When product is from spreadsheet (DB not synced), show CTA */}
              {isFromSpreadsheet && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">To order with size selection and checkout, sync your database with the migration, or contact us.</p>
                  <Button variant="red" size="xl" asChild>
                    <Link to="/shop">View all products</Link>
                  </Button>
                  <Button variant="outline" size="xl" asChild>
                    <Link to="/contact">Contact us</Link>
                  </Button>
                </div>
              )}

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
              {sku && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">SKU: {sku}</p>
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