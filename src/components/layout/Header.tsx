import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart, ChevronDown, User, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import reveLogo from "@/assets/reve-logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const location = useLocation();
  const { totalItems: cartItems, setIsCartOpen } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();

  // Skip navigation link for accessibility
  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "News", href: "/news" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const nobodySubCategories = [
    { name: "Running Shirt", href: "/collections/nobody?category=Running+Shirt" },
    { name: "Running Shorts", href: "/collections/nobody?category=Running+Shorts" },
    { name: "Running Singlets", href: "/collections/nobody?category=Running+Singlets" },
    { name: "Running Long Sleeves", href: "/collections/nobody?category=Running+Long+Sleeves" },
  ];

  const collections = [
    { name: "NOBODY", href: "/collections/nobody", description: "Running apparel sub-brand", subCategories: nobodySubCategories },
  ];


  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>
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
                className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${isActive(link.href)
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
                className={`flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${location.pathname.startsWith("/collections")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Collections
                <ChevronDown className={`h-4 w-4 transition-transform ${isCollectionsOpen ? "rotate-180" : ""}`} />
              </button>

              {isCollectionsOpen && (
                <div className="absolute top-full left-0 pt-2 animate-fade-in">
                  <div className="bg-background border border-border rounded-sm shadow-lg min-w-[260px]">
                    {/* Collections Section */}
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Collections
                      </p>
                      {collections.map((collection) => (
                        <div key={collection.name}>
                          <Link
                            to={collection.href}
                            className="block px-2 py-2 hover:bg-secondary transition-colors rounded-sm"
                          >
                            <span className="font-display font-semibold text-foreground block text-sm">
                              {collection.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {collection.description}
                            </span>
                          </Link>
                          {"subCategories" in collection && collection.subCategories?.length ? (
                            <div className="pl-2 pb-2 space-y-0.5">
                              {collection.subCategories.map((sub) => (
                                <Link
                                  key={sub.name}
                                  to={sub.href}
                                  className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors rounded-sm"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders" className="cursor-pointer">
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                asChild
              >
                <Link to="/admin/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex relative"
              asChild
            >
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistItems > 99 ? '99+' : wishlistItems}
                  </span>
                )}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartItems > 99 ? '99+' : cartItems}
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
                  className={`py-3 px-4 text-sm font-medium uppercase tracking-wide rounded transition-colors ${isActive(link.href)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Wishlist Link */}
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className={`py-3 px-4 text-sm font-medium uppercase tracking-wide rounded transition-colors flex items-center justify-between ${isActive('/wishlist')
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </span>
                {wishlistItems > 0 && (
                  <span className="h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {wishlistItems}
                  </span>
                )}
              </Link>

              {/* Mobile My Orders Link (if logged in) */}
              {user && (
                <Link
                  to="/my-orders"
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 text-sm font-medium uppercase tracking-wide rounded transition-colors flex items-center gap-2 ${isActive('/my-orders')
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
              )}

              {/* Mobile Collections */}
              <div className="pt-2 border-t border-border mt-2">
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Collections
                </p>
                {collections.map((collection) => (
                  <div key={collection.name}>
                    <Link
                      to={collection.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`py-3 px-4 text-sm font-medium uppercase tracking-wide rounded transition-colors block ${isActive(collection.href)
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                    >
                      {collection.name}
                    </Link>
                    {"subCategories" in collection && collection.subCategories?.length ? (
                      <div className="pl-6 pb-2 space-y-0.5">
                        {collection.subCategories.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-sm text-muted-foreground hover:text-foreground rounded transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Mobile Account Section */}
              <div className="pt-2 border-t border-border mt-2">
                {user ? (
                  <>
                    <p className="px-4 py-2 text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-3 px-4 text-sm font-medium uppercase tracking-wide rounded transition-colors text-left flex items-center gap-2 text-destructive hover:bg-secondary"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 px-4 text-sm font-medium uppercase tracking-wide rounded transition-colors flex items-center gap-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
