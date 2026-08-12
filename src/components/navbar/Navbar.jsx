import React, { useEffect, useState } from "react";
import { Menu, Crown, GraduationCap, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDashboardChoice, setShowDashboardChoice] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check login state from localStorage
    const loggedIn = localStorage.getItem("stock_scorcher_logged_in") === "true";
    setIsLoggedIn(loggedIn);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = () => {
    setShowDashboardChoice(true);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-yellow-500/20 bg-[#030303]/90 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <DesktopMenu />

          {/* Mobile Menu Toggle & Dashboard Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {isLoggedIn && (
              <button
                onClick={handleDashboardClick}
                className="bg-yellow-400 text-black px-3.5 py-2.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Dashboard
              </button>
            )}

            <button
              onClick={() => setOpen(true)}
              aria-label="Open Mobile Menu"
              className="rounded-xl border border-yellow-500/20 bg-zinc-950 p-3 text-white transition-all hover:border-yellow-400 hover:text-yellow-400 cursor-pointer shadow-lg active:scale-95"
            >
              <Menu size={22} />
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <MobileMenu open={open} setOpen={setOpen} />

      {/* ================= WORKSPACE CHOICE MODAL ================= */}
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