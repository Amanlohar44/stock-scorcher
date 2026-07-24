import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

export default function AdminTopbar({
  user,
  handleLogout,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <div className="sticky top-0 z-30 bg-zinc-950 border-b border-yellow-500/20 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-2xl text-yellow-400"
        >
          <FaBars />
        </button>

        <div>
          <h1 className="text-xl md:text-3xl font-bold text-yellow-400">
            👑 Admin Dashboard
          </h1>

          <p className="text-gray-400 text-sm">
            Welcome{" "}
            <span className="text-white font-semibold">
              {user?.displayName || user?.email?.split("@")[0]}
            </span>
          </p>
        </div>

      </div>

      <div className="flex items-center gap-4">

        <button className="hidden md:block text-xl text-gray-300 hover:text-yellow-400">
          <FaBell />
        </button>

        <div className="hidden lg:flex items-center gap-3">
          <FaUserCircle className="text-4xl text-yellow-400" />
          <div>
            <h2 className="font-semibold">
              {user?.displayName || user?.email?.split("@")[0]}
            </h2>
            <p className="text-sm text-gray-400">
              Administrator
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-bold"
        >
          Logout
        </button>

      </div>
    </div>
  );
}