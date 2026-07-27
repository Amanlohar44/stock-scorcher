import {
  FaChartLine,
  FaRobot,
  FaWallet,
  FaBookmark,
  FaNewspaper,
  FaFileInvoiceDollar,
  FaTimes,
  FaHome,
  FaGraduationCap,
  FaUser,
  FaCrown,
  FaFilter,
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";

export default function MemberSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Elite Dashboard",
      icon: <FaCrown />,
      path: "/member-dashboard",
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/member-profile",
    },
    {
      name: "Live Market",
      icon: <FaChartLine />,
      path: "/stock-analysis",
    },
    {
      name: "Elite Stock Scanner",
      icon: <FaFilter />,
      path: "/stock-scanner",
    },
    {
      name: "AI Analysis",
      icon: <FaRobot />,
      path: "/stock-analysis#ai-analysis",
    },
    {
      name: "Paper Trading",
      icon: <FaFileInvoiceDollar />,
      path: "/paper-trading",
    },
    {
      name: "Portfolio",
      icon: <FaWallet />,
      path: "/portfolio",
    },
    {
      name: "Watchlist",
      icon: <FaBookmark />,
      path: "/watchlist",
    },
    {
      name: "VIP Masterclass",
      icon: <FaGraduationCap />,
      path: "/courses",
    },
    {
      name: "Market News",
      icon: <FaNewspaper />,
      path: "/market-news",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (setOpen) {
      setOpen(false);
    }
  };

  const isItemActive = (path) => {
    const [pathname, hash] = path.split("#");
    if (location.pathname !== pathname) {
      return false;
    }
    if (hash === "ai-analysis") {
      return location.hash === "#ai-analysis";
    }
    if (pathname === "/stock-analysis") {
      return !location.hash || location.hash !== "#ai-analysis";
    }
    return true;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40
          flex h-screen w-72 flex-col
          border-r border-yellow-500/20
          bg-zinc-950 p-5
          shadow-2xl shadow-black/50
          transition-transform duration-300
          md:sticky md:top-0
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-start justify-between">
          <button
            onClick={() => handleNavigate("/")}
            className="text-left cursor-pointer z-10"
          >
            <h2 className="text-2xl font-black text-yellow-400">
              Stock Scorcher
            </h2>
            <p className="mt-2 text-xs tracking-[0.25em] text-gray-500">
              ELITE MEMBER
            </p>
          </button>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-xl text-gray-400 transition hover:bg-white/5 hover:text-white md:hidden cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Course Dashboard / Quick Link */}
        <button
          onClick={() => handleNavigate("/dashboard")}
          className={`mt-6 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-bold transition cursor-pointer ${
            location.pathname === "/dashboard"
              ? "border-yellow-400 bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
              : "border-yellow-500/30 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          }`}
        >
          <FaGraduationCap className="text-base" />
          <span>Course Dashboard</span>
        </button>

        <nav className="mt-4 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isActive = isItemActive(item.path);
            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.path)}
                className={`
                  group
                  flex w-full items-center gap-4
                  rounded-xl px-4 py-3
                  text-left cursor-pointer
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10 font-bold"
                      : "text-gray-400 hover:bg-yellow-400/10 hover:text-yellow-400"
                  }
                `}
              >
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="font-medium text-xs sm:text-sm">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-400/10 to-transparent p-4">
          <p className="font-bold text-yellow-400 text-xs sm:text-sm">
            Elite Terminal 👑
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-400">
            Full access to institutional trading tools and signals.
          </p>
        </div>

        <button
          onClick={() => handleNavigate("/")}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-gray-300 transition hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-400 cursor-pointer"
        >
          <FaHome />
          Main Website
        </button>
      </aside>
    </>
  );
}