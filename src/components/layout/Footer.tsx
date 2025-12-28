import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin } from "lucide-react";

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
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
              Performance apparel born in Bukidnon. GAWANG BUKID—crafted for 
              athletes who push beyond limits on trail, road, and endurance events.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://facebook.com/reveclothing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/reveclothing" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="mailto:hello@reveclothing.ph"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
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
              <Link to="/collections" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Collections
              </Link>
              <Link to="/shop?category=jerseys" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Trail Jerseys
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
              <Link to="/size-guide" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Size Guide
              </Link>
              <Link to="/shipping" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Shipping Info
              </Link>
              <Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-primary-foreground/50">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">Bukidnon, Philippines</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-primary-foreground/50">
            <span>COD Available</span>
            <span>•</span>
            <span>GCash / Maya</span>
            <span>•</span>
            <span>Nationwide Shipping</span>
          </div>
          <p className="text-primary-foreground/50 text-xs">
            © 2024 REVE Clothing. GAWANG BUKID.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
