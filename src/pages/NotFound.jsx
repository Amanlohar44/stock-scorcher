import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaCompass } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-yellow-400 selection:text-black">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-950 border border-yellow-500/20 p-8 sm:p-10 rounded-3xl shadow-2xl text-center space-y-6 relative z-10">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-2xl shadow-lg">
          <FaExclamationTriangle />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-black text-yellow-400 tracking-tight">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Terminal Route Not Found
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            The institutional node or workspace you are trying to access does not exist, has been restricted, or was relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/member-dashboard"
            className="flex-1 bg-yellow-400 text-black py-3.5 px-6 rounded-2xl font-black text-xs hover:bg-yellow-300 transition shadow-lg flex items-center justify-center gap-2"
          >
            <FaHome /> Elite Dashboard
          </Link>
          <Link
            to="/"
            className="flex-1 bg-zinc-900 border border-white/10 text-white py-3.5 px-6 rounded-2xl font-bold text-xs hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <FaCompass /> Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}