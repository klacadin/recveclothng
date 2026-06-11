import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, ChevronDown, Search, X, ArrowUpDown, ArrowRight } from "lucide-react";
import { useActiveProducts, isProductNew } from "@/hooks/useProducts";
import { useProductsSoldCount } from "@/hooks/useProductSoldCount";
import { useProductCategories } from "@/hooks/useCategories";
import { getProductDisplayImage } from "@/data/productImages";

/** Canonical product.category values from DB migrations - used when categories table is empty or mismatched */
const PRODUCT_CATEGORY_VALUES = [
  "Running Shirt",
  "Running Shorts",
  "Running Singlets",
  "Running Long Sleeves",
] as const;

/** Category code -> product.category values (products use these exact strings) */
const CODE_TO_PRODUCT_CATEGORIES: Record<string, readonly string[]> = {
  SHRT: ["Running Shirt", "Running Shirts"],
  SHORT: ["Running Shorts"],
  SING: ["Running Singlets"],
  LSLV: ["Running Long Sleeves", "Running Long Sleeve"],
};

/** Match product.category to DB category (by name or code) */
function matchesProductCategory(
  productCategory: string | null,
  categoryName: string,
  categoryCode?: string | null
): boolean {
  const p = (productCategory || "").trim().toLowerCase();
  if (!p) return false;

  // Match by category code first (most reliable)
  if (categoryCode) {
    const allowed = CODE_TO_PRODUCT_CATEGORIES[categoryCode.toUpperCase()];
    if (allowed?.some((c) => p === c.toLowerCase())) return true;
  }

  // Match by name (exact or plural/singular)
  const c = (categoryName || "").trim().toLowerCase();
  if (!c) return false;
  if (p === c) return true;
  if (c.endsWith("s") && p === c.slice(0, -1)) return true;
  if (p.endsWith("s") && c === p.slice(0, -1)) return true;
  return false;
}
const sizes = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "XXXL"];

type SortOption = "newest" | "price-low" | "price-high" | "name-asc";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const { data: allProducts = [], isLoading: productsLoading } = useActiveProducts();
  const { data: dbCategories = [] } = useProductCategories();
  const productIds = useMemo(() => allProducts.map((p) => p.id), [allProducts]);
  const { soldCountByProductId } = useProductsSoldCount(productIds);

  // Categories from DB, or fallback to canonical product categories when DB is empty
  const categories = useMemo(() => {
    if (dbCategories.length > 0) {
      return ["All", ...dbCategories.map((c) => c.name)];
    }
    return ["All", ...PRODUCT_CATEGORY_VALUES];
  }, [dbCategories]);

  // Category boxes for "Shop by Category" section (DB-first, fallback to canonical)
  const shopCategoryBoxes = useMemo(() => {
    const allBox = { slug: "All", name: "All Products", code: "ALL", sub: "Browse everything" as string | null };
    if (dbCategories.length > 0) {
      return [
        allBox,
        ...dbCategories.map((c) => ({
          slug: c.name,
          name: c.name,
          code: c.code || c.slug?.toUpperCase().slice(0, 4) || "",
          sub: null as string | null,
        })),
      ];
    }
    return [
      allBox,
      ...PRODUCT_CATEGORY_VALUES.map((name, i) => ({
        slug: name,
        name,
        code: ["SHRT", "SHORT", "SING", "LSLV"][i] || "",
        sub: null as string | null,
      })),
    ];
  }, [dbCategories]);

  // Build lookup: category name -> category (for code when filtering)
  const categoryByName = useMemo(
    () => new Map(dbCategories.map((c) => [c.name, c])),
    [dbCategories]
  );

  // Filter by category — match product.category to DB category (by name + code)
  const baseProducts = useMemo(() => {
    if (selectedCategory === "All") return allProducts;
    const dbCat = categoryByName.get(selectedCategory);
    const code = dbCat?.code ?? (selectedCategory === "Running Shirt" ? "SHRT" : selectedCategory === "Running Shorts" ? "SHORT" : selectedCategory === "Running Singlets" ? "SING" : selectedCategory === "Running Long Sleeves" ? "LSLV" : null);
    return allProducts.filter((p) => matchesProductCategory(p.category, selectedCategory, code));
  }, [allProducts, selectedCategory, categoryByName]);

  // Update category from URL params on mount (normalize URL param to match our category list)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam) return;
    if (categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      return;
    }
    // Normalize: URL may have "Running Shirt" but DB has "Running Shirts" (or vice versa)
    const normalized = categories.find(
      (c) =>
        c.toLowerCase() === categoryParam.toLowerCase() ||
        (c.toLowerCase().endsWith("s") && c.toLowerCase().slice(0, -1) === categoryParam.toLowerCase()) ||
        (categoryParam.toLowerCase().endsWith("s") && c.toLowerCase() === categoryParam.toLowerCase().slice(0, -1))
    );
    if (normalized) setSelectedCategory(normalized);
  }, [searchParams, categories]);

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let filtered = baseProducts.filter((product) => {
      if (!query) return true;
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesCategory = product.category?.toLowerCase().includes(query);
      return matchesName || matchesCategory;
    });

    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return filtered;
  }, [baseProducts, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shop"
        description="Shop premium running shirts, singlets, shorts, and longsleeves from REVE Clothing. Sizes S to 3XL. Nationwide delivery via J&T. COD, GCash, Maya accepted."
        url="/shop"
      />
      <Header />
      <main id="main-content" className="pt-20" tabIndex={-1}>
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
              {filteredProducts.length} products
            </p>
          </div>
        </div>

        <div className="container py-8">
          {/* Big Category Boxes */}
          <section className="mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {shopCategoryBoxes.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-300 text-left ${isSelected
                        ? "border-foreground ring-2 ring-foreground/20"
                        : "border-border hover:border-foreground/50 hover:shadow-lg"
                      }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-secondary to-secondary" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 min-h-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {cat.code}
                      </span>
                      <h3 className="font-display text-base md:text-lg font-bold text-foreground mt-1 line-clamp-2">
                        {cat.name}
                      </h3>
                      {cat.sub && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {cat.sub}
                        </p>
                      )}
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5 mt-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

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
                  onClick={() => handleCategoryChange(cat)}
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
                        className={`px-3 py-1.5 text-xs font-medium border rounded transition-colors ${selectedSizes.includes(size)
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border hover:border-foreground"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Price Range</h4>
                  <p className="text-sm text-muted-foreground">₱0 - ₱2,000</p>
                </div>
              </div>
            </div>
          )}

          {/* Featured / Products Listing */}
          <section>
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
              </span>
            </div>
            {productsLoading ? (
              <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground mt-2">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    image={getProductDisplayImage(product)}
                    category={product.category || undefined}
                    isNew={isProductNew(product.created_at)}
                    inStock={(product.stock_quantity ?? 0) > 0}
                    soldCount={soldCountByProductId.get(product.id) ?? 0}
                    product={product}
                  />
                ))}
              </div>
            )}
          </section>

          {!productsLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found matching your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSelectedCategory("All");
                setSelectedSizes([]);
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
