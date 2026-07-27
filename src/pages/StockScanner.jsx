import { useState } from "react";
import {
  FaFilter,
  FaChartLine,
  FaSearch,
  FaBolt,
  FaArrowUp,
  FaArrowDown,
  FaBookmark,
  FaCheck,
} from "react-icons/fa";
import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function StockScanner() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Breakout");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedStocks, setSavedStocks] = useState([]);

  // Mock institutional scanned stocks data (Can be connected to live NSE/BSE API)
  const scannedStocks = [
    { id: 1, symbol: "RELIANCE", name: "Reliance Industries", price: "₹2,940.50", change: "+3.45%", volume: "14.2M", signal: "Bullish Breakout", rsi: "68.4" },
    { id: 2, symbol: "TATASTEEL", name: "Tata Steel Ltd", price: "₹168.20", change: "+4.12%", volume: "22.8M", signal: "Volume Spike", rsi: "72.1" },
    { id: 3, symbol: "INFY", name: "Infosys Technologies", price: "₹1,825.00", change: "-1.15%", volume: "8.5M", signal: "Pullback Zone", rsi: "44.2" },
    { id: 4, symbol: "SBIN", name: "State Bank of India", price: "₹785.60", change: "+2.80%", volume: "19.1M", signal: "Momentum Crossover", rsi: "65.8" },
    { id: 5, symbol: "NTPC", name: "NTPC Limited", price: "₹342.10", change: "+0.95%", volume: "11.3M", signal: "Consolidation", rsi: "54.9" },
    { id: 6, symbol: "ZOMATO", name: "Zomato Limited", price: "₹215.40", change: "+5.60%", volume: "35.4M", signal: "Strong Accumulation", rsi: "78.2" },
  ];

  const handleSaveStock = (symbol) => {
    if (!savedStocks.includes(symbol)) {
      setSavedStocks([...savedStocks, symbol]);
    } else {
      setSavedStocks(savedStocks.filter((s) => s !== symbol));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <MemberSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 min-w-0 w-full">
        <MemberTopbar toggleSidebar={() => setOpenSidebar(true)} />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* HEADER BANNER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-yellow-400/15 via-zinc-900 to-black p-6 md:p-8 rounded-3xl border border-yellow-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
            
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/20 px-4 py-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
                <FaBolt className="text-yellow-400" /> Algorithmic Screening Engine
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Elite Stock Scanner 🔍
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Isolate high-probability breakout candidates, volume surges, and institutional momentum in real-time.
              </p>
            </div>

            <div className="relative z-10 w-full md:w-72">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search symbol (e.g. RELIANCE)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-yellow-500/30 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex flex-wrap items-center gap-3">
            {["Breakout", "Volume Spike", "Momentum Crossover", "Strong Accumulation"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer ${
                  activeFilter === filter
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 font-black"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* STOCKS TABLE / GRID */}
          <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FaFilter className="text-yellow-400" /> Filtered Institutional Feed
              </h3>
              <span className="text-xs text-zinc-400 font-semibold">
                Showing live matches
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-zinc-900/50 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    <th className="p-4 sm:p-5">Asset / Company</th>
                    <th className="p-4 sm:p-5">Live Price</th>
                    <th className="p-4 sm:p-5">24h Change</th>
                    <th className="p-4 sm:p-5">Traded Volume</th>
                    <th className="p-4 sm:p-5">AI Signal</th>
                    <th className="p-4 sm:p-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {scannedStocks
                    .filter((s) => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((stock) => {
                      const isSaved = savedStocks.includes(stock.symbol);
                      const isPositive = stock.change.startsWith("+");
                      return (
                        <tr key={stock.id} className="hover:bg-zinc-900/40 transition">
                          <td className="p-4 sm:p-5">
                            <div className="font-black text-white text-sm">{stock.symbol}</div>
                            <div className="text-[11px] text-zinc-400">{stock.name}</div>
                          </td>
                          <td className="p-4 sm:p-5 font-bold text-white">{stock.price}</td>
                          <td className={`p-4 sm:p-5 font-black flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                            {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                            {stock.change}
                          </td>
                          <td className="p-4 sm:p-5 text-zinc-300 font-semibold">{stock.volume}</td>
                          <td className="p-4 sm:p-5">
                            <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase text-yellow-400">
                              {stock.signal}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 text-right">
                            <button
                              onClick={() => handleSaveStock(stock.symbol)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ml-auto ${
                                isSaved
                                  ? "bg-yellow-400 text-black font-black"
                                  : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
                              }`}
                            >
                              {isSaved ? <FaCheck /> : <FaBookmark />} {isSaved ? "Saved" : "Watchlist"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}