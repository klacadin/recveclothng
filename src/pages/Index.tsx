import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import HeroSection from "@/components/sections/HeroSection";
import TrustBar from "@/components/sections/TrustBar";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CollectionsGrid from "@/components/sections/CollectionsGrid";
import NobodySection from "@/components/sections/NobodySection";
import SocialProof from "@/components/sections/SocialProof";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <FeaturedProducts />
        <CollectionsGrid />
        <NobodySection />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
