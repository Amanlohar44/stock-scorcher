import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Crown, GraduationCap, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DesktopMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDashboardChoice, setShowDashboardChoice] = useState(false);

  useEffect(() => {
    const isLogged = localStorage.getItem("stock_scorcher_logged_in") === "true";
    setIsLoggedIn(isLogged);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("stock_scorcher_logged_in");
    localStorage.removeItem("stock_scorcher_user_email");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    setShowDashboardChoice(true);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold uppercase tracking-wider">
        <Link to="/" className={`transition-colors hover:text-yellow-400 ${isActive("/") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>Home</Link>
        <Link to="/courses" className={`transition-colors hover:text-yellow-400 ${isActive("/courses") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>Courses</Link>
        <Link to="/reviews" className={`transition-colors hover:text-yellow-400 ${isActive("/reviews") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>Reviews ⭐</Link>
        <Link to="/blog" className={`transition-colors hover:text-yellow-400 ${isActive("/blog") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>Blog</Link>
        <Link to="/membership" className={`transition-colors hover:text-yellow-400 ${isActive("/membership") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>VIP Membership</Link>
        <Link to="/verify-certificate" className={`transition-colors hover:text-yellow-400 ${isActive("/verify-certificate") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>Verify Certificate</Link>
        <Link to="/faq" className={`transition-colors hover:text-yellow-400 ${isActive("/faq") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>FAQ</Link>
        <Link to="/about" className={`transition-colors hover:text-yellow-400 ${isActive("/about") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>About Us</Link>
        <Link to="/contact" className={`transition-colors hover:text-yellow-400 ${isActive("/contact") ? "text-yellow-400 font-black" : "text-zinc-300"}`}>Contact</Link>

        {/* Conditional Auth Button / Dashboard */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2.5 ml-2">
            <button
              onClick={handleDashboardClick}
              className="flex items-center gap-1.5 rounded-xl bg-yellow-400 px-4 py-2.5 text-xs font-black text-black transition-all hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.3)] uppercase tracking-wider cursor-pointer"
            >
              <LayoutDashboard size={14} /> Dashboard
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="ml-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-xs font-black text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] uppercase tracking-wider"
          >
            Student Login / VIP
          </Link>
        )}
      </nav>

      {/* ================= WORKSPACE CHOICE MODAL (Desktop) ================= */}
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