import {
  FaUserCircle,
  FaBars,
  FaHome,
  FaTachometerAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function MemberTopbar({
  toggleSidebar,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard =
    location.pathname === "/member-dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-yellow-500/20 bg-black/95 px-4 backdrop-blur-xl md:h-20 md:px-8">

      {/* =========================
          LEFT
      ========================= */}

      <div className="flex min-w-0 items-center gap-3 md:gap-4">

        {/* MOBILE MENU */}

        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="rounded-xl p-2 text-xl text-yellow-400 transition hover:bg-yellow-400/10 md:hidden"
        >
          <FaBars />
        </button>


        {/* TITLE */}

        <div className="min-w-0">

          <h2 className="truncate text-lg font-bold md:text-2xl">
            AI Trading Dashboard
          </h2>

          <p className="hidden text-xs text-gray-500 sm:block">
            Stock Scorcher Premium
          </p>

        </div>

      </div>


      {/* =========================
          RIGHT
      ========================= */}

      <div className="flex items-center gap-2 md:gap-3">


        {/* DASHBOARD */}

        {!isDashboard && (

          <button
            onClick={() =>
              navigate("/member-dashboard")
            }
            className="hidden items-center gap-2 rounded-xl border border-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400/10 sm:flex"
          >

            <FaTachometerAlt />

            Dashboard

          </button>

        )}


        {/* BACK TO WEBSITE */}

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm font-semibold text-gray-300 transition hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-400 md:px-4"
        >

          <FaHome />

          <span className="hidden sm:inline">
            Back to Website
          </span>

          <span className="sm:hidden">
            Home
          </span>

        </button>


        {/* USER ICON */}

        <button
          aria-label="User Profile"
          className="rounded-full transition hover:scale-105"
        >

          <FaUserCircle className="text-3xl text-yellow-400 md:text-4xl" />

        </button>

      </div>

    </header>
  );
}