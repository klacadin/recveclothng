import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, ChevronDown, Package, Search, X, ArrowUpDown } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

// Import images for fallback
import nobodyJersey from "@/assets/product-nobody-jersey.jpg";
import heroTee from "@/assets/product-hero-tee.jpg";
import conquerors3km from "@/assets/product-conquerors-3km.jpg";
import conquerors10km from "@/assets/product-conquerors-10km.jpg";
import tabukVest from "@/assets/product-tabuk-vest.jpg";

const imageMap: Record<string, string> = {
  '/assets/product-nobody-jersey.jpg': nobodyJersey,
  '/assets/product-hero-tee.jpg': heroTee,
  '/assets/product-conquerors-3km.jpg': conquerors3km,
  '/assets/product-conquerors-10km.jpg': conquerors10km,
  '/assets/product-tabuk-vest.jpg': tabukVest,
};

const categories = ["All", "NOBODY", "Event", "Trail"];
const sizes = ["XS", "S", "M", "L", "XL", "2XL"];

type SortOption = "newest" | "price-low" | "price-high" | "name-asc";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const { data: products = [], isLoading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let filtered = products
      .filter(p => p.is_active)
      .filter((product) => {
        // Search filter
        if (query) {
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesCategory = product.category?.toLowerCase().includes(query);
          const matchesDescription = product.description?.toLowerCase().includes(query);
          if (!matchesName && !matchesCategory && !matchesDescription) return false;
        }
        // Category filter
        if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
        // Stock filter
        if (inStockOnly && product.stock_quantity === 0) return false;
        return true;
      });

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-asc":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, inStockOnly, sortBy]);

  const getProductImage = (imageUrl: string | null) => {
    if (!imageUrl) return nobodyJersey;
    return imageMap[imageUrl] || imageUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-secondary border-b border-border">
          <div className="container py-8">
            <nav className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Shop</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              All Products
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLoading ? 'Loading...' : `${filteredProducts.length} products`}
            </p>
          </div>
        </div>

        <div className="container py-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[160px] h-9">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mb-8 p-6 bg-secondary rounded-sm border border-border animate-fade-in">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Size Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size]
                          );
                        }}
                        className={`px-3 py-1.5 text-xs font-medium border rounded transition-colors ${
                          selectedSizes.includes(size)
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Availability</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span className="text-sm text-foreground">In Stock Only</span>
                  </label>
                </div>

                {/* Price Range (placeholder) */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Price Range</h4>
                  <p className="text-sm text-muted-foreground">₱0 - ₱2,000</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Failed to load products. Please try again.</p>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  image={getProductImage(product.image_url)}
                  category={product.category || undefined}
                  isNew={new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                  inStock={product.stock_quantity > 0}
                  product={product}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found matching your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSelectedCategory("All");
                setSelectedSizes([]);
                setInStockOnly(false);
                setSearchQuery("");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
