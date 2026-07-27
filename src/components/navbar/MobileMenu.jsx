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
  HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isLogged = localStorage.getItem("stock_scorcher_logged_in") === "true";
    setIsLoggedIn(isLogged);
  }, [location, open]);

  const handleLogout = () => {
    localStorage.removeItem("stock_scorcher_logged_in");
    localStorage.removeItem("stock_scorcher_user_email");
    setIsLoggedIn(false);
    setOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  return (
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
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <Home size={18} className="text-yellow-400" /> Home
                </Link>

                <Link
                  to="/courses"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <BookOpen size={18} className="text-yellow-400" /> Courses & Modules
                </Link>

                <Link
                  to="/reviews"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <MessageSquareQuote size={18} className="text-yellow-400" /> Student Reviews ⭐
                </Link>

                <Link
                  to="/blog"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <FileText size={18} className="text-yellow-400" /> Trading Blog
                </Link>

                <Link
                  to="/membership"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <Award size={18} className="text-yellow-400" /> VIP Membership
                </Link>

                <Link
                  to="/verify-certificate"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <Award size={18} className="text-yellow-400" /> Verify Certificate
                </Link>

                <Link
                  to="/faq"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <HelpCircle size={18} className="text-yellow-400" /> FAQ / Help
                </Link>

                <Link
                  to="/about"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <Info size={18} className="text-yellow-400" /> About Us
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl p-3 text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition-all"
                >
                  <PhoneCall size={18} className="text-yellow-400" /> Contact Us
                </Link>
              </div>
            </div>

            {/* Bottom Login/Dashboard CTA */}
            <div className="pt-5 border-t border-white/10 space-y-3 mt-8">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-yellow-400 py-4 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:bg-yellow-300 transition-all"
                  >
                    <LayoutDashboard size={16} /> Go to Dashboard
                  </Link>
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
  );
}