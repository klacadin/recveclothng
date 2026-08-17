import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import FeedbackButton from "@/components/FeedbackButton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import AffiliateDashboard from "@/views/AffiliateDashboard";
import AffiliateGuide from "@/views/AffiliateGuide";
import AffiliateReferralLanding from "@/components/affiliate/AffiliateReferralLanding";
import { AffiliateTracker } from "@/components/affiliate/AffiliateTracker";
import Index from "./views/Index";
import Shop from "./views/Shop";
import ProductDetail from "./views/ProductDetail";
import About from "./views/About";
import Contact from "./views/Contact";
import AdminLogin from "./views/AdminLogin";
import NobodyCollection from "./views/NobodyCollection";
import Checkout from "./views/Checkout";
import OrderConfirmation from "./views/OrderConfirmation";
import UploadProof from "./views/UploadProof";
import Wishlist from "./views/Wishlist";
import PaymentSuccess from "./views/PaymentSuccess";
import PaymentFailed from "./views/PaymentFailed";
import MyOrders from "./views/MyOrders";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import SizeGuide from "./views/SizeGuide";
import Shipping from "./views/Shipping";
import Terms from "./views/Terms";
import Privacy from "./views/Privacy";
import Returns from "./views/Returns";
import News from "./views/News";
import ArticleDetail from "./views/ArticleDetail";
import Events from "./views/Events";
import EventRegistered from "./views/EventRegistered";
import EventCheckIn from "./views/EventCheckIn";
import NotFound from "./views/NotFound";

// Lazy load heavy admin component
const Admin = lazy(() => import("./views/Admin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/upload-proof" element={<UploadProof />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/size-guide" element={<SizeGuide />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:slug" element={<ArticleDetail />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/registered" element={<EventRegistered />} />
      <Route path="/events/:slug" element={<Events />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/events/check-in"
        element={
          <ProtectedRoute requireAdmin>
            <EventCheckIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingFallback />}>
              <Admin />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route path="/collections/nobody" element={<NobodyCollection />} />
      <Route path="/affiliate/join" element={<AffiliateDashboard />} />
      <Route path="/affiliate/login" element={<AffiliateDashboard />} />
      <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
      <Route path="/affiliate/guide" element={<AffiliateGuide />} />
      <Route path="/affiliate/:code" element={<AffiliateReferralLanding />} />
      <Route path="/affiliate" element={<AffiliateDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AffiliateTracker />
            <CartProvider>
              <WishlistProvider>
                <CartDrawer />
                <FeedbackButton />
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
