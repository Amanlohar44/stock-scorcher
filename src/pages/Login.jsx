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
  Loader2,
  Terminal,
  Activity,
  Zap
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

  const getLoginButtonText = () => {
    if (loading) {
      if (checkingPurchase) return "Verifying Access Rights...";
      return "Initializing Terminal...";
    }
    return "Launch Terminal Session";
  };

  return (
    <>
      <Helmet>
        <title>Secure Terminal Login | Stock Scorcher</title>
        <meta name="description" content="Access your Stock Scorcher trading dashboard, AI signals, and premium course modules securely." />
      </Helmet>

      {/* Cinematic Dark Terminal Background with Animated Glowing Orbs */}
      <div className="relative min-h-screen bg-[#000000] text-white flex items-center justify-center px-4 py-20 selection:bg-yellow-400 selection:text-black overflow-hidden font-sans">
        
        {/* Animated Background Glowing Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-yellow-500/15 rounded-full blur-[200px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[200px] pointer-events-none" 
        />
        
        {/* Subtle Tech Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        {/* Main Floating Animated Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 bg-gradient-to-b from-[#0e0e0e] to-[#030303] border border-white/10 p-8 sm:p-12 rounded-[3.5rem] w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.95)] backdrop-blur-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          
          {/* Terminal Header Bar */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-black font-black shadow-[0_0_25px_rgba(250,204,21,0.4)]"
              >
                <Terminal size={22} />
              </motion.div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 flex items-center gap-1">
                  <Zap size={10} className="fill-yellow-500" /> Secure Gateway
                </span>
                <h3 className="text-xs font-bold text-zinc-300">SCORCHER-CORE v2.8</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Node Active
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Terminal <span className="bg-gradient-to-b from-yellow-300 to-yellow-600 bg-clip-text text-transparent">Login</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-2 font-medium">
              Authenticate to unlock high-frequency AI intelligence & tools
            </p>
          </motion.div>

          {/* Email Input */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <label className="block text-xs font-black text-zinc-300 uppercase tracking-widest mb-2.5">
              Trader Email ID
            </label>
            <input
              type="email"
              placeholder="trader@stockscorcher.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-black/80 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all disabled:opacity-50 placeholder:text-zinc-600 shadow-inner font-medium"
            />
          </motion.div>

          {/* Password Input */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-2.5">
              <label className="block text-xs font-black text-zinc-300 uppercase tracking-widest">
                Access Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors cursor-pointer font-bold tracking-wide"
              >
                Reset Password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              className="w-full bg-black/80 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all disabled:opacity-50 placeholder:text-zinc-600 shadow-inner font-medium"
            />
          </motion.div>

          {/* Login Button with Pulse Glow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black py-4.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_35px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {getLoginButtonText()}
            </button>
          </motion.div>

          {/* Signup Link */}
          <p className="text-center text-zinc-400 text-sm mt-8 font-medium">
            New to the ecosystem?{" "}
            <Link
              to="/signup"
              className="text-yellow-400 font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-semibold tracking-wider">
            <ShieldCheck size={14} className="text-yellow-500" />
            Secured via 256-Bit Military Grade Encryption
          </div>

        </motion.div>
      </div>

      {/* =================================
          DASHBOARD CHOICE MODAL
      ================================= */}
      <AnimatePresence>
        {showDashboardChoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-2xl px-4 py-6 font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[3.5rem] border border-yellow-500/30 bg-gradient-to-b from-[#0e0e0e] to-[#030303] shadow-[0_0_120px_rgba(250,204,21,0.2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
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
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black shadow-lg shadow-yellow-400/30">
                  <Crown size={30} />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Select Workspace 🚀
                </h2>

                <p className="mt-2 text-zinc-400 text-sm font-medium">
                  You have active access to both <span className="text-yellow-400 font-bold">Course Modules</span> & <span className="text-green-400 font-bold">VIP Membership</span>.
                </p>
              </div>

              {/* Dashboard Options */}
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 md:p-8">

                {/* COURSE DASHBOARD */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDashboardChoice(false);
                    navigate("/dashboard", { replace: true });
                  }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-yellow-500/30 bg-gradient-to-br from-yellow-400/[0.08] to-black p-6 text-left transition-all duration-300 hover:border-yellow-400 hover:shadow-[0_0_45px_rgba(250,204,21,0.2)] cursor-pointer flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black font-bold shadow-lg">
                        <GraduationCap size={24} />
                      </div>
                      <ArrowRight size={20} className="text-yellow-400 transition-transform group-hover:translate-x-1.5" />
                    </div>

                    <h3 className="text-xl font-black text-white tracking-tight">
                      Course Dashboard
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
                      Access your purchased trading course, video modules, and learning materials.
                    </p>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    Open Course Area <ArrowRight size={14} />
                  </div>
                </motion.button>

                {/* MEMBER DASHBOARD */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDashboardChoice(false);
                    navigate("/member-dashboard", { replace: true });
                  }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-green-500/30 bg-gradient-to-br from-green-500/[0.08] to-black p-6 text-left transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_45px_rgba(34,197,94,0.2)] cursor-pointer flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white font-bold shadow-lg">
                        <Crown size={24} />
                      </div>
                      <ArrowRight size={20} className="text-green-400 transition-transform group-hover:translate-x-1.5" />
                    </div>

                    <h3 className="text-xl font-black text-white tracking-tight">
                      Member Dashboard
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
                      Access AI stock signals, paper trading terminal, and VIP intelligence tools.
                    </p>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider">
                    Open Member Area <ArrowRight size={14} />
                  </div>
                </motion.button>

              </div>

              {/* Footer Note */}
              <div className="border-t border-white/5 px-6 py-5 text-center bg-black/60">
                <p className="text-[11px] text-zinc-400 font-medium">
                  You can seamlessly toggle between workspaces at any time from your account panel.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}