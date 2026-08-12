import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  X, 
  Home, 
  BookOpen, 
  MessageSquareQuote, 
  FileText, 
  Award, 
  Info, 
  PhoneCall, 
  LogIn, 
  LayoutDashboard, 
  LogOut,
  HelpCircle,
  Crown,
  GraduationCap,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDashboardChoice, setShowDashboardChoice] = useState(false);

  // Listen for auth changes dispatched from Auth.jsx
  useEffect(() => {
    const checkAuth = () => {
      const isLogged = localStorage.getItem("stock_scorcher_logged_in") === "true";
      setIsLoggedIn(isLogged);
    };

    // Initial check
    checkAuth();

    // Add event listener for custom authChange event
    window.addEventListener("authChange", checkAuth);

    // Cleanup
    return () => window.removeEventListener("authChange", checkAuth);
  }, [location, open]);

  const handleLogout = () => {
    localStorage.removeItem("stock_scorcher_logged_in");
    localStorage.removeItem("stock_scorcher_user_email");
    // Dispatch event so Navbar and DesktopMenu update instantly
    window.dispatchEvent(new Event("authChange"));
    setIsLoggedIn(false);
    setOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  const handleDashboardClick = (e) => {
    e.preventDefault();
    setOpen(false);
    // Since desktop/navbar already check course/membership,
    // Mobile can directly open the choice modal, or you can add the complex check here too.
    // For simplicity and reliability, opening the choice modal is best:
    setShowDashboardChoice(true);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-zinc-950 border-l border-yellow-500/20 p-6 flex flex-col justify-between lg:hidden shadow-2xl overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-black tracking-widest bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase">
                    STOCK SCORCHER
                  </span>
                  <button
                    onClick={closeMenu}
                    aria-label="Close Mobile Menu"
                    className="rounded-xl border border-yellow-500/20 bg-zinc-900 p-2.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links List */}
                <div className="mt-5 flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider">
                  <Link to="/" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <Home size={18} className="text-yellow-400" /> Home
                  </Link>
                  <Link to="/courses" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <BookOpen size={18} className="text-yellow-400" /> Courses & Modules
                  </Link>
                  <Link to="/reviews" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <MessageSquareQuote size={18} className="text-yellow-400" /> Student Reviews ⭐
                  </Link>
                  <Link to="/blog" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <FileText size={18} className="text-yellow-400" /> Trading Blog
                  </Link>
                  <Link to="/membership" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <Award size={18} className="text-yellow-400" /> VIP Membership
                  </Link>
                  <Link to="/verify-certificate" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <Award size={18} className="text-yellow-400" /> Verify Certificate
                  </Link>
                  <Link to="/faq" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <HelpCircle size={18} className="text-yellow-400" /> FAQ / Help
                  </Link>
                  <Link to="/about" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <Info size={18} className="text-yellow-400" /> About Us
                  </Link>
                  <Link to="/contact" onClick={closeMenu} className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                    <PhoneCall size={18} className="text-yellow-400" /> Contact Us
                  </Link>
                </div>
              </div>

              {/* Bottom Login/Dashboard CTA */}
              <div className="pt-5 border-t border-white/10 space-y-3 mt-8">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={handleDashboardClick}
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-yellow-400 py-4 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:bg-yellow-300 transition-all cursor-pointer"
                    >
                      <LayoutDashboard size={16} /> Go to Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3.5 text-red-400 font-bold text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-yellow-400 py-4 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:bg-yellow-300 transition-all"
                  >
                    <LogIn size={16} /> Student Login / VIP
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= DASHBOARD CHOICE MODAL (Mobile Triggered) ================= */}
      <AnimatePresence>
        {showDashboardChoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-2xl px-4 py-6 font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[3.5rem] border border-yellow-500/30 bg-gradient-to-b from-[#0e0e0e] to-[#030303] shadow-[0_0_120px_rgba(250,204,21,0.2)]"
            >
              <button
                onClick={() => setShowDashboardChoice(false)}
                className="absolute right-6 top-6 z-25 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="border-b border-white/10 px-6 py-10 text-center md:px-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black shadow-lg shadow-yellow-400/30">
                  <Crown size={30} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Select Workspace 🚀</h2>
                <p className="mt-2 text-zinc-400 text-sm font-medium">
                  Choose your destination dashboard below.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 md:p-8">
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDashboardChoice(false);
                    navigate("/dashboard", { replace: true });
                  }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-yellow-500/30 bg-gradient-to-br from-yellow-400/[0.08] to-black p-6 text-left cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black font-bold shadow-lg">
                        <GraduationCap size={24} />
                      </div>
                      <ArrowRight size={20} className="text-yellow-400 transition-transform group-hover:translate-x-1.5" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">Course Dashboard</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
                      Access your purchased trading course and learning modules.
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    Open Course Area <ArrowRight size={14} />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDashboardChoice(false);
                    navigate("/member-dashboard", { replace: true });
                  }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-green-500/30 bg-gradient-to-br from-green-500/[0.08] to-black p-6 text-left cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white font-bold shadow-lg">
                        <Crown size={24} />
                      </div>
                      <ArrowRight size={20} className="text-green-400 transition-transform group-hover:translate-x-1.5" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">Member Dashboard</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
                      Access AI stock signals and VIP intelligence tools.
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider">
                    Open Member Area <ArrowRight size={14} />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}