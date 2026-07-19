import {
  FaChartPie,
  FaBookOpen,
  FaUsers,
  FaChartLine,
  FaCog,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminSidebar({
  active,
  setActive,
  handleLogout,
}) {
  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-yellow-500/20 p-6 sticky top-0">

      <h1 className="text-3xl font-bold text-yellow-400 mb-10">
        Stock Scorcher
      </h1>

      <p className="text-gray-400 text-sm mb-8">
        Admin Panel
      </p>

      <div className="space-y-2">

        <button
          onClick={() => setActive("dashboard")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
            active === "dashboard"
              ? "bg-yellow-400 text-black font-bold"
              : "hover:bg-zinc-800"
          }`}
        >
          <FaChartPie />
          Dashboard
        </button>

        <button
          onClick={() => setActive("modules")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
            active === "modules"
              ? "bg-yellow-400 text-black font-bold"
              : "hover:bg-zinc-800"
          }`}
        >
          <FaBookOpen />
          Modules
        </button>

        <button
          onClick={() => setActive("students")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
            active === "students"
              ? "bg-yellow-400 text-black font-bold"
              : "hover:bg-zinc-800"
          }`}
        >
          <FaUsers />
          Students
        </button>

        <button
          onClick={() => setActive("analytics")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
            active === "analytics"
              ? "bg-yellow-400 text-black font-bold"
              : "hover:bg-zinc-800"
          }`}
        >
          <FaChartLine />
          Analytics
        </button>

        <button
          onClick={() => setActive("settings")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
            active === "settings"
              ? "bg-yellow-400 text-black font-bold"
              : "hover:bg-zinc-800"
          }`}
        >
          <FaCog />
          Settings
        </button>

        <button
          onClick={() => window.open("/", "_blank")}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-zinc-800 transition"
        >
          <FaGlobe />
          Website
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}