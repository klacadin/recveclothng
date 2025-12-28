import { Facebook, MessageCircle, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-earth text-cream">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl">REVE Clothing</h3>
            <p className="text-cream/70 text-sm leading-relaxed max-w-xs">
              Handcrafted with love from the Philippine countryside. 
              Every piece tells a story of resilience and craft.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <a href="#shop" className="text-cream/70 hover:text-cream text-sm transition-colors">
                Shop Collection
              </a>
              <a href="#story" className="text-cream/70 hover:text-cream text-sm transition-colors">
                Our Story
              </a>
              <a href="#" className="text-cream/70 hover:text-cream text-sm transition-colors">
                Size Guide
              </a>
              <a href="#" className="text-cream/70 hover:text-cream text-sm transition-colors">
                Shipping Info
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a 
                href="https://facebook.com/reveclothing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook Page</span>
              </a>
              <a 
                href="https://m.me/reveclothing" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream/70 hover:text-cream transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Messenger</span>
              </a>
              <div className="flex items-center gap-2 text-cream/70">
                <Phone className="h-4 w-4" />
                <span>+63 XXX XXX XXXX</span>
              </div>
              <div className="flex items-start gap-2 text-cream/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Countryside, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-xs">
            © 2024 REVE Clothing. Handmade with ❤️ in the Philippines.
          </p>
          <div className="flex items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Gcash.svg/1200px-Gcash.svg.png" 
              alt="GCash" 
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <span className="text-cream/50 text-xs">COD Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
