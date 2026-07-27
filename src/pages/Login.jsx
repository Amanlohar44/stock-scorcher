import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  signInWithEmailAndPassword, 
  sendEmailVerification 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { 
  Crown, 
  GraduationCap, 
  ArrowRight, 
  X, 
  LockKeyhole, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  // Dashboard choice modal popup
  const [showDashboardChoice, setShowDashboardChoice] = useState(false);

  // --------------------------------
  // LOGIN HANDLER
  // --------------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // --------------------------------
      // EMAIL VERIFICATION CHECK
      // --------------------------------
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        alert(
          "⚠️ Your email is not verified yet.\n\n" +
          "📧 A new verification email has been sent.\n\n" +
          "👉 Please check your Primary, Promotions, Spam or Inbox tabs."
        );
        setLoading(false);
        return;
      }

      // Mark user as logged in for Navbar state synchronization
      localStorage.setItem("stock_scorcher_logged_in", "true");
      localStorage.setItem("stock_scorcher_user_email", user.email);

      // --------------------------------
      // CHECK PURCHASES & MEMBERSHIPS
      // --------------------------------
      setCheckingPurchase(true);

      const [courseSnap, membershipSnap] = await Promise.all([
        getDoc(doc(db, "purchases", user.uid)),
        getDoc(doc(db, "memberships", user.uid)),
      ]);

      const courseData = courseSnap.exists() ? courseSnap.data() : null;
      const hasCourse = courseData?.purchased === true && courseData?.paymentStatus === "paid";

      const membershipData = membershipSnap.exists() ? membershipSnap.data() : null;
      let hasMembership = false;

      if (membershipData?.status === "active") {
        if (membershipData?.expiryDate) {
          const expiryDate = new Date(membershipData.expiryDate);
          const now = new Date();
          hasMembership = expiryDate > now;
        } else {
          hasMembership = true;
        }
      }

      // 1. BOTH COURSE + MEMBERSHIP
      if (hasCourse && hasMembership) {
        setCheckingPurchase(false);
        setLoading(false);
        setShowDashboardChoice(true);
        return;
      }

      // 2. ONLY COURSE
      if (hasCourse && !hasMembership) {
        alert("✅ Login Successful");
        navigate("/dashboard", { replace: true });
        return;
      }

      // 3. ONLY MEMBERSHIP
      if (!hasCourse && hasMembership) {
        alert("👑 Login Successful");
        navigate("/member-dashboard", { replace: true });
        return;
      }

      // 4. NOTHING PURCHASED
      alert(
        "✅ Login Successful\n\n" +
        "You don't have an active course or membership yet."
      );
      navigate("/membership", { replace: true });

    } catch (error) {
      console.error("Login Error:", error);
      
      // Professional Error Handling for Wrong Credentials / Password
      let errorMessage = "Failed to login. Please check your credentials.";
      if (
        error.code === "auth/wrong-password" || 
        error.code === "auth/user-not-found" || 
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email"
      ) {
        errorMessage = "❌ Incorrect email or password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "⚠️ Too many failed attempts. Access temporarily blocked. Please try later.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
      setCheckingPurchase(false);
    }
  };

  // --------------------------------
  // LOADING BUTTON TEXT
  // --------------------------------
  const getLoginButtonText = () => {
    if (loading) {
      if (checkingPurchase) return "Checking Your Access...";
      return "Logging In...";
    }
    return "Login to Terminal";
  };

  return (
    <>
      <Helmet>
        <title>Login to Your Account | Stock Scorcher</title>
        <meta name="description" content="Access your Stock Scorcher trading dashboard, AI signals, and premium course modules securely." />
      </Helmet>

      <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 py-16 selection:bg-yellow-400 selection:text-black overflow-hidden">
        
        {/* Cinematic Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[160px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 bg-[#060606] border border-white/10 p-8 sm:p-10 rounded-[2.5rem] w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20">
              <LockKeyhole size={28} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white">
              Welcome <span className="text-yellow-400">Back</span>
            </h1>

            <p className="text-zinc-400 text-sm mt-2 font-light">
              Secure access to your Stock Scorcher account
            </p>
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="trader@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 placeholder:text-zinc-600"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 placeholder:text-zinc-600"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(250,204,21,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {getLoginButtonText()}
          </button>

          {/* Signup Link */}
          <p className="text-center text-zinc-400 text-sm mt-8 font-light">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-400 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-medium">
            <ShieldCheck size={14} className="text-zinc-400" />
            Secured with 256-Bit Firebase Encryption
          </div>

        </motion.div>
      </div>

      {/* =================================
          DASHBOARD CHOICE MODAL
      ================================= */}
      <AnimatePresence>
        {showDashboardChoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl px-4 py-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-yellow-400/30 bg-[#060606] shadow-[0_0_80px_rgba(250,204,21,0.15)]"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setShowDashboardChoice(false)}
                className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="border-b border-white/10 px-6 py-10 text-center md:px-10">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black shadow-lg shadow-yellow-400/20">
                  <Crown size={30} />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Welcome Back, Trader! 👋
                </h2>

                <p className="mt-2 text-zinc-400 text-sm font-light">
                  You have active access to both your <span className="text-yellow-400 font-semibold">Course</span> and <span className="text-green-400 font-semibold">Membership</span>.
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Select which workspace you would like to open.
                </p>
              </div>

              {/* Dashboard Options */}
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 md:p-8">

                {/* COURSE DASHBOARD */}
                <button
                  onClick={() => {
                    setShowDashboardChoice(false);
                    navigate("/dashboard", { replace: true });
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/[0.08] to-black p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(250,204,21,0.15)] cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black font-bold">
                        <GraduationCap size={24} />
                      </div>
                      <ArrowRight size={20} className="text-yellow-400 transition-transform group-hover:translate-x-1" />
                    </div>

                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      Course Dashboard
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-light">
                      Access your purchased trading course, video lessons, learning modules and resources.
                    </p>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-yellow-400">
                    Open Course Area <ArrowRight size={14} />
                  </div>
                </button>

                {/* MEMBER DASHBOARD */}
                <button
                  onClick={() => {
                    setShowDashboardChoice(false);
                    navigate("/member-dashboard", { replace: true });
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/[0.08] to-black p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:shadow-[0_0_35px_rgba(34,197,94,0.15)] cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white font-bold">
                        <Crown size={24} />
                      </div>
                      <ArrowRight size={20} className="text-green-400 transition-transform group-hover:translate-x-1" />
                    </div>

                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      Member Dashboard
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-light">
                      Access AI stock signals, paper trading terminal, portfolio tracker and VIP tools.
                    </p>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-green-400">
                    Open Member Area <ArrowRight size={14} /> ke sath
                  </div>
                </button>

              </div>

              {/* Footer Note */}
              <div className="border-t border-white/5 px-6 py-4 text-center bg-black/40">
                <p className="text-[11px] text-zinc-500">
                  You can easily switch between workspaces anytime from the main navigation.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}