import { useEffect, useState } from "react";
import {
  FaCrown,
  FaChartLine,
  FaRobot,
  FaWallet,
  FaFilter,
  FaArrowRight,
  FaBolt,
  FaExclamationTriangle,
  FaCheck,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";
import MemberStatCard from "../components/member/MemberStatCard";

export default function EliteDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(1000000);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      try {
        // 1. Fetch Membership Details
        const membershipRef = doc(db, "memberships", currentUser.uid);
        const memberSnap = await getDoc(membershipRef);
        if (memberSnap.exists()) {
          setMembership(memberSnap.data());
        }

        // 2. Fetch Watchlist Count
        const watchlistRef = collection(db, "users", currentUser.uid, "watchlist");
        const watchlistSnap = await getDocs(watchlistRef);
        setWatchlistCount(watchlistSnap.size);

        // 3. Fetch Paper Trading Portfolio Balance
        const paperRef = doc(db, "paperTrading", currentUser.uid);
        const paperSnap = await getDoc(paperRef);
        if (paperSnap.exists()) {
          const data = paperSnap.data();
          const bal = data.balance ?? 1000000;
          const holdings = data.holdings ?? [];
          const mktCap = holdings.reduce(
            (acc, item) => acc + item.quantity * (item.currentPrice || item.averageBuyPrice),
            0
          );
          setPortfolioValue(bal + mktCap);
        }
      } catch (err) {
        console.error("Elite Dashboard Data Error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin" />
          <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading Elite Command Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <MemberSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 min-w-0 w-full">
        <MemberTopbar toggleSidebar={() => setOpenSidebar(true)} />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* TOP WELCOME BANNER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-yellow-400/15 via-zinc-900 to-black p-6 md:p-8 rounded-3xl border border-yellow-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
            
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/20 px-4 py-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
                <FaBolt className="text-yellow-400" /> StockScorcher Elite Terminal
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Elite Command Center 🚀
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Your dedicated workspace for real-time market terminals, algorithmic scanners, and AI insights.
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10 shrink-0">
              <button
                onClick={() => navigate("/paper-trading")}
                className="bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black text-xs hover:bg-yellow-300 transition shadow-lg cursor-pointer flex items-center gap-2"
              >
                <FaWallet /> Paper Trading Desk
              </button>
            </div>
          </div>

          {/* REAL-TIME METRICS STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Virtual Net Worth</p>
              <h2 className="text-2xl md:text-3xl font-black text-yellow-400">
                ₹{portfolioValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[10px] text-green-400 font-bold">Synced with active positions</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">AI Signal Engine</p>
              <h2 className="text-2xl md:text-3xl font-black text-green-400 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" /> ONLINE
              </h2>
              <p className="text-[10px] text-zinc-500">Neural models operational</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Watchlist Count</p>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {watchlistCount} Assets
              </h2>
              <p className="text-[10px] text-yellow-400 font-semibold">Live price alerts active</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Membership Status</p>
              <h2 className="text-2xl md:text-3xl font-black text-green-400">
                VIP Elite
              </h2>
              <p className="text-[10px] text-zinc-500">Full institutional access</p>
            </div>
          </div>

          {/* CORE TERMINAL SHORTCUT CARDS */}
          <div>
            <h2 className="text-2xl font-black tracking-tight">Institutional Navigation Desks</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Select any core module below to open its dedicated workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate("/stock-analysis")}
              className="group cursor-pointer rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 md:p-8 transition-all duration-300 hover:border-yellow-400/60 hover:bg-zinc-900 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl font-bold">
                  <FaChartLine />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-yellow-400 group-hover:translate-x-1 transition-transform">
                  Open Page <FaArrowRight />
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Live Market Terminal</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Advanced live candlestick charts, multi-timeframe indicators, and volume analytics.
              </p>
            </div>

            <div 
              onClick={() => navigate("/stock-scanner")}
              className="group cursor-pointer rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 md:p-8 transition-all duration-300 hover:border-yellow-400/60 hover:bg-zinc-900 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl font-bold">
                  <FaFilter />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-yellow-400 group-hover:translate-x-1 transition-transform">
                  Open Page <FaArrowRight />
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Elite Stock Scanner</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Filter high-probability breakouts, momentum, and value stocks instantly.
              </p>
            </div>

            <div 
              onClick={() => navigate("/ai-assistant")}
              className="group cursor-pointer rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 md:p-8 transition-all duration-300 hover:border-yellow-400/60 hover:bg-zinc-900 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl font-bold">
                  <FaRobot />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-yellow-400 group-hover:translate-x-1 transition-transform">
                  Open Page <FaArrowRight />
                </span>
              </div>
              <h3 className="text-xl font-black text-white">AI Deep Analysis Engine</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Automated buy/sell triggers and risk parameters powered by neural network prediction.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}