import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaVideo,
  FaFilePdf,
  FaPodcast,
  FaStickyNote,
  FaAward,
  FaUser,
  FaCrown,
  FaSignOutAlt,
  FaTimes,
  FaChartLine,
  FaStar,
  FaBriefcase,
} from "react-icons/fa";

export default function DashboardSidebar({
  active,
  setActive,
  handleLogout,
  sidebarOpen,
  setSidebarOpen,
}) {
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

  const mobileItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: <FaHome />,
      action: () => setActive("dashboard"),
    },
    {
      id: "markets",
      label: "Markets",
      icon: <FaChartLine />,
      action: () => navigate("/stock-analysis"),
    },
    {
      id: "watchlist",
      label: "Watchlist",
      icon: <FaStar />,
      action: () => navigate("/watchlist"),
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: <FaBriefcase />,
      action: () => navigate("/portfolio"),
    },
    {
      id: "profile",
      label: "Profile",
      icon: <FaUser />,
      action: () => setActive("profile"),
    },
  ];

  return (
    <>
      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
        <div className="mx-3 mb-3 rounded-3xl border border-white/10 bg-[#090909]/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.45)]">
          <div className="grid grid-cols-5 px-2 py-2">
            {mobileItems.map((item) => {
              const activeItem = active === item.id;

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="relative flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all"
                >
                  <span
                    className={`text-lg transition-all ${
                      activeItem
                        ? "text-yellow-400 scale-110"
                        : "text-zinc-500"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span
                    className={`text-[9px] font-bold ${
                      activeItem ? "text-yellow-400" : "text-zinc-500"
                    }`}
                  >
                    {item.label}
                  </span>

                  {activeItem && (
                    <span className="absolute bottom-0 h-1 w-1 rounded-full bg-yellow-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= DESKTOP / DRAWER SIDEBAR ================= */}
      <aside
        className={`
          fixed lg:sticky
          top-0 lg:top-20
          z-50
          h-screen lg:h-[calc(100vh-5rem)]
          w-72
          bg-[#060606]
          border-r border-yellow-500/20
          p-6
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          {/* Mobile drawer header */}
          <div className="flex items-center justify-between lg:hidden pb-6 border-b border-white/10 mb-6">
            <div>
              <div className="text-lg font-black text-yellow-400">
                StockScorcher
              </div>
              <div className="text-[10px] text-zinc-500">
                Trading Dashboard
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Desktop navigation */}
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
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3.5
                    px-4
                    py-3
                    rounded-2xl
                    text-xs
                    font-bold
                    transition-all
                    cursor-pointer
                    ${
                      isActive
                        ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.25)]"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}

            {/* VIP */}
            <button
              onClick={() => {
                navigate("/member-dashboard");
                setSidebarOpen(false);
              }}
              className="
                w-full
                flex
                items-center
                gap-3.5
                px-4
                py-3
                rounded-2xl
                text-xs
                font-bold
                text-purple-400
                hover:bg-purple-500/10
                transition-all
                cursor-pointer
                border
                border-purple-500/20
                mt-3
              "
            >
              <span className="text-base">
                <FaCrown />
              </span>
              VIP Member Dashboard
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3.5
              px-4
              py-3
              rounded-2xl
              text-xs
              font-bold
              text-red-400
              hover:bg-red-500/10
              transition-all
              cursor-pointer
            "
          >
            <span className="text-base">
              <FaSignOutAlt />
            </span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}