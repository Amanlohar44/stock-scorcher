import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ProfileDropdown from "./ProfileDropdown";

export default function DashboardTopbar({ user, setSidebarOpen, setActive }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [customPhoto, setCustomPhoto] = useState("");
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);

  // Fetch user profile data (Name & Photo) from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.fullName) setUserName(data.fullName);
          if (data.photoURL) setCustomPhoto(data.photoURL);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [user]);

  const displayName = userName || user?.displayName || user?.email?.split("@")[0] || "Trader";
  const finalAvatar = customPhoto || user?.photoURL;

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-[#060606]/95 backdrop-blur-xl border-b border-yellow-500/20 px-4 sm:px-6 lg:px-8 py-4 shadow-2xl">
      
      {/* Left Section: Mobile Sidebar Toggle & Greeting */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Sidebar"
          className="lg:hidden rounded-xl border border-white/10 bg-white/5 p-2.5 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 cursor-pointer shadow-md active:scale-95"
        >
          <FaBars size={18} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-400 tracking-tight">
            Dashboard
          </h1>

          <p className="hidden sm:block text-zinc-400 mt-0.5 text-xs md:text-sm font-light">
            Welcome back,{" "}
            <span className="text-white font-semibold">
              {displayName}
            </span>{" "}
            👋
          </p>
        </div>

      </div>

      {/* Right Section: Notifications & Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-zinc-300 hover:text-yellow-400 hover:border-yellow-400/40 transition-all duration-300 cursor-pointer shadow-md active:scale-95"
          >
            <FaBell size={17} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
          </button>

          {/* Notification Dropdown Box */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl bg-[#0a0a0a] border border-yellow-500/30 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400">Notifications</h3>
                <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">1 New</span>
              </div>

              <div className="mt-3 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-yellow-400/5 border border-yellow-400/10 text-left">
                  <p className="text-xs font-bold text-white">🎉 Welcome to Stock Scorcher!</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Explore your course modules and start learning today.</p>
                  <span className="text-[9px] text-zinc-500 mt-1 block">Just now</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Component with setActive connection */}
        <ProfileDropdown 
          user={user} 
          photoURL={finalAvatar} 
          displayName={displayName} 
          setActive={setActive} 
        />

      </div>

    </header>
  );
}