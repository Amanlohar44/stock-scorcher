import { BrowserRouter, Routes, Route } from "react-router-dom";
import StockAnalysis from "./pages/StockAnalysis";
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
import ScrollToHash from "./components/ScrollToHash";


export default function App() {
  return (

    <BrowserRouter>

  <ScrollToHash />

  <Routes>
        <Route
  path="/verify-certificate"
  element={<VerifyCertificate />}
/>

<Route
  path="/stock-analysis"
  element={<StockAnalysis />}
/>

<Route
  path="/membership"
  element={<Membership />}
/>

<Route
  path="/member-dashboard"
  element={
    <ProtectedRoute>
      <MemberDashboard />
    </ProtectedRoute>
  }
/>


        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Protected Routes */}
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

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}