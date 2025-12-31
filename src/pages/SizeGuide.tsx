import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Info } from "lucide-react";

const SizeGuide = () => {
  const jerseysSizes = [
    { size: "XS", chest: "34-36", length: "26", shoulder: "16" },
    { size: "S", chest: "36-38", length: "27", shoulder: "17" },
    { size: "M", chest: "38-40", length: "28", shoulder: "18" },
    { size: "L", chest: "40-42", length: "29", shoulder: "19" },
    { size: "XL", chest: "42-44", length: "30", shoulder: "20" },
    { size: "2XL", chest: "44-46", length: "31", shoulder: "21" },
    { size: "3XL", chest: "46-48", length: "32", shoulder: "22" },
  ];

  const shortsSizes = [
    { size: "XS", waist: "26-28", length: "14", hip: "34-36" },
    { size: "S", waist: "28-30", length: "15", hip: "36-38" },
    { size: "M", waist: "30-32", length: "16", hip: "38-40" },
    { size: "L", waist: "32-34", length: "17", hip: "40-42" },
    { size: "XL", waist: "34-36", length: "18", hip: "42-44" },
    { size: "2XL", waist: "36-38", length: "19", hip: "44-46" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Size Guide"
        description="Find your perfect fit with REVE Clothing's size guide. Measurements for jerseys, singlets, tees, and shorts. Sizes XS to 3XL available."
        url="/size-guide"
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container">
            <nav className="text-xs text-primary-foreground/60 mb-4">
              <Link to="/" className="hover:text-primary-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-foreground">Size Guide</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Ruler className="h-8 w-8" />
              Size Guide
            </h1>
            <p className="text-primary-foreground/80 mt-2 max-w-xl">
              Find your perfect fit with our comprehensive size charts.
            </p>
          </div>
        </section>

        <div className="container py-12">
          {/* How to Measure */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-accent" />
                How to Measure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground">Chest</p>
                  <p className="text-muted-foreground">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Length</p>
                  <p className="text-muted-foreground">Measure from the highest point of the shoulder to the bottom hem.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Waist</p>
                  <p className="text-muted-foreground">Measure around your natural waistline, keeping the tape comfortable.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Hip</p>
                  <p className="text-muted-foreground">Measure around the fullest part of your hips.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                All measurements are in inches. For the best fit, compare your measurements to the size chart below.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Jerseys, Singlets & Tees */}
            <Card>
              <CardHeader>
                <CardTitle>Jerseys, Singlets & Tees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">Size</th>
                        <th className="text-left py-3 px-2 font-semibold">Chest (in)</th>
                        <th className="text-left py-3 px-2 font-semibold">Length (in)</th>
                        <th className="text-left py-3 px-2 font-semibold">Shoulder (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jerseysSizes.map((row) => (
                        <tr key={row.size} className="border-b border-border/50">
                          <td className="py-3 px-2 font-medium">{row.size}</td>
                          <td className="py-3 px-2 text-muted-foreground">{row.chest}</td>
                          <td className="py-3 px-2 text-muted-foreground">{row.length}</td>
                          <td className="py-3 px-2 text-muted-foreground">{row.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Shorts */}
            <Card>
              <CardHeader>
                <CardTitle>Running Shorts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">Size</th>
                        <th className="text-left py-3 px-2 font-semibold">Waist (in)</th>
                        <th className="text-left py-3 px-2 font-semibold">Length (in)</th>
                        <th className="text-left py-3 px-2 font-semibold">Hip (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortsSizes.map((row) => (
                        <tr key={row.size} className="border-b border-border/50">
                          <td className="py-3 px-2 font-medium">{row.size}</td>
                          <td className="py-3 px-2 text-muted-foreground">{row.waist}</td>
                          <td className="py-3 px-2 text-muted-foreground">{row.length}</td>
                          <td className="py-3 px-2 text-muted-foreground">{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Fit Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Athletic Fit:</strong> Our jerseys and singlets are designed for an athletic fit—close to the body for performance.</li>
                <li>• <strong>Between Sizes?</strong> If you're between sizes, we recommend sizing up for a more relaxed fit or sizing down for compression.</li>
                <li>• <strong>Still Unsure?</strong> Message us on <a href="https://www.facebook.com/profile.php?id=61551403173498" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Facebook</a> with your measurements and we'll help you find the right size.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SizeGuide;
