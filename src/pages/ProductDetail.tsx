import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Truck, RotateCcw, ChevronLeft, ChevronRight, Loader2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import { useProductSoldCount } from "@/hooks/useProductSoldCount";
import { useProductReviews } from "@/hooks/useProductReviews";
import { productCodeToImageFilename } from "@/data/productImageMap";
import { getProductImageUrl, resolveProductImageUrl } from "@/data/productImages";
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
  const { soldCount } = useProductSoldCount(product?.id);
  const { reviews, averageRating, submitReview } = useProductReviews(product?.id);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

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
  if (product?.image_url) {
    const resolved = resolveProductImageUrl(product.image_url);
    if (resolved && !allImages.includes(resolved)) allImages.push(resolved);
  }
  if (product?.images && Array.isArray(product.images)) {
    product.images.forEach((img: string) => {
      if (img) {
        const resolved = resolveProductImageUrl(img);
        if (resolved && !allImages.includes(resolved)) allImages.push(resolved);
      }
    });
  }
  if (fallbackProduct && "image" in fallbackProduct && fallbackProduct.image && !allImages.includes(fallbackProduct.image)) {
    allImages.push(resolveProductImageUrl(fallbackProduct.image) || fallbackProduct.image);
  }
  const fallbackImg = product?.image_url ? resolveProductImageUrl(product.image_url) : (fallbackProduct && "image" in fallbackProduct ? resolveProductImageUrl(fallbackProduct.image || "") || fallbackProduct.image : "");
  const images = allImages.length ? allImages : (fallbackImg ? [fallbackImg] : []);
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
                      className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${currentImageIndex === idx ? "border-foreground" : "border-transparent"
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
                {!isFromSpreadsheet && soldCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {soldCount} {soldCount === 1 ? "sold" : "sold"}
                  </p>
                )}

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

              {/* Customer Reviews */}
              {product && (
                <div className="space-y-4 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground">Customer Reviews</h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${averageRating != null && star <= Math.round(averageRating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/40"
                              }`}
                          />
                        ))}
                      </div>
                      <span>
                        {averageRating != null && `${averageRating.toFixed(1)} · `}
                        {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  )}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {reviews.map((r) => (
                      <div key={r.id} className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{r.reviewer_name}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${star <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        {r.comment && <p className="text-muted-foreground">{r.comment}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <form
                    className="space-y-3 pt-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!product) return;
                      if (!reviewName.trim() || !reviewEmail.trim()) {
                        toast({ title: "Name and email required", variant: "destructive" });
                        return;
                      }
                      try {
                        await submitReview.mutateAsync({
                          product_id: product.id,
                          reviewer_name: reviewName.trim(),
                          reviewer_email: reviewEmail.trim(),
                          rating: reviewRating,
                          comment: reviewComment.trim() || null,
                        });
                        setReviewName("");
                        setReviewEmail("");
                        setReviewRating(5);
                        setReviewComment("");
                        toast({ title: "Thank you! Your review has been posted." });
                      } catch (err) {
                        toast({
                          title: "Could not submit review",
                          description: err instanceof Error ? err.message : "Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <h4 className="text-sm font-medium text-foreground">Write a review</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="review-name">Name *</Label>
                        <Input
                          id="review-name"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="review-email">Email *</Label>
                        <Input
                          id="review-email"
                          type="email"
                          value={reviewEmail}
                          onChange={(e) => setReviewEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 rounded hover:bg-secondary"
                            aria-label={`${star} star${star > 1 ? "s" : ""}`}
                          >
                            <Star
                              className={`h-6 w-6 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="review-comment">Comment (optional)</Label>
                      <Textarea
                        id="review-comment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" disabled={submitReview.isPending}>
                      {submitReview.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit review"
                      )}
                    </Button>
                  </form>
                </div>
              )}

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