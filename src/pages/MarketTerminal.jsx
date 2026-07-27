import { useState, useMemo } from "react";
import {
  FaChartLine,
  FaBitcoin,
  FaDollarSign,
  FaGlobe,
  FaFire,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaShieldAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

const assetCategories = [
  { id: "all", label: "All Markets", icon: <FaGlobe /> },
  { id: "indian", label: "Indian Stocks & F&O", icon: <FaChartLine /> },
  { id: "crypto", label: "Cryptocurrency", icon: <FaBitcoin /> },
  { id: "forex", label: "Forex Liquidity", icon: <FaDollarSign /> },
  { id: "global", label: "Global Indices", icon: <FaGlobe /> },
  { id: "commodities", label: "Commodities", icon: <FaFire /> },
];

export default function MarketTerminal() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const marketAssets = [
    // Indian Stocks & Indices
    { symbol: "NIFTY 50", name: "Nifty 50 Index", category: "indian", price: "₹23,650.40", change: "+0.85%", status: "Bullish", volume: "High" },
    { symbol: "BANK NIFTY", name: "Bank Nifty Index", category: "indian", price: "₹51,240.10", change: "+1.12%", status: "Bullish", volume: "Surge" },
    { symbol: "RELIANCE", name: "Reliance Industries", category: "indian", price: "₹2,840.50", change: "+2.4%", status: "Accumulation", volume: "Moderate" },
    { symbol: "TCS", name: "Tata Consultancy Services", category: "indian", price: "₹4,120.00", change: "-0.45%", status: "Neutral", volume: "Stable" },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd", category: "indian", price: "₹1,620.40", change: "+1.20%", status: "Bullish", volume: "High" },

    // Crypto
    { symbol: "BTC", name: "Bitcoin / USD", category: "crypto", price: "$67,850.00", change: "+2.40%", status: "Breakout Test", volume: "Very High" },
    { symbol: "ETH", name: "Ethereum / USD", category: "crypto", price: "$3,520.10", change: "+1.85%", status: "Bullish", volume: "High" },
    { symbol: "SOL", name: "Solana / USD", category: "crypto", price: "$148.20", change: "+5.10%", status: "Momentum", volume: "Surge" },

    // Forex
    { symbol: "USD/INR", name: "US Dollar / Indian Rupee", category: "forex", price: "₹83.45", change: "-0.05%", status: "Stable Range", volume: "Normal" },
    { symbol: "EUR/USD", name: "Euro / US Dollar", category: "forex", price: "$1.0870", change: "+0.12%", status: "Neutral", volume: "Normal" },
    { symbol: "GBP/USD", name: "British Pound / US Dollar", category: "forex", price: "$1.2940", change: "+0.22%", status: "Bullish", volume: "Stable" },

    // Global Markets
    { symbol: "NASDAQ", name: "Nasdaq Composite", category: "global", price: "17,850.20", change: "+1.15%", status: "Tech Rally", volume: "High" },
    { symbol: "S&P 500", name: "S&P 500 Index", category: "global", price: "5,550.80", change: "+0.75%", status: "Bullish", volume: "Steady" },
    { symbol: "DOW JONES", name: "Dow Jones Industrial", category: "global", price: "40,220.50", change: "+0.40%", status: "Consolidation", volume: "Normal" },

    // Commodities
    { symbol: "GOLD", name: "Spot Gold (oz)", category: "commodities", price: "$2,410.50", change: "+0.65%", status: "Safe Haven Bid", volume: "High" },
    { symbol: "SILVER", name: "Spot Silver (oz)", category: "commodities", price: "$30.80", change: "+1.40%", status: "Bullish", volume: "Surge" },
    { symbol: "CRUDE OIL", name: "WTI Crude Oil", category: "commodities", price: "$82.30", change: "-0.85%", status: "OPEC Pressure", volume: "Moderate" },
  ];

  const filteredAssets = useMemo(() => {
    return marketAssets.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
                <FaChartLine className="text-yellow-400" /> Multi-Asset Intelligence Desk
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                All Market Terminal 📈
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl">
                Real-time institutional liquidity tracking across Indian equities, cryptocurrencies, forex pairs, global indices, and commodities.
              </p>
            </div>
          </div>

          {/* CATEGORY SELECTOR & SEARCH BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950 p-4 rounded-3xl border border-yellow-500/20 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {assetCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol or name..."
                className="w-full bg-black border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white outline-none focus:border-yellow-400 transition"
              />
            </div>
          </div>

          {/* ASSETS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset, index) => (
              <div
                key={`${asset.symbol}-${index}`}
                className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl space-y-4 hover:border-yellow-400/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-400">
                      {asset.category.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                      {asset.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">{asset.symbol}</h3>
                    <p className="text-xs text-zinc-400 font-semibold mt-0.5">{asset.name}</p>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Current Price</p>
                      <p className="text-lg font-black text-white mt-0.5">{asset.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">24h Change</p>
                      <p className={`text-sm font-black mt-0.5 ${asset.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                        {asset.change}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-500">Liquidity: <span className="text-zinc-300">{asset.volume}</span></span>
                  <span className="text-yellow-400 flex items-center gap-1 cursor-pointer hover:underline">
                    Terminal View <FaExternalLinkAlt size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}