import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import VerifyCertificate from "./pages/VerifyCertificate";
import Membership from "./pages/Membership";
import MemberDashboard from "./pages/MemberDashboard";
import StockAnalysis from "./pages/StockAnalysis";
import PaperTrading from "./pages/PaperTrading";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import MarketNews from "./pages/MarketNews";

import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./components/ProtectedRoute";
import PremiumRoute from "./components/Protected/PremiumRoute";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/membership"
          element={<Membership />}
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/verify-certificate"
          element={<VerifyCertificate />}
        />

        {/* =========================
            NORMAL LOGIN ROUTES
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

        {/* =========================
            PREMIUM ROUTES
        ========================= */}

        <Route
          path="/member-dashboard"
          element={
            <PremiumRoute>
              <MemberDashboard />
            </PremiumRoute>
          }
        />

        <Route
          path="/stock-analysis"
          element={
            <PremiumRoute>
              <StockAnalysis />
            </PremiumRoute>
          }
        />

        <Route
          path="/paper-trading"
          element={
            <PremiumRoute>
              <PaperTrading />
            </PremiumRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <PremiumRoute>
              <Portfolio />
            </PremiumRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <PremiumRoute>
              <Watchlist />
            </PremiumRoute>
          }
        />

        <Route
          path="/market-news"
          element={
            <PremiumRoute>
              <MarketNews />
            </PremiumRoute>
          }
        />

        {/* =========================
            404
        ========================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}