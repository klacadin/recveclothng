import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, MapPin, Package, CreditCard } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shipping Information"
        description="REVE Clothing ships nationwide via J&T Express. Shipping fee varies based on total parcel weight and destination. 3-7 business days delivery. COD available."
        url="/shipping"
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <nav className="text-xs text-primary-foreground/60 mb-4">
              <Link to="/" className="hover:text-primary-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-foreground">Shipping Information</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Truck className="h-8 w-8" />
              Shipping Information
            </h1>
            <p className="text-primary-foreground/80 mt-2 max-w-xl">
              Everything you need to know about how we get your orders to you.
            </p>
          </div>
        </section>

        <div className="container py-12">
          {/* Key Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Truck className="h-8 w-8 mx-auto mb-3 text-accent" />
                <p className="font-semibold">Free Shipping</p>
                <p className="text-sm text-muted-foreground">On orders ₱1,500+</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <CreditCard className="h-8 w-8 mx-auto mb-3 text-accent" />
                <p className="font-semibold">Weight-based</p>
                <p className="text-sm text-muted-foreground">Depends on weight + location</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 mx-auto mb-3 text-accent" />
                <p className="font-semibold">Processing Time</p>
                <p className="text-sm text-muted-foreground">1-2 business days</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-accent" />
                <p className="font-semibold">Delivery Time</p>
                <p className="text-sm text-muted-foreground">3-7 business days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shipping Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent" />
                  Shipping Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-semibold">Weight</th>
                        <th className="text-left py-3 font-semibold">Shipping Fee (starts from)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3">≤ 0.5kg</td>
                        <td className="py-3">₱85+</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">0.5kg–1kg</td>
                        <td className="py-3">₱155+</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">1kg–3kg</td>
                        <td className="py-3">₱180+</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-accent/5">
                        <td className="py-3 font-medium">3kg–6kg</td>
                        <td className="py-3 font-medium text-accent">Calculated at checkout</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">
                  * Shipping fees are calculated at checkout based on total parcel weight (quantity included) and destination.
                </p>
              </CardContent>
            </Card>

            {/* Delivery Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Delivery Timeframes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-semibold">Location</th>
                        <th className="text-left py-3 font-semibold">Estimated Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Metro Manila</td>
                        <td className="py-3">3-5 business days</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Luzon (provincial)</td>
                        <td className="py-3">4-6 business days</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Visayas</td>
                        <td className="py-3">5-7 business days</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Mindanao</td>
                        <td className="py-3">3-5 business days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">
                  * Delivery times may vary during holidays and sale events.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Partner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  We ship all orders via <strong className="text-foreground">J&T Express</strong>,
                  one of the most reliable courier services in the Philippines.
                </p>
                <p className="text-sm text-muted-foreground">
                  Once your order is shipped, you'll receive a tracking number via email or SMS
                  to monitor your package's delivery status.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary rounded-sm text-center">
                    <p className="font-medium text-sm">J&T COD</p>
                    <p className="text-xs text-muted-foreground">Pay courier when order arrives</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-sm text-center">
                    <p className="font-medium text-sm">GCash</p>
                    <p className="text-xs text-muted-foreground">E-Wallet</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-sm text-center">
                    <p className="font-medium text-sm">Maya</p>
                    <p className="text-xs text-muted-foreground">E-Wallet</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-sm text-center">
                    <p className="font-medium text-sm">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground">Direct deposit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-sm">When will my order be shipped?</p>
                <p className="text-sm text-muted-foreground">
                  Orders are processed within 1-2 business days. Once shipped, you'll receive a tracking notification.
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">Can I change my shipping address?</p>
                <p className="text-sm text-muted-foreground">
                  Please contact us immediately via Facebook or email if you need to change your shipping address before your order is shipped.
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm">What if my package is lost or damaged?</p>
                <p className="text-sm text-muted-foreground">
                  Contact us within 48 hours of expected delivery. We'll work with J&T to resolve the issue and may offer a replacement or refund.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shipping;
