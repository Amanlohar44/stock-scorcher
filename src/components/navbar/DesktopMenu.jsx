import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function DesktopMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status whenever route changes
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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold uppercase tracking-wider">
      <Link
        to="/"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        Home
      </Link>

      <Link
        to="/courses"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/courses") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        Courses
      </Link>

      <Link
        to="/reviews"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/reviews") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        Reviews ⭐
      </Link>

      <Link
        to="/blog"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/blog") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        Blog
      </Link>

      <Link
        to="/membership"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/membership") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        VIP Membership
      </Link>

      <Link
        to="/verify-certificate"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/verify-certificate") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        Verify Certificate
      </Link>

      <Link
        to="/faq"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/faq") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        FAQ
      </Link>

      <Link
        to="/about"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/about") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        About Us
      </Link>

      <Link
        to="/contact"
        className={`transition-colors hover:text-yellow-400 ${
          isActive("/contact") ? "text-yellow-400 font-black" : "text-zinc-300"
        }`}
      >
        Contact
      </Link>

      {/* Conditional Auth Button / Dashboard */}
      {isLoggedIn ? (
        <div className="flex items-center gap-2.5 ml-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-xl bg-yellow-400 px-4 py-2.5 text-xs font-black text-black transition-all hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.3)] uppercase tracking-wider"
          >
            <LayoutDashboard size={14} /> Dashboard
          </Link>
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
  );
}