import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

export default function AdminTopbar({
  user,
  handleLogout,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-yellow-500/20 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Mobile Sidebar"
          className="lg:hidden rounded-xl border border-yellow-500/20 bg-zinc-900 p-2.5 text-xl text-yellow-400 hover:bg-zinc-800 transition-all cursor-pointer"
        >
          <FaBars />
        </button>

        <div>
          <h1 className="text-lg md:text-2xl font-black text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            👑 Admin Command Center
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5 font-light">
            Welcome back,{" "}
            <span className="text-white font-bold">
              {user?.displayName || user?.email?.split("@")[0]}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button 
          aria-label="Notifications"
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-zinc-900 text-zinc-300 hover:text-yellow-400 hover:border-yellow-400/30 transition-all cursor-pointer shadow-md"
        >
          <FaBell size={16} />
        </button>

        <div className="hidden lg:flex items-center gap-3 border-l border-white/10 pl-4">
          <FaUserCircle className="text-3xl text-yellow-400" />
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-white">
              {user?.displayName || user?.email?.split("@")[0]}
            </h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
              Administrator
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-black text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer uppercase tracking-wider shadow-lg active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  );
}