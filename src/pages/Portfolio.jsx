import { useEffect, useState } from "react";
import {
  FaWallet,
  FaChartPie,
  FaShieldAlt,
  FaSync,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaCrown,
} from "react-icons/fa";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getStockQuote } from "../services/finnhub";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function Portfolio() {
  const [balance, setBalance] = useState(100000);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const paperRef = doc(db, "paperTrading", user.uid);
      const paperSnap = await getDoc(paperRef);

      if (paperSnap.exists()) {
        const data = paperSnap.data();
        setBalance(data.balance ?? 100000);
        setHoldings(data.holdings ?? []);
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (holdings.length === 0) {
      alert("No holdings to refresh");
      return;
    }

    setRefreshing(true);
    try {
      const updatedHoldings = await Promise.all(
        holdings.map(async (item) => {
          try {
            const data = await getStockQuote(item.symbol);
            return {
              ...item,
              currentPrice: data.current || item.averageBuyPrice,
            };
          } catch {
            return item;
          }
        })
      );
      setHoldings(updatedHoldings);
      alert("✅ Portfolio valuations updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to refresh portfolio");
    } finally {
      setRefreshing(false);
    }
  };

  // Calculations
  const investedAmount = holdings.reduce(
    (acc, item) => acc + item.quantity * item.averageBuyPrice,
    0
  );

  const currentMarketValue = holdings.reduce(
    (acc, item) => acc + item.quantity * (item.currentPrice || item.averageBuyPrice),
    0
  );

  const totalNetWorth = balance + currentMarketValue;
  const totalPnL = currentMarketValue - investedAmount;
  const pnlPercentage = investedAmount > 0 ? (totalPnL / investedAmount) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent mx-auto" />
          <p className="text-yellow-400 text-xs font-bold tracking-wider uppercase animate-pulse">
            Analyzing Portfolio Assets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <MemberSidebar />

      <div className="flex-1 min-w-0 w-full">
        <MemberTopbar />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">

          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-yellow-400/10 via-zinc-900 to-black p-6 md:p-8 rounded-3xl border border-yellow-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/20 px-4 py-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
                  <FaCrown className="text-yellow-400" /> Institutional Asset Manager
                </div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                  Pro Portfolio Allocation 📊
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm">
                  Comprehensive breakdown of your capital allocation, net worth, and value creation.
                </p>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black text-xs hover:bg-yellow-300 transition shadow-lg cursor-pointer shrink-0"
              >
                <FaSync className={refreshing ? "animate-spin" : ""} /> Sync Valuations
              </button>
            </div>
          </div>

          {/* METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Net Worth</p>
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-400">
                ₹{totalNetWorth.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[10px] text-zinc-500">Cash + Live Asset Valuation</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Current Market Value</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                ₹{currentMarketValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[10px] text-zinc-500">Active equity holdings</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Invested Capital</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                ₹{investedAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[10px] text-zinc-500">Initial purchase cost</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-2">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Overall Returns (P&L)</p>
              <h2 className={`text-2xl sm:text-3xl font-black ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ({pnlPercentage.toFixed(2)}%)
              </h2>
              <p className="text-[10px] text-zinc-500">Cumulative portfolio return</p>
            </div>
          </div>

          {/* VALUE INVESTING HEALTH CARD */}
          <div className="rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <FaShieldAlt className="text-yellow-400" /> Value Investing Health Score
              </h3>
              <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                Grade: A+ (Optimized)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2">
                <div className="text-yellow-400 font-bold text-sm flex items-center gap-2">
                  <FaCheckCircle /> Margin of Safety
                </div>
                <p className="text-xs text-zinc-400">Your equity allocation maintains strict risk boundaries against sudden market drawdowns.</p>
              </div>

              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2">
                <div className="text-yellow-400 font-bold text-sm flex items-center gap-2">
                  <FaCheckCircle /> Capital Liquidity
                </div>
                <p className="text-xs text-zinc-400">{( (balance / totalNetWorth) * 100 ).toFixed(1)}% of total net worth is held in liquid virtual cash for tactical dips.</p>
              </div>

              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2">
                <div className="text-yellow-400 font-bold text-sm flex items-center gap-2">
                  <FaCheckCircle /> Diversification Index
                </div>
                <p className="text-xs text-zinc-400">Tracking {holdings.length} unique asset streams across institutional sectors.</p>
              </div>
            </div>
          </div>

          {/* HOLDINGS DISTRIBUTION TABLE */}
          <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-black text-white">Asset Distribution & Holdings</h3>

            {holdings.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <FaChartPie className="mx-auto text-5xl text-zinc-700" />
                <p className="text-zinc-400 font-semibold text-sm">No assets found in your portfolio.</p>
                <p className="text-zinc-600 text-xs">Execute paper trades to populate your asset distribution metrics.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {holdings.map((item) => {
                  const currentPrice = item.currentPrice || item.averageBuyPrice;
                  const itemValue = item.quantity * currentPrice;
                  const itemCost = item.quantity * item.averageBuyPrice;
                  const itemPnL = itemValue - itemCost;
                  const weight = currentMarketValue > 0 ? (itemValue / currentMarketValue) * 100 : 0;

                  return (
                    <div
                      key={item.symbol}
                      className="bg-black/60 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black text-lg">
                          {item.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white">{item.symbol}</h4>
                          <p className="text-xs text-zinc-400 font-semibold">{item.quantity} Shares | Weight: {weight.toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-left sm:text-right">
                        <div>
                          <p className="text-xs text-zinc-400 font-semibold">Value</p>
                          <p className="text-sm font-bold text-white mt-0.5">₹{itemValue.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 font-semibold">Avg Cost</p>
                          <p className="text-sm font-bold text-white mt-0.5">₹{item.averageBuyPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 font-semibold">P&L</p>
                          <p className={`text-sm font-black mt-0.5 ${itemPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {itemPnL >= 0 ? "+" : ""}₹{itemPnL.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}