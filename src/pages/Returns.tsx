import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, CheckCircle2, XCircle, MessageCircle } from "lucide-react";

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Return & Refund Policy"
        description="REVE Clothing's return and refund policy. 7-day return window for unworn items. Learn about our exchange and refund process."
        url="/returns"
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <nav className="text-xs text-primary-foreground/60 mb-4">
              <Link to="/" className="hover:text-primary-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-foreground">Return & Refund Policy</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-3">
              <RotateCcw className="h-8 w-8" />
              Return & Refund Policy
            </h1>
            <p className="text-primary-foreground/80 mt-2 max-w-xl">
              We want you to love your REVE gear. If something's not right, we're here to help.
            </p>
          </div>
        </section>

        <div className="container py-12">
          {/* Key Points */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-accent mb-2">7</div>
                <p className="font-semibold">Days Return Window</p>
                <p className="text-sm text-muted-foreground">From delivery date</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <RotateCcw className="h-8 w-8 mx-auto mb-2 text-accent" />
                <p className="font-semibold">Free Exchange</p>
                <p className="text-sm text-muted-foreground">For sizing issues</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-accent" />
                <p className="font-semibold">Easy Process</p>
                <p className="text-sm text-muted-foreground">Contact us on FB</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Eligible for Return */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Items returned within 7 days of delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Unworn, unwashed items with original tags attached</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Items in original packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Defective or damaged items (reported within 48 hours)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Wrong item or size received</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Not Eligible */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Not Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span>Items returned after 7 days from delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span>Worn, washed, or altered items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span>Items without original tags or packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span>Items marked as "Final Sale" or bought during clearance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span>Items damaged due to misuse or improper care</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Return Process */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center mx-auto mb-3">1</div>
                  <p className="font-semibold text-sm">Contact Us</p>
                  <p className="text-xs text-muted-foreground">Message us on Facebook or email within 7 days of delivery</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center mx-auto mb-3">2</div>
                  <p className="font-semibold text-sm">Get Approval</p>
                  <p className="text-xs text-muted-foreground">We'll review your request and provide return instructions</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center mx-auto mb-3">3</div>
                  <p className="font-semibold text-sm">Ship Item</p>
                  <p className="text-xs text-muted-foreground">Send the item via J&T to our address in Maramag, Bukidnon</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center mx-auto mb-3">4</div>
                  <p className="font-semibold text-sm">Receive Refund</p>
                  <p className="text-xs text-muted-foreground">Refund processed within 5-7 business days after receiving item</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Info */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Refund Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">Refunds will be processed using the original payment method:</p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>GCash/Maya:</strong> Refund to your e-wallet</li>
                  <li>• <strong>Bank Transfer:</strong> Refund to your bank account</li>
                  <li>• <strong>COD:</strong> Refund via GCash or bank transfer</li>
                </ul>
                <p className="text-muted-foreground">
                  Shipping fees are non-refundable unless the return is due to our error (wrong item, defective product).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exchanges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Need a different size? We offer free exchanges for sizing issues:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Contact us within 7 days of delivery</li>
                  <li>• We'll send you a prepaid return label (for sizing issues only)</li>
                  <li>• Once we receive your item, we'll ship the new size</li>
                  <li>• Exchanges are subject to stock availability</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="mt-8 bg-accent/5 border-accent/20">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about returns or exchanges? We're here to help!
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a 
                  href="https://www.facebook.com/profile.php?id=61551403173498" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Message us on Facebook
                </a>
                <span className="text-muted-foreground">or</span>
                <a 
                  href="mailto:reveclothing214@gmail.com"
                  className="text-accent hover:underline"
                >
                  reveclothing214@gmail.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Returns;
