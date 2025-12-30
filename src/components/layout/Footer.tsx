import { Link } from "react-router-dom";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="font-display text-2xl font-bold">REVE</h3>
              <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/60">
                Clothing
              </p>
            </div>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider">
              TIMING IS EVERYTHING
            </p>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
              From Nobody to Somebody. Performance apparel born in Bukidnon—crafted 
              with premium quality at affordable prices.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://www.facebook.com/profile.php?id=61551403173498" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="mailto:reveclothing214@gmail.com"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="tel:09554465207"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">
              Shop
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/shop" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                All Products
              </Link>
              <Link to="/shop?category=running" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Running Shirts
              </Link>
              <Link to="/shop?category=singlets" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Running Singlets
              </Link>
              <Link to="/shop?category=shorts" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Running Shorts
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider">
              Support
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                About Us
              </Link>
              <Link to="/my-orders" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Track Order
              </Link>
            </nav>
            <div className="pt-2 space-y-1 text-sm text-primary-foreground/70">
              <p>Email: reveclothing214@gmail.com</p>
              <p>Phone: 0955 446 5207</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-primary-foreground/50">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">P5 North Poblacion, Maramag, Bukidnon</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-primary-foreground/50">
            <span>COD Available</span>
            <span>•</span>
            <span>GCash / Maya</span>
            <span>•</span>
            <span>Nationwide via J&T</span>
          </div>
          <p className="text-primary-foreground/50 text-xs">
            © 2024 REVE Clothing. Timing is Everything.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
