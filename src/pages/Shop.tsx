import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown } from "lucide-react";

import nobodyJersey from "@/assets/product-nobody-jersey.jpg";
import heroTee from "@/assets/product-hero-tee.jpg";
import conquerors3km from "@/assets/product-conquerors-3km.jpg";
import conquerors10km from "@/assets/product-conquerors-10km.jpg";
import tabukVest from "@/assets/product-tabuk-vest.jpg";

// Mock product data
const allProducts = [
  { id: "1", name: "NOBODY Jersey - Red/Black Graffiti", price: 1299, image: nobodyJersey, category: "NOBODY", isNew: true, inStock: true },
  { id: "2", name: "Be Your Own Hero Tee - Pink", price: 899, image: heroTee, category: "NOBODY", isNew: true, inStock: true },
  { id: "3", name: "Conquerors Mix Terrain - 3KM", price: 1199, image: conquerors3km, category: "Event", isNew: false, inStock: true },
  { id: "4", name: "Conquerors Mix Terrain - 10KM", price: 1199, image: conquerors10km, category: "Event", isNew: false, inStock: true },
  { id: "5", name: "Tabuk II AdvenTour Vest", price: 1499, image: tabukVest, category: "Event", isNew: true, inStock: true },
  { id: "6", name: "NOBODY Jersey - Teal/Black", price: 1299, image: nobodyJersey, category: "NOBODY", isNew: false, inStock: true },
  { id: "7", name: "Be Your Own Hero Tee - Black", price: 899, image: heroTee, category: "NOBODY", isNew: false, inStock: false },
  { id: "8", name: "Conquerors Finisher Jersey", price: 1199, image: conquerors3km, category: "Event", isNew: false, inStock: true },
];

const categories = ["All", "NOBODY", "Event", "Trail"];
const sizes = ["XS", "S", "M", "L", "XL", "2XL"];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
    if (inStockOnly && !product.inStock) return false;
    return true;
  });

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
              {filteredProducts.length} products
            </p>
          </div>
        </div>

        <div className="container py-8">
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

            {/* Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="self-start sm:self-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
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

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found matching your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSelectedCategory("All");
                setSelectedSizes([]);
                setInStockOnly(false);
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
