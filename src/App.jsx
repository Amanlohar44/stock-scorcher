import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import About from "./pages/About";
import Home from "./pages/Home";
import Auth from "./pages/Auth"; // <--- Combined Auth Component (Login, Register, Forgot Password)
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Admin from "./pages/Admin";
import AiMarketingCenter from "./pages/AiMarketingCenter"; 
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import VerifyCertificate from "./pages/VerifyCertificate";
import Membership from "./pages/Membership";
import MemberDashboard from "./pages/MemberDashboard";
import MemberProfile from "./pages/MemberProfile";
import StockAnalysis from "./pages/StockAnalysis";
import PaperTrading from "./pages/PaperTrading";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import MarketNews from "./pages/MarketNews";
import StockScanner from "./pages/StockScanner";
import Community from "./pages/Community";
import ResearchVault from "./pages/ResearchVault";
import Blog from './pages/Blog';
import Contact from "./components/Contact"; 
import Layout from "./components/Layout";
import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./components/ProtectedRoute";
import PremiumRoute from "./components/Protected/PremiumRoute";
import AiAssistant from "./pages/AiAssistant";
import Faq from "./components/Faq";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Reviews from "./pages/Reviews";

// Partner Network Imports
import PartnerDashboard from "./pages/partners/PartnerDashboard";
import PartnerApply from "./pages/partners/PartnerApply";
import PartnerLeaderboard from "./pages/partners/Leaderboard";
import VerifiedProfile from "./pages/partners/Profile";

// ==========================================
// REFERRAL TRACKING LOGIC
// ==========================================
function ReferralTracker() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode) {
      const expiryTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      const referralData = { code: refCode, expiry: expiryTime };
      localStorage.setItem('stock_scorcher_partner', JSON.stringify(referralData));
      console.log("✅ Partner Referral Tracked:", refCode);
    }
  }, [searchParams]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <ReferralTracker />

      <Layout>
        <Routes>
          {/* =========================
              PUBLIC ROUTES
          ========================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<Auth />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />

          {/* =========================
              PARTNER PUBLIC ROUTES
          ========================= */}
          <Route path="/partner/apply" element={<PartnerApply />} />
          <Route path="/partner/leaderboard" element={<PartnerLeaderboard />} />
          <Route path="/partner/:partnerId" element={<VerifiedProfile />} />

          {/* =========================
              PROTECTED ROUTES
          ========================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ai-marketing"
            element={
              <ProtectedRoute>
                <AiMarketingCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/dashboard"
            element={
              <ProtectedRoute>
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* =========================
              PREMIUM ELITE ROUTES
          ========================= */}
          <Route path="/member-dashboard" element={<PremiumRoute><MemberDashboard /></PremiumRoute>} />
          <Route path="/member-profile" element={<PremiumRoute><MemberProfile /></PremiumRoute>} />
          <Route path="/stock-analysis" element={<PremiumRoute><StockAnalysis /></PremiumRoute>} />
          <Route path="/paper-trading" element={<PremiumRoute><PaperTrading /></PremiumRoute>} />
          <Route path="/portfolio" element={<PremiumRoute><Portfolio /></PremiumRoute>} />
          <Route path="/watchlist" element={<PremiumRoute><Watchlist /></PremiumRoute>} />
          <Route path="/market-news" element={<PremiumRoute><MarketNews /></PremiumRoute>} />
          <Route path="/stock-scanner" element={<PremiumRoute><StockScanner /></PremiumRoute>} />
          <Route path="/community" element={<PremiumRoute><Community /></PremiumRoute>} />
          <Route path="/research-vault" element={<PremiumRoute><ResearchVault /></PremiumRoute>} />
          <Route path="/ai-assistant" element={<PremiumRoute><AiAssistant /></PremiumRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}