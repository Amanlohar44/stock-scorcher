import { FaChartLine, FaRobot, FaWallet, FaBookmark, FaNewspaper } from "react-icons/fa";

export default function MemberSidebar() {
  return (
    <div className="w-72 min-h-screen bg-zinc-950 border-r border-yellow-500/20 p-6">

      <h2 className="text-3xl font-bold text-yellow-400">
        Stock Scorcher
      </h2>

      <p className="text-gray-400 mt-2">
        PRO MEMBER
      </p>

      <div className="mt-10 space-y-5">

        <button className="flex items-center gap-3 hover:text-yellow-400">
          <FaChartLine />
          Live Market
        </button>

        <button className="flex items-center gap-3 hover:text-yellow-400">
          <FaRobot />
          AI Analysis
        </button>

        <button className="flex items-center gap-3 hover:text-yellow-400">
          📄 Paper Trading
        </button>

        <button className="flex items-center gap-3 hover:text-yellow-400">
          <FaWallet />
          Portfolio
        </button>

        <button className="flex items-center gap-3 hover:text-yellow-400">
          <FaBookmark />
          Watchlist
        </button>

        <button className="flex items-center gap-3 hover:text-yellow-400">
          <FaNewspaper />
          Market News
        </button>

      </div>

    </div>
  );
}