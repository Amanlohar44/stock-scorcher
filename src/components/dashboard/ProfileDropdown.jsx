import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaCrown, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function ProfileDropdown({ user, photoURL, displayName, setActive }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const finalAvatar = photoURL || user?.photoURL;
  const name = displayName || user?.displayName || user?.email?.split("@")[0] || "Trader";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-3 border-l border-white/10 cursor-pointer focus:outline-none group"
      >
        {finalAvatar ? (
          <img
            src={finalAvatar}
            alt={name}
            className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border border-yellow-400/40 shadow-md group-hover:border-yellow-400 transition-all shrink-0"
          />
        ) : (
          <FaUserCircle className="text-3xl md:text-4xl text-yellow-400 shrink-0 group-hover:scale-105 transition-all" />
        )}

        <div className="hidden md:block text-left">
          <h2 className="font-bold text-sm text-white truncate max-w-[140px]">
            {name}
          </h2>
          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20 text-[10px] text-yellow-400 font-bold tracking-wider uppercase">
            Pro Trader
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#0a0a0a] border border-yellow-500/30 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-white/10 mb-2">
            <p className="text-xs font-bold text-white truncate">{name}</p>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">{user?.email}</p>
          </div>

          <div className="space-y-1 text-xs">
            <button
              onClick={() => {
                setIsOpen(false);
                if (setActive) setActive("profile"); // Switch view to profile inside dashboard
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <FaUser className="text-yellow-400" /> My Profile
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/member-dashboard");
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-purple-400 hover:text-white hover:bg-purple-500/10 flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <FaCrown /> VIP Member Dashboard
            </button>

            <div className="my-1 h-px bg-white/10"></div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-all font-bold cursor-pointer"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}