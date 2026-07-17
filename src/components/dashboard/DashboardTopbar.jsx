import { FaBell, FaUserCircle } from "react-icons/fa";

export default function DashboardTopbar({ user }) {
  return (
    <div className="flex justify-between items-center bg-zinc-950 border-b border-yellow-500/20 px-8 py-5">

      <div>
        <h1 className="text-3xl font-bold text-yellow-400">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-1">
          Welcome back,
          <span className="text-white font-semibold">
            {" "}
            {user?.displayName || user?.email?.split("@")[0]}
          </span>
          👋
        </p>
      </div>

      <div className="flex items-center gap-6">

        <button className="text-2xl text-gray-300 hover:text-yellow-400 duration-300">
          <FaBell />
        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle className="text-5xl text-yellow-400" />

          <div>
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