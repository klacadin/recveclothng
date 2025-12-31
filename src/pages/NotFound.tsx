import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Browse our collection of premium running apparel."
      />
      <Header />
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="container">
          <div className="max-w-lg mx-auto text-center py-16 px-4">
            {/* 404 Illustration */}
            <div className="mb-8">
              <span className="font-display text-8xl md:text-9xl font-bold text-primary/10">
                404
              </span>
            </div>
            
            {/* Message */}
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button asChild size="lg">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/shop">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Shop
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/shop" className="text-accent hover:underline">All Products</Link>
                <Link to="/collections/nobody" className="text-accent hover:underline">NOBODY Collection</Link>
                <Link to="/about" className="text-accent hover:underline">About Us</Link>
                <Link to="/contact" className="text-accent hover:underline">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
