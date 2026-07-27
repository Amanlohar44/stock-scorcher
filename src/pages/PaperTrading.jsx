import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaSync,
  FaBolt,
  FaShieldAlt,
  FaSearchDollar,
  FaCheckCircle,
} from "react-icons/fa";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { getStockQuote } from "../services/finnhub";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function PaperTrading() {
  const [balance, setBalance] = useState(100000);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [holdings, setHoldings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [livePrice, setLivePrice] = useState(null);

  // Quick preset stocks for professional traders
  const quickStocks = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN"];

  /* =========================
     LOAD FIREBASE DATA
  ========================= */
  useEffect(() => {
    const loadPaperTrading = async () => {
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
        } else {
          await setDoc(paperRef, {
            uid: user.uid,
            email: user.email,
            balance: 100000,
            holdings: [],
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Paper Trading Load Error:", error);
        alert("Failed to load paper trading data");
      }
      setLoading(false);
    };

    loadPaperTrading();
  }, []);

  /* =========================
     SAVE FIREBASE DATA
  ========================= */
  const savePaperTrading = async (newBalance, newHoldings) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return false;
    }

    try {
      setSaving(true);
      const paperRef = doc(db, "paperTrading", user.uid);
      await setDoc(
        paperRef,
        {
          uid: user.uid,
          email: user.email,
          balance: newBalance,
          holdings: newHoldings,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error("Firebase Save Error:", error);
      alert("Failed to save trading data");
      return false;
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     GET LIVE PRICE
  ========================= */
  const fetchLivePrice = async (targetSymbol = symbol) => {
    const cleanSymbol = targetSymbol.trim();
    if (!cleanSymbol) {
      alert("Please enter or select a stock symbol");
      return;
    }

    try {
      setFetchingPrice(true);
      const data = await getStockQuote(cleanSymbol.toUpperCase());

      if (!data.current || data.current <= 0) {
        alert("Unable to find live price for this symbol");
        return;
      }

      setLivePrice(data.current);
      setSymbol(cleanSymbol.toUpperCase());
    } catch (error) {
      console.error(error);
      alert("Failed to fetch live stock price");
    } finally {
      setFetchingPrice(false);
    }
  };

  /* =========================
     BUY STOCK
  ========================= */
  const handleBuy = async () => {
    if (!symbol || !quantity) {
      alert("Please enter stock symbol and quantity");
      return;
    }

    if (!livePrice) {
      alert("Please fetch live price first");
      return;
    }

    const buyQuantity = Number(quantity);
    if (buyQuantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const totalCost = buyQuantity * livePrice;
    if (totalCost > balance) {
      alert("Insufficient Virtual Balance in your account");
      return;
    }

    const stockSymbol = symbol.toUpperCase();
    const existingHolding = holdings.find((item) => item.symbol === stockSymbol);
    let updatedHoldings;

    if (existingHolding) {
      const oldInvestment = existingHolding.quantity * existingHolding.averageBuyPrice;
      const newQuantity = existingHolding.quantity + buyQuantity;
      const newAveragePrice = (oldInvestment + totalCost) / newQuantity;

      updatedHoldings = holdings.map((item) =>
        item.symbol === stockSymbol
          ? {
              ...item,
              quantity: newQuantity,
              averageBuyPrice: newAveragePrice,
              currentPrice: livePrice,
            }
          : item
      );
    } else {
      updatedHoldings = [
        ...holdings,
        {
          symbol: stockSymbol,
          quantity: buyQuantity,
          averageBuyPrice: livePrice,
          currentPrice: livePrice,
        },
      ];
    }

    const newBalance = balance - totalCost;
    setBalance(newBalance);
    setHoldings(updatedHoldings);

    const saved = await savePaperTrading(newBalance, updatedHoldings);
    if (saved) {
      alert(`✅ Successfully executed BUY order for ${buyQuantity} shares of ${stockSymbol}`);
      setSymbol("");
      setQuantity("");
      setLivePrice(null);
    }
  };

  /* =========================
     SELL STOCK
  ========================= */
  const handleSell = async () => {
    if (!symbol || !quantity) {
      alert("Please enter stock symbol and quantity");
      return;
    }

    if (!livePrice) {
      alert("Please fetch live price first");
      return;
    }

    const stockSymbol = symbol.toUpperCase();
    const sellQuantity = Number(quantity);
    const holdingIndex = holdings.findIndex((item) => item.symbol === stockSymbol);

    if (holdingIndex === -1) {
      alert(`You don't own any shares of ${stockSymbol}`);
      return;
    }

    const holding = holdings[holdingIndex];
    if (sellQuantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (sellQuantity > holding.quantity) {
      alert(`You only own ${holding.quantity} shares of ${stockSymbol}`);
      return;
    }

    const sellValue = sellQuantity * livePrice;
    const profitLoss = (livePrice - holding.averageBuyPrice) * sellQuantity;
    let updatedHoldings;

    if (sellQuantity === holding.quantity) {
      updatedHoldings = holdings.filter((_, index) => index !== holdingIndex);
    } else {
      updatedHoldings = holdings.map((item, index) =>
        index === holdingIndex
          ? {
              ...item,
              quantity: item.quantity - sellQuantity,
              currentPrice: livePrice,
            }
          : item
      );
    }

    const newBalance = balance + sellValue;
    setBalance(newBalance);
    setHoldings(updatedHoldings);

    const saved = await savePaperTrading(newBalance, updatedHoldings);
    if (saved) {
      alert(`✅ Successfully executed SELL order for ${sellQuantity} shares of ${stockSymbol}\nRealized P&L: ₹${profitLoss.toFixed(2)}`);
      setSymbol("");
      setQuantity("");
      setLivePrice(null);
    }
  };

  /* =========================
     CALCULATE PORTFOLIO
  ========================= */
  const portfolioValue = holdings.reduce(
    (total, item) => total + item.quantity * (item.currentPrice || item.averageBuyPrice),
    0
  );

  const totalInvestment = holdings.reduce(
    (total, item) => total + item.quantity * item.averageBuyPrice,
    0
  );

  const totalProfitLoss = portfolioValue - totalInvestment;

  /* =========================
     REFRESH HOLDING PRICES
  ========================= */
  const refreshPrices = async () => {
    if (holdings.length === 0) {
      alert("No holdings to refresh");
      return;
    }

    try {
      setFetchingPrice(true);
      const updatedHoldings = await Promise.all(
        holdings.map(async (item) => {
          try {
            const data = await getStockQuote(item.symbol);
            return {
              ...item,
              currentPrice: data.current,
            };
          } catch {
            return item;
          }
        })
      );

      setHoldings(updatedHoldings);
      await savePaperTrading(balance, updatedHoldings);
      alert("✅ Live market prices updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update prices");
    } finally {
      setFetchingPrice(false);
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent mx-auto" />
          <p className="text-yellow-400 text-xs font-bold tracking-wider uppercase animate-pulse">
            Loading Paper Trading Terminal...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     RENDER UI
  ========================= */
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
                <FaBolt className="text-yellow-400" /> Risk-Free Simulation Engine
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Institutional Paper Trading 📈
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Test your high-probability strategies with ₹1,00,000 virtual capital in real-time market conditions.
              </p>
            </div>
          </div>

          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Available Cash Balance</p>
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 mt-2">
                ₹{balance.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Portfolio Value</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                ₹{portfolioValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Invested Capital</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                ₹{totalInvestment.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Unrealized P&L</p>
              <h2 className={`text-2xl sm:text-3xl font-black mt-2 ${totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalProfitLoss >= 0 ? "+" : ""}₹{totalProfitLoss.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>
            </div>
          </div>

          {/* EXECUTE TRADE PANEL */}
          <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Execute Instant Order</h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Select a quick stock or enter any valid ticker symbol.</p>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex flex-wrap gap-1.5">
                {quickStocks.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => {
                      setSymbol(ticker);
                      fetchLivePrice(ticker);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold text-yellow-400 hover:bg-yellow-400 hover:text-black transition cursor-pointer"
                  >
                    {ticker}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* SYMBOL INPUT */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold">Stock Symbol / Ticker</label>
                <input
                  value={symbol}
                  onChange={(e) => {
                    setSymbol(e.target.value.toUpperCase());
                    setLivePrice(null);
                  }}
                  placeholder="e.g. AAPL, TSLA"
                  className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition"
                />
              </div>

              {/* QUANTITY INPUT */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold">Quantity / Shares</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition"
                />
              </div>

              {/* LIVE PRICE FETCH */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-semibold">Live Market Quote</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-green-400 font-black text-sm flex items-center">
                    {livePrice ? `₹${livePrice.toFixed(2)}` : "Not Fetched"}
                  </div>
                  <button
                    onClick={() => fetchLivePrice(symbol)}
                    disabled={fetchingPrice}
                    className="px-5 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50 font-bold transition cursor-pointer flex items-center justify-center shrink-0"
                    title="Fetch Quote"
                  >
                    <FaSync className={fetchingPrice ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleBuy}
                disabled={saving || fetchingPrice}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-black py-4 rounded-2xl transition cursor-pointer shadow-lg active:scale-95"
              >
                <FaArrowUp /> BUY LONG POSITION
              </button>

              <button
                onClick={handleSell}
                disabled={saving || fetchingPrice}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition cursor-pointer shadow-lg active:scale-95"
              >
                <FaArrowDown /> SELL / BOOK PROFIT
              </button>
            </div>
          </div>

          {/* MY HOLDINGS SECTION */}
          <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Active Holdings</h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Manage your open positions and real-time P&L.</p>
              </div>

              <button
                onClick={refreshPrices}
                disabled={fetchingPrice || holdings.length === 0}
                className="flex items-center justify-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 cursor-pointer"
              >
                <FaSync className={fetchingPrice ? "animate-spin" : ""} /> Refresh All Quotes
              </button>
            </div>

            {holdings.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <FaChartLine className="mx-auto text-5xl text-zinc-700" />
                <p className="text-zinc-400 font-semibold text-sm">No open positions in your portfolio yet.</p>
                <p className="text-zinc-600 text-xs">Execute a buy order above to start practicing your strategy.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {holdings.map((holding) => {
                  const currentPrice = holding.currentPrice || holding.averageBuyPrice;
                  const investment = holding.quantity * holding.averageBuyPrice;
                  const currentValue = holding.quantity * currentPrice;
                  const pnl = currentValue - investment;
                  const pnlPercentage = investment > 0 ? (pnl / investment) * 100 : 0;

                  return (
                    <div
                      key={holding.symbol}
                      className="bg-black/60 border border-white/5 hover:border-white/15 transition rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black text-lg">
                          {holding.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white">{holding.symbol}</h3>
                          <p className="text-xs text-zinc-400 font-semibold">Qty: {holding.quantity} shares</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left lg:text-right">
                        <div>
                          <p className="text-xs text-zinc-400 font-semibold">Avg Buy Price</p>
                          <p className="text-sm font-bold text-white mt-0.5">₹{holding.averageBuyPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 font-semibold">Current Price</p>
                          <p className="text-sm font-bold text-yellow-400 mt-0.5">₹{currentPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 font-semibold">Total Value</p>
                          <p className="text-sm font-bold text-white mt-0.5">₹{currentValue.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 font-semibold">Unrealized P&L</p>
                          <p className={`text-sm font-black mt-0.5 ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSymbol(holding.symbol);
                          setQuantity(holding.quantity);
                          setLivePrice(currentPrice);
                          window.scrollTo({ top: 400, behavior: "smooth" });
                        }}
                        className="bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-black text-red-400 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shrink-0"
                      >
                        Quick Sell
                      </button>
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