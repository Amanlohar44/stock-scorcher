import { FaBell, FaUserCircle } from "react-icons/fa";

export default function AdminTopbar({ user, handleLogout }) {
  return (
    <div className="sticky top-0 z-30 bg-zinc-950 border-b border-yellow-500/20 px-6 lg:px-8 py-5 flex items-center justify-between">

      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-yellow-400">
          👑 Admin Dashboard
        </h1>

        <p className="text-gray-400 mt-1 text-sm md:text-base">
          Welcome,
          <span className="text-white font-semibold">
            {" "}
            {user?.displayName || user?.email?.split("@")[0]}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button className="hidden md:block text-2xl text-gray-300 hover:text-yellow-400 transition">
          <FaBell />
        </button>

        <div className="hidden md:flex items-center gap-3">
          <FaUserCircle className="text-5xl text-yellow-400" />

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
          className="bg-red-500 hover:bg-red-600 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold"
        >
          Logout
        </button>

      </div>

    </div>
  );
}