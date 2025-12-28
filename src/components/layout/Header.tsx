import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import reveLogo from "@/assets/reve-logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
  ];

  const collections = [
    { name: "NOBODY", href: "/collections/nobody", description: "Performance sub-brand" },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={reveLogo} 
            alt="REVE Clothing" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Collections Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsCollectionsOpen(true)}
            onMouseLeave={() => setIsCollectionsOpen(false)}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                location.pathname.startsWith("/collections")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Collections
              <ChevronDown className={`h-4 w-4 transition-transform ${isCollectionsOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isCollectionsOpen && (
              <div className="absolute top-full left-0 pt-2 animate-fade-in">
                <div className="bg-background border border-border rounded-sm shadow-lg min-w-[200px]">
                  {collections.map((collection) => (
                    <Link
                      key={collection.name}
                      to={collection.href}
                      className="block px-4 py-3 hover:bg-secondary transition-colors"
                    >
                      <span className="font-display font-semibold text-foreground block">
                        {collection.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {collection.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`py-3 px-4 text-sm font-medium uppercase tracking-wide rounded transition-colors ${
                  isActive(link.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Collections */}
            <div className="pt-2 border-t border-border mt-2">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Collections
              </p>
              {collections.map((collection) => (
                <Link
                  key={collection.name}
                  to={collection.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 text-sm font-medium uppercase tracking-wide rounded transition-colors block ${
                    isActive(collection.href)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
