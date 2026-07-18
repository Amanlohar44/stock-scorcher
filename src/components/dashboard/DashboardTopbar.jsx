import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

export default function DashboardTopbar({
  user,
  setSidebarOpen,
}) {
  return (
    <div className="flex items-center justify-between bg-zinc-950 border-b border-yellow-500/20 px-4 sm:px-6 lg:px-8 py-4">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-2xl text-yellow-400"
        >
          <FaBars />
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
            Dashboard
          </h1>

          <p className="hidden sm:block text-gray-400 mt-1 text-sm md:text-base">
            Welcome back,
            <span className="text-white font-semibold">
              {" "}
              {user?.displayName || user?.email?.split("@")[0]}
            </span>
            👋
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4 md:gap-6">

        <button className="text-xl md:text-2xl text-gray-300 lg:hover:text-yellow-400 transition duration-300">
          <FaBell />
        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle className="text-4xl md:text-5xl text-yellow-400" />

          <div className="hidden md:block">
            <h2 className="font-semibold">
              {user?.displayName || user?.email?.split("@")[0]}
            </h2>

            <p className="text-sm text-gray-400">
              Premium Member
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}