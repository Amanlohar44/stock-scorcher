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
import ProtectedRoute from "./components/ProtectedRoute";
import Membership from "./pages/Membership";
import MemberDashboard from "./pages/MemberDashboard";
import StockAnalysis from "./pages/StockAnalysis";
import PaperTrading from "./pages/PaperTrading";
import ScrollToHash from "./components/ScrollToHash";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
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

        <Route
  path="/portfolio"
  element={
    <ProtectedRoute>
      <Portfolio />
    </ProtectedRoute>
  }
/>

<Route
  path="/watchlist"
  element={
    <ProtectedRoute>
      <Watchlist />
    </ProtectedRoute>
  }
/>



        {/* =========================
            MEMBER PROTECTED ROUTES
        ========================= */}

        {/* Member Dashboard */}

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


        {/* =========================
            NORMAL PROTECTED ROUTES
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
            404 PAGE
        ========================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}