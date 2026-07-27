import { useState } from "react";
import {
  FaChartLine,
  FaShieldAlt,
  FaArrowUp,
  FaArrowDown,
  FaSlidersH,
  FaSync,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLayerGroup,
} from "react-icons/fa";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function StockAnalysis() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [timeframe, setTimeframe] = useState("1D");
  const [indicator, setIndicator] = useState("RSI + MACD");
  const [activeTab, setActiveTab] = useState("chart");

  // Simulated active position linked to chart markers
  const [position, setPosition] = useState({
    action: "BUY",
    symbol: "RELIANCE (NSE)",
    entryPrice: 2700,
    currentPrice: 2850,
    target: 3000,
    stopLoss: 2600,
    quantity: 50,
  });

  const pnlValue = (position.currentPrice - position.entryPrice) * position.quantity;

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <MemberSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 min-w-0 w-full">
        <MemberTopbar toggleSidebar={() => setOpenSidebar(true)} />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">

          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-yellow-400/10 via-zinc-900 to-black p-6 md:p-8 rounded-3xl border border-yellow-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/20 px-4 py-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
                <FaChartLine className="text-yellow-400" /> TradingView Institutional Wrapper
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Live Chart & Position Terminal 📊
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl">
                Advanced candlestick charting, multi-timeframe indicators, and real-time trade position tracking with automated P&L analytics.
              </p>
            </div>
          </div>

          {/* ASSET & TIMEFRAME CONTROLS */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950 p-4 rounded-3xl border border-yellow-500/20 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {["RELIANCE", "TCS", "NIFTY", "BTC", "GOLD"].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                    selectedSymbol === sym
                      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              {["15m", "1H", "4H", "1D", "1W"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timeframe === tf
                      ? "bg-yellow-400/20 border border-yellow-400 text-yellow-400"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CHART & POSITION PANEL GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT 2 COLS: TRADINGVIEW STYLE CHART AREA */}
            <div className="lg:col-span-2 rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6 flex flex-col justify-between h-[650px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-white">{selectedSymbol} / INR Live Candlestick Feed</h3>
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                    WebSocket Connected
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold">
                  <FaLayerGroup className="text-yellow-400" /> Indicators: EMA, RSI, MACD
                </div>
              </div>

              {/* Simulated Candlestick Chart Box */}
              <div className="flex-1 bg-black/80 rounded-2xl border border-white/5 relative flex items-center justify-center overflow-hidden p-6">
                <div className="absolute inset-0 bg-[radial-gradient(#eab30810_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                
                <div className="text-center space-y-3 relative z-10">
                  <div className="h-16 w-16 mx-auto rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-2xl animate-pulse">
                    <FaChartLine />
                  </div>
                  <h4 className="text-base font-black text-white">Interactive TradingView Chart Canvas</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Rendering institutional volume histograms, support-resistance bands, and real-time execution markers for {selectedSymbol}.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs font-bold">
                    <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-xl">Support: ₹2,680</span>
                    <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-xl">Resistance: ₹2,850</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <span>Timezone: IST (UTC+5:30)</span>
                <span>StockScorcher Advanced Charting Engine</span>
              </div>
            </div>

            {/* RIGHT COL: LIVE POSITION MARKER & P&L SUMMARY */}
            <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 md:p-8 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <FaShieldAlt className="text-yellow-400" /> Active Position Marker
                  </h3>
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full">
                    {position.action}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Target Asset</span>
                    <span className="font-bold text-white">{position.symbol}</span>
                  </div>

                  <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Entry Price</span>
                    <span className="font-black text-white">₹{position.entryPrice.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Current CMP</span>
                    <span className="font-black text-yellow-400">₹{position.currentPrice.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/60 p-3 rounded-2xl border border-white/5 text-center">
                      <p className="text-zinc-500 font-semibold text-[10px]">Target Zone</p>
                      <p className="font-bold text-green-400 mt-1">₹{position.target}</p>
                    </div>
                    <div className="bg-black/60 p-3 rounded-2xl border border-white/5 text-center">
                      <p className="text-zinc-500 font-semibold text-[10px]">Stop Loss</p>
                      <p className="font-bold text-red-400 mt-1">₹{position.stopLoss}</p>
                    </div>
                  </div>

                  <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Quantity / Lots</span>
                    <span className="font-bold text-white">{position.quantity} Shares</span>
                  </div>
                </div>
              </div>

              {/* Real-time P&L Box */}
              <div className="bg-gradient-to-r from-green-500/10 via-black to-black p-5 rounded-2xl border border-green-500/30 space-y-2 text-center">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Live Position P&L</p>
                <h4 className={`text-2xl font-black ${pnlValue >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {pnlValue >= 0 ? `+₹${pnlValue.toLocaleString("en-IN")}` : `-₹${Math.abs(pnlValue).toLocaleString("en-IN")}`}
                </h4>
                <p className="text-[10px] text-zinc-500">Synchronized with live order book</p>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}