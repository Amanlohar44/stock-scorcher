import React from "react";

export default function FounderBadge() {
  return (
    <div className="relative z-[9999] mx-auto my-12 flex justify-center px-6 pointer-events-auto">
      <div className="group relative rounded-full border border-yellow-400/40 bg-[#060606] px-8 py-4 backdrop-blur-2xl shadow-[0_0_35px_rgba(250,204,21,0.25)] transition-all duration-300 hover:border-yellow-400 hover:scale-105">
        <span className="flex items-center gap-2 text-sm sm:text-base font-extrabold tracking-wide bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
          <span>👑</span> Founded & Mentored by Aman Lohar
        </span>
      </div>
    </div>
  );
}