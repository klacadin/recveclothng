import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy"
        description="Read REVE Clothing's Privacy Policy. Learn how we collect, use, and protect your personal information."
        url="/privacy"
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <nav className="text-xs text-primary-foreground/60 mb-4">
              <Link to="/" className="hover:text-primary-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-foreground">Privacy Policy</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Privacy Policy
            </h1>
            <p className="text-primary-foreground/80 mt-2">
              Last updated: January 2025
            </p>
          </div>
        </section>

        <div className="container py-12">
          <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-3">
                We collect information you provide directly to us when you:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Create an account or place an order</li>
                <li>• Contact us through our website, email, or social media</li>
                <li>• Subscribe to our newsletter</li>
                <li>• Participate in promotions or surveys</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                This information may include your name, email address, phone number, 
                shipping address, and payment information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">We use the information we collect to:</p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Process and fulfill your orders</li>
                <li>• Send order confirmations and shipping updates</li>
                <li>• Respond to your inquiries and provide customer support</li>
                <li>• Send promotional communications (with your consent)</li>
                <li>• Improve our website and services</li>
                <li>• Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground mb-3">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>• <strong>Shipping Partners:</strong> J&T Express for order delivery</li>
                <li>• <strong>Payment Processors:</strong> HitPay for secure payment processing (GCash, Maya, cards)</li>
                <li>• <strong>Service Providers:</strong> Third parties that help us operate our business</li>
                <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure. While we 
                strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to improve your browsing experience, 
                analyze site traffic, and personalize content. You can control cookies through 
                your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground mb-3">You have the right to:</p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Access the personal information we hold about you</li>
                <li>• Request correction of inaccurate information</li>
                <li>• Request deletion of your personal information</li>
                <li>• Opt out of marketing communications</li>
                <li>• Lodge a complaint with the National Privacy Commission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to fulfill the 
                purposes for which it was collected, comply with legal obligations, resolve 
                disputes, and enforce our agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our website is not intended for children under 13. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected 
                information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">9. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. Changes will be posted 
                on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="text-muted-foreground mt-3 space-y-1">
                <li>Email: shop@reveclothingxnobody.com</li>
                <li>Phone: 0955 446 5207</li>
                <li>Address: P5 North Poblacion, Maramag, Bukidnon</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
