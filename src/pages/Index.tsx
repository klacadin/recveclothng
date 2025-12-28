import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsSection";
import StorySection from "@/components/sections/StorySection";
import TrustSection from "@/components/sections/TrustSection";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <ProductsSection />
        <StorySection />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
