import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBookOpen,
  FaUser,
  FaCertificate,
  FaCog,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";


export default function DashboardSidebar({
  active,
  setActive,
  handleLogout,
  sidebarOpen,
  setSidebarOpen,
}) {

    const navigate = useNavigate();

  return (
    <>
  {/* Mobile Overlay */}
  {sidebarOpen && (
    <div
      className="fixed inset-0 bg-black/60 z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  )}

  <aside
    className={`
      fixed lg:static
      top-0 left-0
      h-screen
      w-72
      bg-zinc-950
      border-r border-yellow-500/20
      p-6
      z-50
      transform transition-transform duration-300
      ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      
      }
    `}
  >

      <h1 className="text-3xl font-bold text-yellow-400 mb-8">
  Stock Scorcher
</h1>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">

        <button
  onClick={() => {
    setActive("dashboard");
    navigate("/dashboard");
    setSidebarOpen(false);
  }}
  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm md:text-base transition ${
    active === "dashboard"
      ? "bg-yellow-400 text-black font-bold"
      : "text-white lg:hover:bg-zinc-800"
  }`}
>
  <FaHome />
  Dashboard
</button>

        <button
  onClick={() => {
  setActive("courses");
  navigate("/courses");
  setSidebarOpen(false);
}}
  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm md:text-base transition ${
    active === "courses"
      ? "bg-yellow-400 text-black font-bold"
      : "text-white lg:hover:bg-zinc-800"
  }`}
>
          
          <FaBookOpen />
          My Courses
        </button>

        <button
          onClick={() => {
  setActive("profile");
  setSidebarOpen(false);
}}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm md:text-base transition ${
            active === "profile"
              ? "bg-yellow-400 text-black font-bold"
              : "text-white lg:hover:bg-zinc-800"
          }`}
        >
          <FaUser />
          Profile
        </button>

        <button
          onClick={() => {
  setActive("certificates");
  setSidebarOpen(false);
}}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm md:text-base transition ${
            active === "certificates"
              ? "bg-yellow-400 text-black font-bold"
              : "text-white lg:hover:bg-zinc-800"
          }`}
        >
          <FaCertificate />
          Certificates
        </button>

        <button
          onClick={() => {
  setActive("settings");
  setSidebarOpen(false);
}}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm md:text-base transition ${
            active === "settings"
              ? "bg-yellow-400 text-black font-bold"
              : "text-white lg:hover:bg-zinc-800"
          }`}
        >
          <FaCog />
          Settings
        </button>

        <button
          onClick={() => {
  navigate("/");
  setSidebarOpen(false);
}}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white lg:hover:bg-zinc-800 transition"
        >
          <FaGlobe />
          Back to Website
        </button>

        <button
          onClick={() => {
  handleLogout();
  setSidebarOpen(false);
}}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 lg:hover:bg-red-500 lg:hover:text-white transition"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>
    </aside>
    </>
  );
}