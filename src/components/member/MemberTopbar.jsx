import { useState, useRef, useEffect } from "react";
import {
  FaUserCircle,
  FaBars,
  FaHome,
  FaTachometerAlt,
  FaGraduationCap,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function MemberTopbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const isDashboard =
    location.pathname === "/member-dashboard" ||
    location.pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-yellow-500/20 bg-black/95 px-4 backdrop-blur-xl md:h-20 md:px-8">

      {/* =========================
          LEFT SECTION
      ========================= */}
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        {/* Mobile Menu Trigger */}
        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="rounded-xl p-2 text-xl text-yellow-400 transition hover:bg-yellow-400/10 md:hidden cursor-pointer"
        >
          <FaBars />
        </button>

        {/* Title */}
        <div className="min-w-0">
          <h2 className="truncate text-base sm:text-lg font-black md:text-2xl text-white">
            Stock Scorcher <span className="text-yellow-400">Portal</span>
          </h2>
          <p className="hidden text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest font-semibold sm:block">
            AI Trading & Masterclass
          </p>
        </div>
      </div>

      {/* =========================
          RIGHT SECTION
      ========================= */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Course Dashboard Quick Button */}
        {!isDashboard && (
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden lg:flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-400/10 px-4 py-2 text-xs font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black cursor-pointer shadow-md"
          >
            <FaGraduationCap className="text-sm" />
            Course Dashboard
          </button>
        )}

        {/* VIP Dashboard Link */}
        {!isDashboard && (
          <button
            onClick={() => navigate("/member-dashboard")}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-yellow-500/20 px-3.5 py-2 text-xs font-bold text-yellow-400 transition hover:bg-yellow-400/10 cursor-pointer"
          >
            <FaTachometerAlt />
            VIP Dashboard
          </button>
        )}

        {/* Back to Website */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-400 md:px-4 cursor-pointer"
        >
          <FaHome />
          <span className="hidden sm:inline">Back to Website</span>
          <span className="sm:hidden">Home</span>
        </button>

        {/* USER PROFILE & DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User Profile Menu"
            className="rounded-full transition hover:scale-105 cursor-pointer flex items-center justify-center bg-yellow-400/10 border border-yellow-400/30 h-10 w-10 text-yellow-400 shadow-lg"
          >
            <FaUserCircle className="text-2xl" />
          </button>

          {/* Dropdown Box */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-yellow-500/30 bg-zinc-950 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200 z-50">
              <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                <p className="text-xs text-zinc-400 font-medium">Signed in as</p>
                <p className="text-xs font-bold text-white truncate mt-0.5">
                  {auth.currentUser?.email || "Trader"}
                </p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/member-dashboard");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition cursor-pointer text-left"
              >
                <FaTachometerAlt className="text-yellow-400 text-sm" />
                VIP Dashboard
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-400 transition cursor-pointer text-left"
              >
                <FaGraduationCap className="text-yellow-400 text-sm" />
                Course Dashboard
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition cursor-pointer text-left"
              >
                <FaSignOutAlt className="text-sm" />
                Logout Account
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}