import { useEffect, useState } from "react";
import {
  FaCrown,
  FaCalendarAlt,
  FaCreditCard,
  FaEnvelope,
  FaGlobe,
  FaSignOutAlt,
  FaCopy,
  FaCheck,
  FaExclamationTriangle,
  FaChartLine,
  FaRobot,
  FaArrowRight,
  FaBolt,
  FaWallet,
  FaFilter,
} from "react-icons/fa";
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function MemberDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Advanced States
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [virtualBalance, setVirtualBalance] = useState(1000000);
  const [portfolioValue, setPortfolioValue] = useState(1000000);

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setUserData(null);
        setMembership(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        // 1. Real-time User Profile Sync
        const userDocRef = doc(db, "users", currentUser.uid);
        unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        });

        // 2. Fetch Membership Details
        const membershipRef = doc(db, "memberships", currentUser.uid);
        const membershipSnap = await getDoc(membershipRef);
        if (membershipSnap.exists()) {
          setMembership(membershipSnap.data());
        } else {
          setMembership(null);
        }

        // 3. Fetch Watchlist Count
        try {
          const watchlistRef = collection(db, "users", currentUser.uid, "watchlist");
          const watchlistSnap = await getDocs(watchlistRef);
          setWatchlistCount(watchlistSnap.size);
        } catch {
          setWatchlistCount(0);
        }

        // 4. Fetch Paper Trading Portfolio Data
        try {
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
            setVirtualBalance(bal);
            setPortfolioValue(bal + mktCap);
          }
        } catch {
          // Fallback
        }

      } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      if (date?.toDate) {
        return date.toDate().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;
    try {
      const expiry = expiryDate?.toDate ? expiryDate.toDate() : new Date(expiryDate);
      const today = new Date();
      return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  };

  const daysRemaining = membership?.expiryDate ? getDaysLeft(membership.expiryDate) : null;
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;

  const handleCopyPaymentId = (paymentId) => {
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin" />
          <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase animate-pulse">
            Initializing Unified Elite Terminal...
          </p>
        </div>
      </div>
    );
  }

  const currentDisplayName = userData?.fullName || user?.displayName || user?.email?.split("@")[0] || "Elite Trader";

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
                <FaBolt className="text-yellow-400" /> ₹9,999 Institutional Command Center
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Welcome back, {currentDisplayName} 🚀
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Your membership subscription and all elite trading terminals are unified in one place.
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10 shrink-0">
              <button
                onClick={() => navigate("/paper-trading")}
                className="bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black text-xs hover:bg-yellow-300 transition shadow-lg cursor-pointer flex items-center gap-2"
              >
                <FaWallet /> Launch Paper Arena
              </button>
            </div>
          </div>

          {/* QUICK PERFORMANCE STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Virtual Net Worth</p>
              <h2 className="text-2xl md:text-3xl font-black text-yellow-400">
                ₹{portfolioValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[10px] text-green-400 font-bold">Live Portfolio Valuation</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">AI Signal Engine</p>
              <h2 className="text-2xl md:text-3xl font-black text-green-400 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" /> ONLINE
              </h2>
              <p className="text-[10px] text-zinc-500">Neural models fully active</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Watchlist Assets</p>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {watchlistCount} Tracked
              </h2>
              <p className="text-[10px] text-yellow-400 font-semibold">Real-time alerts enabled</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Risk Governance</p>
              <h2 className="text-2xl md:text-3xl font-black text-green-400">
                Grade A+
              </h2>
              <p className="text-[10px] text-zinc-500">Margin of safety optimized</p>
            </div>
          </div>

          {/* EXPIRY WARNING BANNER */}
          {isExpiringSoon && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-xl"><FaExclamationTriangle /></span>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Subscription Expiring Soon!</h4>
                  <p className="text-xs text-amber-400/80">Your plan expires in {daysRemaining} day(s). Renew now to prevent session interruption.</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/membership")}
                className="bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-amber-300 transition shrink-0 cursor-pointer"
              >
                Renew Plan
              </button>
            </div>
          )}

          {/* MEMBERSHIP STATUS CARD */}
          {membership ? (
            <div className="relative overflow-hidden rounded-3xl border border-yellow-500/40 bg-gradient-to-br from-yellow-400/15 via-zinc-900 to-zinc-950 p-6 md:p-8 shadow-2xl">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />

              <div className="relative space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-500 to-yellow-300 text-black text-3xl shadow-xl">
                      <FaCrown />
                    </div>
                    <div>
                      <p className="text-yellow-400 text-xs uppercase tracking-widest font-black">Active Subscription Tier</p>
                      <h2 className="text-2xl md:text-3xl font-black text-white">
                        {membership.plan || "StockScorcher Elite (₹9,999)"}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2.5 rounded-2xl w-fit">
                    <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 font-bold text-xs uppercase tracking-wider">
                      {membership.status || "Verified Active"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl bg-black/50 border border-white/5 p-5 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                      <FaEnvelope className="text-yellow-400 text-xs" />
                      <span>Account Email</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-white truncate pt-1">
                      {membership.email || user?.email || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/50 border border-white/5 p-5 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                      <FaCreditCard className="text-yellow-400 text-xs" />
                      <span>Paid Amount</span>
                    </div>
                    <p className="text-sm sm:text-base font-black text-yellow-400 pt-1">
                      ₹{Number(membership.amount || 9999).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/50 border border-white/5 p-5 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                      <FaCalendarAlt className="text-yellow-400 text-xs" />
                      <span>Activated On</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-white pt-1">
                      {formatDate(membership.purchasedAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/50 border border-white/5 p-5 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                      <FaCalendarAlt className="text-yellow-400 text-xs" />
                      <span>Valid Expiry</span>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-yellow-400 pt-1">
                      {membership.expiryDate ? formatDate(membership.expiryDate) : "Lifetime / Perpetual"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <h2 className="text-2xl font-black text-white">Upgrade to StockScorcher Elite 👑</h2>
                <p className="text-gray-300 text-xs sm:text-sm mt-1">
                  Unlock the full institutional suite for ₹9,999: Live Market Terminal, Paper Trading Arena, and AI Research Assistant.
                </p>
              </div>
              <button
                onClick={() => navigate("/membership")}
                className="rounded-2xl bg-yellow-400 px-6 py-3.5 font-black text-black text-xs hover:bg-yellow-300 transition cursor-pointer shadow-lg shrink-0"
              >
                Unlock Elite Tier Now 🚀
              </button>
            </div>
          )}

          {/* ELITE TRADING TERMINALS SHORTCUTS */}
          <div>
            <h2 className="text-2xl font-black tracking-tight">Institutional Terminals</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Direct gateways to high-probability tools, algorithmic scanners, and simulation desks.
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
                  Launch <FaArrowRight />
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Live Market Terminal</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Advanced live feeds, candlestick charting, and intraday volume analysis.
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
                  Launch <FaArrowRight />
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
                  Launch <FaArrowRight />
                </span>
              </div>
              <h3 className="text-xl font-black text-white">AI Deep Analysis Engine</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Automated buy/sell triggers powered by neural network market prediction.
              </p>
            </div>
          </div>

          {/* SECURE TRANSACTION HASH */}
          {membership?.paymentId && (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Secure Transaction Reference ID</p>
                <p className="text-xs sm:text-sm font-mono text-yellow-400 mt-1 break-all">
                  {membership.paymentId}
                </p>
              </div>
              <button
                onClick={() => handleCopyPaymentId(membership.paymentId)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
              >
                {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                {copied ? "Copied ID!" : "Copy Reference ID"}
              </button>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-6 py-3.5 font-bold text-xs text-white transition hover:border-yellow-400/40 cursor-pointer"
            >
              <FaGlobe />
              Visit StockScorcher Home
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-3.5 font-bold text-xs text-red-400 transition hover:bg-red-500/10 cursor-pointer"
            >
              <FaSignOutAlt />
              Logout Securely
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}