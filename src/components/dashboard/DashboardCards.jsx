import React from "react";
import { FaBook, FaVideo, FaFileAlt, FaChartLine, FaCrown, FaGraduationCap } from "react-icons/fa";

export default function DashboardCards({ userTier, setActive, setSelectedDay }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* My Courses Card */}
      <div
        onClick={() => {
          setActive("courses");
          setSelectedDay(null);
        }}
        className="group bg-[#060606] p-6 rounded-3xl border border-yellow-500/30 cursor-pointer hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl mb-4">
          <FaBook />
        </div>
        <h3 className="text-xl font-extrabold text-yellow-400">My Courses</h3>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-light leading-relaxed">
          {userTier <= 999 
            ? "Access your purchased PDF cheat sheets & guides." 
            : "View all your purchased masterclass modules and materials."}
        </p>
      </div>

      {/* Course Videos Card */}
      <div
        onClick={() => setActive("videos")}
        className="group bg-[#060606] p-6 rounded-3xl border border-yellow-500/30 cursor-pointer hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl mb-4">
          <FaVideo />
        </div>
        <h3 className="text-xl font-extrabold text-yellow-400 flex items-center justify-between">
          <span>Course Videos</span>
          {userTier < 6999 && <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full font-bold">Locked 🔒</span>}
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-light leading-relaxed">
          {userTier >= 6999 ? "Watch all day-wise recorded video lectures directly." : "Requires Masterclass plan to unlock video lectures."}
        </p>
      </div>

      {/* PDF Notes Card */}
      <div
        onClick={() => setActive("pdf")}
        className="group bg-[#060606] p-6 rounded-3xl border border-yellow-500/30 cursor-pointer hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div className="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 text-xl mb-4">
          <FaFileAlt />
        </div>
        <h3 className="text-xl font-extrabold text-green-400">PDF Notes</h3>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-light leading-relaxed">
          Download day-wise study notes, formulas, and chart patterns directly.
        </p>
      </div>

      {/* Live Classes Card */}
      <div
        onClick={() => setActive("live")}
        className="group bg-[#060606] p-6 rounded-3xl border border-yellow-500/30 cursor-pointer hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl mb-4">
          <FaChartLine />
        </div>
        <h3 className="text-xl font-extrabold text-yellow-400 flex items-center justify-between">
          <span>Live Classes</span>
          {userTier < 9999 && <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full font-bold">Locked 🔒</span>}
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-light leading-relaxed">
          {userTier >= 9999 ? "Join live interactive trading sessions & Q&A." : "Requires ₹9999 Pro Mentorship plan."}
        </p>
      </div>

      {/* Certificates Card */}
      <div
        onClick={() => setActive("certificates")}
        className="group bg-[#060606] p-6 rounded-3xl border border-yellow-500/30 cursor-pointer hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl mb-4">
          <FaGraduationCap />
        </div>
        <h3 className="text-xl font-extrabold text-yellow-400">Certificates</h3>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-light leading-relaxed">
          View and download your professional completion certificate upon 100% progress.
        </p>
      </div>

      {/* VIP Membership Card */}
      <div
        onClick={() => window.location.href = "/member-dashboard"}
        className="group bg-[#060606] p-6 rounded-3xl border border-purple-500/30 cursor-pointer hover:border-purple-400 hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl mb-4">
          <FaCrown />
        </div>
        <h3 className="text-xl font-extrabold text-purple-400">VIP Membership</h3>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-light leading-relaxed">
          Click here to open your exclusive 1-Year VIP Member Dashboard in one click.
        </p>
      </div>

    </div>
  );
}