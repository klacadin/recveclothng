import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Truck, RotateCcw, Ruler, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import jerseyImage from "@/assets/product-jersey-1.jpg";
import singletImage from "@/assets/product-singlet-1.jpg";

// Mock product data
const productData = {
  id: "1",
  name: "NOBODY Trail Jersey - Red/Black",
  price: 1299,
  description: "Technical trail running jersey built for Philippine heat and humidity. Lightweight mesh panels for maximum ventilation, flatlock seams to prevent chafing, and reflective details for early morning or late evening runs.",
  category: "Trail",
  images: [jerseyImage, singletImage],
  sizes: [
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: false },
    { name: "XL", inStock: true },
    { name: "2XL", inStock: true },
  ],
  features: [
    "Quick-dry fabric technology",
    "UV protection UPF 30+",
    "Reflective prints for visibility",
    "Mesh ventilation panels",
    "Flatlock seams for comfort",
  ],
  isNew: true,
};

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const product = productData; // In real app, fetch by id

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Select a size",
        description: "Please choose a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) x${quantity} added to your cart.`,
    });
  };

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
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase">
                    New
                  </span>
                )}
                {/* Gallery Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
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
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                  {product.category}
                </p>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {product.name}
                </h1>
                <p className="font-display text-2xl font-bold text-foreground mt-2">
                  ₱{product.price.toLocaleString()}
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Size</h3>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Ruler className="h-3 w-3" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      disabled={!size.inStock}
                      onClick={() => setSelectedSize(size.name)}
                      className={`px-4 py-2 text-sm font-medium border rounded transition-all ${
                        selectedSize === size.name
                          ? "bg-foreground text-background border-foreground"
                          : size.inStock
                          ? "bg-background text-foreground border-border hover:border-foreground"
                          : "bg-muted text-muted-foreground border-border cursor-not-allowed line-through"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Guide Modal */}
              {showSizeGuide && (
                <div className="p-4 bg-secondary rounded-sm border border-border animate-fade-in">
                  <h4 className="font-semibold text-sm mb-3">Size Guide (in cm)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4">Size</th>
                          <th className="text-left py-2 px-4">Chest</th>
                          <th className="text-left py-2 px-4">Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border"><td className="py-2 pr-4">XS</td><td className="py-2 px-4">86-91</td><td className="py-2 px-4">66</td></tr>
                        <tr className="border-b border-border"><td className="py-2 pr-4">S</td><td className="py-2 px-4">91-96</td><td className="py-2 px-4">68</td></tr>
                        <tr className="border-b border-border"><td className="py-2 pr-4">M</td><td className="py-2 px-4">96-101</td><td className="py-2 px-4">70</td></tr>
                        <tr className="border-b border-border"><td className="py-2 pr-4">L</td><td className="py-2 px-4">101-107</td><td className="py-2 px-4">72</td></tr>
                        <tr className="border-b border-border"><td className="py-2 pr-4">XL</td><td className="py-2 px-4">107-112</td><td className="py-2 px-4">74</td></tr>
                        <tr><td className="py-2 pr-4">2XL</td><td className="py-2 px-4">112-117</td><td className="py-2 px-4">76</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quantity */}
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
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 border border-border rounded flex items-center justify-center hover:bg-secondary"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3">
                <Button variant="red" size="xl" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="xl">
                  <Heart className="h-5 w-5" />
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

              {/* Features */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
