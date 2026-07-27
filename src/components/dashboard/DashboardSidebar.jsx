import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBook, FaVideo, FaFilePdf, FaPodcast, FaStickyNote, FaAward, FaUser, FaCrown, FaSignOutAlt, FaTimes } from "react-icons/fa";

export default function DashboardSidebar({ active, setActive, handleLogout, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "courses", label: "My Courses", icon: <FaBook /> },
    { id: "videos", label: "Course Videos", icon: <FaVideo /> },
    { id: "pdf", label: "PDF Notes", icon: <FaFilePdf /> },
    { id: "live", label: "Live Classes", icon: <FaPodcast /> },
    { id: "notes", label: "My Saved Notes", icon: <FaStickyNote /> },
    { id: "certificates", label: "Certificates", icon: <FaAward /> },
    { id: "profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 lg:top-20 z-50 h-screen lg:h-[calc(100vh-5rem)]
        w-72 bg-[#060606] border-r border-yellow-500/20 p-6 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div>
          {/* Header / Close button for mobile */}
          <div className="flex items-center justify-between lg:hidden pb-6 border-b border-white/10 mb-6">
            <span className="text-lg font-black text-yellow-400">Stock Scorcher</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActive(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.25)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}

            {/* VIP Member Dashboard Shortcut */}
            <button
              onClick={() => {
                navigate("/member-dashboard");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-purple-400 hover:bg-purple-500/10 transition-all cursor-pointer border border-purple-500/20 mt-3"
            >
              <span className="text-base"><FaCrown /></span>
              VIP Member Dashboard
            </button>
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div className="pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <span className="text-base"><FaSignOutAlt /></span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}