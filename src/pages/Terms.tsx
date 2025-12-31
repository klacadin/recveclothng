import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Terms of Service"
        description="Read the Terms of Service for REVE Clothing. Learn about our policies, user responsibilities, and terms of use."
        url="/terms"
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <nav className="text-xs text-primary-foreground/60 mb-4">
              <Link to="/" className="hover:text-primary-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-foreground">Terms of Service</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Terms of Service
            </h1>
            <p className="text-primary-foreground/80 mt-2">
              Last updated: January 2025
            </p>
          </div>
        </section>

        <div className="container py-12">
          <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using the REVE Clothing website and services, you agree to be bound 
                by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. Products and Orders</h2>
              <ul className="text-muted-foreground space-y-2">
                <li>• All product images are for illustrative purposes. Actual products may vary slightly in color due to screen differences.</li>
                <li>• Prices are in Philippine Pesos (₱) and are subject to change without prior notice.</li>
                <li>• We reserve the right to limit quantities or refuse orders at our discretion.</li>
                <li>• Order confirmation does not guarantee product availability. If an item becomes unavailable, we will notify you and offer a refund.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Payment</h2>
              <p className="text-muted-foreground mb-3">
                We accept the following payment methods:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• <strong>Cash on Delivery (COD)</strong> - Pay when your order arrives</li>
                <li>• <strong>GCash</strong> - Online payment</li>
                <li>• <strong>Maya</strong> - Online payment</li>
                <li>• <strong>Bank Transfer</strong> - Direct deposit</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                All online payments are processed securely through Xendit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Shipping</h2>
              <p className="text-muted-foreground">
                We ship nationwide via J&T Express. Shipping fees and delivery times vary by location. 
                Free shipping is available for orders ₱1,500 and above. See our{" "}
                <Link to="/shipping" className="text-accent hover:underline">Shipping Information</Link> page for details.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Returns and Refunds</h2>
              <p className="text-muted-foreground">
                Please refer to our <Link to="/returns" className="text-accent hover:underline">Return Policy</Link> for 
                information on returns, exchanges, and refunds.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this website, including text, graphics, logos, images, and software, 
                is the property of REVE Clothing and is protected by Philippine and international 
                copyright laws. You may not reproduce, distribute, or use any content without our written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. User Conduct</h2>
              <p className="text-muted-foreground mb-3">You agree not to:</p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Use the website for any unlawful purpose</li>
                <li>• Attempt to gain unauthorized access to any part of the website</li>
                <li>• Submit false or misleading information</li>
                <li>• Interfere with the proper functioning of the website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                REVE Clothing shall not be liable for any indirect, incidental, special, or consequential 
                damages arising from your use of our website or products. Our total liability shall not 
                exceed the amount you paid for the product in question.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms of Service from time to time. Changes will be posted on this 
                page with an updated revision date. Continued use of our services constitutes acceptance 
                of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <ul className="text-muted-foreground mt-3 space-y-1">
                <li>Email: reveclothing214@gmail.com</li>
                <li>Phone: 0955 446 5207</li>
                <li>Facebook: <a href="https://www.facebook.com/profile.php?id=61551403173498" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">REVE Clothing</a></li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
