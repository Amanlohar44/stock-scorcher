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
}) {

    const navigate = useNavigate();

  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-yellow-500/20 p-6">

      <h1 className="text-3xl font-bold text-yellow-400 mb-10">
        Stock Scorcher
      </h1>

      <div className="space-y-2">

        <button
  onClick={() => {
    setActive("dashboard");
    navigate("/dashboard");
  }}
  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
    active === "dashboard"
      ? "bg-yellow-400 text-black font-bold"
      : "text-white hover:bg-zinc-800"
  }`}
>
  <FaHome />
  Dashboard
</button>

        <button
  onClick={() => {
    setActive("courses");
    navigate("/courses");
  }}
  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
    active === "courses"
      ? "bg-yellow-400 text-black font-bold"
      : "text-white hover:bg-zinc-800"
  }`}
>
          
          <FaBookOpen />
          My Courses
        </button>

        <button
          onClick={() => {
    setActive("profile");
}}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
            active === "profile"
              ? "bg-yellow-400 text-black font-bold"
              : "text-white hover:bg-zinc-800"
          }`}
        >
          <FaUser />
          Profile
        </button>

        <button
          onClick={() => setActive("certificates")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
            active === "certificates"
              ? "bg-yellow-400 text-black font-bold"
              : "text-white hover:bg-zinc-800"
          }`}
        >
          <FaCertificate />
          Certificates
        </button>

        <button
          onClick={() => setActive("settings")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
            active === "settings"
              ? "bg-yellow-400 text-black font-bold"
              : "text-white hover:bg-zinc-800"
          }`}
        >
          <FaCog />
          Settings
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-white hover:bg-zinc-800 transition"
        >
          <FaGlobe />
          Back to Website
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