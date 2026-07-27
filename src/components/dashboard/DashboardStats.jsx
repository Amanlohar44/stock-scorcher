import React from "react";
import { FaBookOpen, FaCheckCircle, FaChartLine, FaCrown } from "react-icons/fa";

export default function DashboardStats({ modulesList = [], completedLessons = [], progress = 0 }) {
  const totalCourses = modulesList.length > 0 ? modulesList.length : 1;
  const completedCount = completedLessons.length;
  const calculatedProgress = progress > 0 ? progress : Math.round((completedCount / totalCourses) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Total Modules */}
      <div className="bg-[#060606] border border-yellow-500/20 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl shrink-0">
          <FaBookOpen />
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-black text-white block">{totalCourses}</span>
          <span className="text-zinc-400 text-[11px] sm:text-xs font-light uppercase tracking-wider">Total Modules</span>
        </div>
      </div>

      {/* Completed Lessons */}
      <div className="bg-[#060606] border border-green-500/20 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 text-xl shrink-0">
          <FaCheckCircle />
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-black text-white block">{completedCount}</span>
          <span className="text-zinc-400 text-[11px] sm:text-xs font-light uppercase tracking-wider">Completed</span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-[#060606] border border-blue-500/20 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl shrink-0">
          <FaChartLine />
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-black text-white block">{calculatedProgress}%</span>
          <span className="text-zinc-400 text-[11px] sm:text-xs font-light uppercase tracking-wider">Overall Progress</span>
        </div>
      </div>

      {/* VIP Access Level */}
      <div className="bg-[#060606] border border-purple-500/20 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl shrink-0">
          <FaCrown />
        </div>
        <div>
          <span className="text-lg sm:text-xl font-black text-purple-400 block truncate">VIP Active</span>
          <span className="text-zinc-400 text-[11px] sm:text-xs font-light uppercase tracking-wider">Access Level</span>
        </div>
      </div>

    </div>
  );
}