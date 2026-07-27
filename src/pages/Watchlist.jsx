import { useEffect, useState } from "react";
import {
  FaBookmark,
  FaPlus,
  FaTrash,
  FaSync,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { getStockQuote } from "../services/finnhub";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [stocksData, setStocksData] = useState({});
  const [symbolInput, setSymbolInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchingPrices, setFetchingPrices] = useState(false);
  const [adding, setAdding] = useState(false);

  // Popular quick preset tickers
  const defaultTickers = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN", "BTC-USD"];

  /* =========================
     LOAD WATCHLIST FROM FIREBASE
  ========================= */
  useEffect(() => {
    const loadWatchlist = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "watchlists", user.uid);
        const docSnap = await getDoc(docRef);

        let symbols = defaultTickers;
        if (docSnap.exists() && docSnap.data().symbols) {
          symbols = docSnap.data().symbols;
        } else {
          // Initialize default watchlist for new pro users
          await setDoc(docRef, { symbols: defaultTickers }, { merge: true });
        }

        setWatchlist(symbols);
        fetchQuotesForSymbols(symbols);
      } catch (error) {
        console.error("Error loading watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  /* =========================
     FETCH LIVE QUOTES
  ========================= */
  const fetchQuotesForSymbols = async (symbolsArray) => {
    if (!symbolsArray || symbolsArray.length === 0) return;

    setFetchingPrices(true);
    const quotes = {};

    await Promise.all(
      symbolsArray.map(async (ticker) => {
        try {
          const data = await getStockQuote(ticker);
          if (data && data.current) {
            quotes[ticker] = {
              current: data.current,
              change: data.change || 0,
              percentChange: data.percentChange || 0,
            };
          }
        } catch (err) {
          console.error(`Failed to fetch quote for ${ticker}:`, err);
        }
      })
    );

    setStocksData((prev) => ({ ...prev, ...quotes }));
    setFetchingPrices(false);
  };

  /* =========================
     ADD STOCK TO WATCHLIST
  ========================= */
  const handleAddStock = async (e) => {
    e.preventDefault();
    const ticker = symbolInput.trim().toUpperCase();

    if (!ticker) {
      alert("Please enter a valid stock symbol");
      return;
    }

    if (watchlist.includes(ticker)) {
      alert(`${ticker} is already in your watchlist`);
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      setAdding(true);
      const docRef = doc(db, "watchlists", user.uid);
      await updateDoc(docRef, {
        symbols: arrayUnion(ticker),
      });

      const updatedList = [...watchlist, ticker];
      setWatchlist(updatedList);
      setSymbolInput("");
      
      // Fetch quote for the newly added stock
      const data = await getStockQuote(ticker);
      if (data && data.current) {
        setStocksData((prev) => ({
          ...prev,
          [ticker]: {
            current: data.current,
            change: data.change || 0,
            percentChange: data.percentChange || 0,
          },
        }));
      }

      alert(`✅ Added ${ticker} to your watchlist`);
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Failed to add stock");
    } finally {
      setAdding(false);
    }
  };

  /* =========================
     REMOVE STOCK FROM WATCHLIST
  ========================= */
  const handleRemoveStock = async (ticker) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, "watchlists", user.uid);
      await updateDoc(docRef, {
        symbols: arrayRemove(ticker),
      });

      setWatchlist(watchlist.filter((item) => item !== ticker));
    } catch (error) {
      console.error("Error removing stock:", error);
      alert("Failed to remove stock");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent mx-auto" />
          <p className="text-yellow-400 text-xs font-bold tracking-wider uppercase animate-pulse">
            Loading Watchlist Terminal...
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
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/20 px-4 py-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
                <FaBookmark className="text-yellow-400" /> Custom Asset Tracker
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Institutional Watchlist 🎯
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Monitor live market prices and daily performance of your preferred high-momentum assets.
              </p>
            </div>
          </div>

          {/* ADD STOCK FORM & CONTROLS */}
          <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <form onSubmit={handleAddStock} className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto flex-1">
              <input
                type="text"
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value)}
                placeholder="Enter Ticker (e.g., TSLA, RELIANCE)"
                className="w-full sm:w-80 bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition"
              />
              <button
                type="submit"
                disabled={adding}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 text-black px-6 py-3.5 rounded-2xl font-black text-xs hover:bg-yellow-300 transition cursor-pointer shadow-lg active:scale-95 shrink-0"
              >
                <FaPlus /> {adding ? "Adding..." : "Add Asset"}
              </button>
            </form>

            <button
              onClick={() => fetchQuotesForSymbols(watchlist)}
              disabled={fetchingPrices}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 text-yellow-400 px-6 py-3.5 rounded-2xl font-bold text-xs hover:bg-zinc-800 transition cursor-pointer shrink-0"
            >
              <FaSync className={fetchingPrices ? "animate-spin" : ""} /> Refresh Quotes
            </button>
          </div>

          {/* WATCHLIST ASSETS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((ticker) => {
              const quote = stocksData[ticker];
              const price = quote?.current;
              const change = quote?.change || 0;
              const percentChange = quote?.percentChange || 0;
              const isPositive = change >= 0;

              return (
                <div
                  key={ticker}
                  className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl relative group hover:border-yellow-400/50 transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black text-base">
                        {ticker.slice(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">{ticker}</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Stream</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveStock(ticker)}
                      className="text-zinc-500 hover:text-red-400 p-2 rounded-xl transition cursor-pointer"
                      title="Remove from Watchlist"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                    <div>
                      <p className="text-xs text-zinc-400 font-semibold">Live Quote</p>
                      <p className="text-2xl font-black text-white mt-1">
                        {price ? `₹${price.toFixed(2)}` : "Loading..."}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-400 font-semibold">24h Change</p>
                      <div className={`inline-flex items-center gap-1 text-sm font-bold mt-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                        {isPositive ? "+" : ""}{percentChange.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}