import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import TradingViewChart from "./TradingViewChart";

import useMarketSearch from "../hooks/useMarketSearch";
import marketDetector from "../utils/marketDetector";
import getTradingViewSymbol from "../utils/getTradingViewSymbol";

import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { addToWatchlist } from "../services/watchlist";
import { getHistoricalPrices } from "../services/historyService";
import { generateAIAnalysis } from "../ai/analysis";

export default function StockSearch() {
  // =========================
  // SEARCH STATE
  // =========================

  const [symbol, setSymbol] = useState("");
  const [searchedSymbol, setSearchedSymbol] = useState("");

  const {
    loading,
    stock,
    company,
    searchMarket,
  } = useMarketSearch();

  // =========================
  // PAPER TRADING STATE
  // =========================

  const [quantity, setQuantity] = useState(1);

  const [balance, setBalance] = useState(100000);

  const [portfolio, setPortfolio] = useState({});

  const [saving, setSaving] = useState(false);

  // =========================
  // AI STATE
  // =========================

  const [aiResult, setAiResult] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);

  const [aiError, setAiError] = useState("");

  // =========================
  // MARKET DETECTOR
  // =========================

  const market = marketDetector(
    searchedSymbol || symbol
  );

  // =========================
  // LOAD PAPER TRADING DATA
  // =========================

  useEffect(() => {
    loadPaperTradingData();
  }, []);

  // =========================
  // LOAD AI ANALYSIS
  // ONLY AFTER REAL STOCK DATA
  // =========================

  useEffect(() => {
    if (!stock || !searchedSymbol) {
      setAiResult(null);
      return;
    }

    loadAIAnalysis(searchedSymbol);
  }, [stock, searchedSymbol]);

  // =========================
  // LOAD PAPER TRADING
  // =========================

  const loadPaperTradingData = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap =
        await getDoc(userRef);

      if (!userSnap.exists()) {
        return;
      }

      const data = userSnap.data();

      if (data.paperTrading) {
        setBalance(
          data.paperTrading.balance ??
            100000
        );

        setPortfolio(
          data.paperTrading.portfolio ??
            {}
        );
      }
    } catch (error) {
      console.error(
        "Failed to load paper trading data:",
        error
      );
    }
  };

  // =========================
  // LOAD AI ANALYSIS
  // =========================

  const loadAIAnalysis = async (
    searchSymbol
  ) => {
    try {
      setAiLoading(true);
      setAiError("");

      const prices =
        await getHistoricalPrices(
          searchSymbol
        );

      if (
        !prices ||
        prices.length < 20
      ) {
        throw new Error(
          "Not enough historical market data available."
        );
      }

      const result =
        generateAIAnalysis(prices);

      setAiResult(result);
    } catch (error) {
      console.error(
        "AI Analysis Error:",
        error
      );

      setAiResult(null);

      setAiError(
        "AI analysis is temporarily unavailable."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // =========================
  // SAVE PAPER TRADING DATA
  // =========================

  const savePaperTradingData = async (
    newBalance,
    newPortfolio
  ) => {
    try {
      const user =
        auth.currentUser;

      if (!user) {
        alert(
          "Please login first."
        );

        return false;
      }

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      await setDoc(
        userRef,
        {
          paperTrading: {
            balance: newBalance,

            portfolio:
              newPortfolio,

            updatedAt:
              new Date().toISOString(),
          },
        },
        {
          merge: true,
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Firebase save error:",
        error
      );

      alert(
        "Failed to save trading data."
      );

      return false;
    }
  };

  // =========================
  // SEARCH MARKET
  // =========================

  const handleSearch = async () => {
    const cleanSymbol =
      symbol.trim().toUpperCase();

    if (!cleanSymbol) {
      alert(
        "Please enter a symbol."
      );

      return;
    }

    try {
      setAiResult(null);
      setAiError("");

      setSearchedSymbol(
        cleanSymbol
      );

      await searchMarket(
        cleanSymbol
      );
    } catch (error) {
      console.error(
        "Market Search Error:",
        error
      );

      alert(
        "Unable to fetch market data."
      );
    }
  };

  // =========================
  // ADD TO WATCHLIST
  // =========================

  const handleAddWatchlist =
    async () => {
      if (!searchedSymbol) {
        return;
      }

      try {
        await addToWatchlist({
          symbol:
            searchedSymbol,

          market:
            market,

          name:
            company?.name ||
            searchedSymbol,
        });

        alert(
          "⭐ Added to Watchlist"
        );
      } catch (error) {
        console.error(
          "Watchlist Error:",
          error
        );

        alert(
          error.message ||
            "Failed to add to watchlist."
        );
      }
    };

  // =========================
  // BUY STOCK
  // =========================

  const handleBuy = async () => {
    if (!stock) {
      return;
    }

    const user =
      auth.currentUser;

    if (!user) {
      alert(
        "Please login to use Paper Trading."
      );

      return;
    }

    const qty =
      Number(quantity);

    if (
      !Number.isFinite(qty) ||
      qty <= 0
    ) {
      alert(
        "Please enter a valid quantity."
      );

      return;
    }

    const stockSymbol =
      searchedSymbol;

    const currentPrice =
      Number(stock.current);

    if (
      !Number.isFinite(
        currentPrice
      ) ||
      currentPrice <= 0
    ) {
      alert(
        "Invalid market price."
      );

      return;
    }

    const totalCost =
      currentPrice * qty;

    if (
      totalCost > balance
    ) {
      alert(
        "❌ Insufficient virtual balance."
      );

      return;
    }

    setSaving(true);

    try {
      const existing =
        portfolio[
          stockSymbol
        ];

      const existingQuantity =
        Number(
          existing?.quantity || 0
        );

      const existingBuyPrice =
        Number(
          existing?.buyPrice || 0
        );

      const totalExistingValue =
        existingQuantity *
        existingBuyPrice;

      const totalNewValue =
        qty *
        currentPrice;

      const totalQuantity =
        existingQuantity +
        qty;

      const averageBuyPrice =
        totalQuantity > 0
          ? (
              totalExistingValue +
              totalNewValue
            ) /
            totalQuantity
          : currentPrice;

      const newBalance =
        balance -
        totalCost;

      const newPortfolio = {
        ...portfolio,

        [stockSymbol]: {
          symbol:
            stockSymbol,

          market:
            market,

          quantity:
            totalQuantity,

          buyPrice:
            averageBuyPrice,

          currentPrice:
            currentPrice,

          updatedAt:
            new Date().toISOString(),
        },
      };

      const saved =
        await savePaperTradingData(
          newBalance,
          newPortfolio
        );

      if (!saved) {
        return;
      }

      setBalance(
        newBalance
      );

      setPortfolio(
        newPortfolio
      );

      alert(
        `✅ BUY Successful!\n\n${qty} ${stockSymbol} bought.`
      );
    } catch (error) {
      console.error(
        "BUY Error:",
        error
      );

      alert(
        "BUY order failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SELL STOCK
  // =========================

  const handleSell = async () => {
    if (!stock) {
      return;
    }

    const user =
      auth.currentUser;

    if (!user) {
      alert(
        "Please login to use Paper Trading."
      );

      return;
    }

    const qty =
      Number(quantity);

    if (
      !Number.isFinite(qty) ||
      qty <= 0
    ) {
      alert(
        "Please enter a valid quantity."
      );

      return;
    }

    const stockSymbol =
      searchedSymbol;

    const existing =
      portfolio[
        stockSymbol
      ];

    const ownedQuantity =
      Number(
        existing?.quantity || 0
      );

    if (
      ownedQuantity <= 0
    ) {
      alert(
        `❌ You don't own any ${stockSymbol}.`
      );

      return;
    }

    if (
      qty > ownedQuantity
    ) {
      alert(
        `❌ You only own ${ownedQuantity} units.`
      );

      return;
    }

    setSaving(true);

    try {
      const currentPrice =
        Number(stock.current);

      const totalValue =
        currentPrice * qty;

      const remainingQuantity =
        ownedQuantity - qty;

      const newBalance =
        balance +
        totalValue;

      const newPortfolio = {
        ...portfolio,
      };

      if (
        remainingQuantity === 0
      ) {
        delete newPortfolio[
          stockSymbol
        ];
      } else {
        newPortfolio[
          stockSymbol
        ] = {
          ...existing,

          quantity:
            remainingQuantity,

          currentPrice:
            currentPrice,

          updatedAt:
            new Date().toISOString(),
        };
      }

      const saved =
        await savePaperTradingData(
          newBalance,
          newPortfolio
        );

      if (!saved) {
        return;
      }

      setBalance(
        newBalance
      );

      setPortfolio(
        newPortfolio
      );

      alert(
        `✅ SELL Successful!\n\n${qty} ${stockSymbol} sold.`
      );
    } catch (error) {
      console.error(
        "SELL Error:",
        error
      );

      alert(
        "SELL order failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CURRENT HOLDING
  // =========================

  const ownedQuantity =
    portfolio[
      searchedSymbol
    ]?.quantity || 0;

  // =========================
  // TRADINGVIEW SYMBOL
  // =========================

  const tradingViewSymbol =
    searchedSymbol
      ? getTradingViewSymbol(
          searchedSymbol
        )
      : "";

  // =========================
  // SAFE NUMBER FORMAT
  // =========================

  const formatPrice = (
    value
  ) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(
        Number(value)
      )
    ) {
      return "N/A";
    }

    return Number(value).toFixed(
      2
    );
  };

  // =========================
  // RETURN
  // =========================

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

      {/* =========================
          SEARCH
      ========================= */}

      <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl">

        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-black text-yellow-400 uppercase tracking-widest">
            AI Market Scanner
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 tracking-tight">
            AI Market Search
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Search Stocks, Crypto, and Forex markets with real-time institutional intelligence.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row">

          <input
            value={symbol}
            onChange={(e) =>
              setSymbol(
                e.target.value.toUpperCase()
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                handleSearch();
              }
            }}
            placeholder="Example: AAPL, BTC, EURUSD"
            className="flex-1 rounded-2xl border border-yellow-500/25 bg-zinc-900/90 px-5 py-4 text-sm sm:text-base font-semibold text-white placeholder:text-zinc-500 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/15"
          />

          <button
            type="button"
            onClick={
              handleSearch
            }
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 hover:bg-yellow-500 px-8 py-4 font-black text-xs sm:text-sm uppercase tracking-wider text-black transition shadow-xl shadow-yellow-400/20 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Search size={18} />

            {loading
              ? "Searching..."
              : "Search Market"}
          </button>

        </div>

        {/* Loading */}

        {loading && (
          <div className="mt-10 text-center py-8">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent shadow-lg" />
            <p className="mt-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-zinc-400 animate-pulse">
              Fetching live market data...
            </p>
          </div>
        )}

        {/* Stock Data */}

        {!loading &&
          stock && (

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Current Price
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-green-400 tracking-tight">
                  {formatPrice(
                    stock.current
                  )}
                </h3>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Day High
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {formatPrice(
                    stock.high
                  )}
                </h3>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Day Low
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {formatPrice(
                    stock.low
                  )}
                </h3>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Previous Close
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {formatPrice(
                    stock.previousClose
                  )}
                </h3>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Open
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {formatPrice(
                    stock.open
                  )}
                </h3>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  % Change
                </p>
                <h3
                  className={`mt-2 text-2xl sm:text-3xl font-black tracking-tight ${
                    Number(
                      stock.percent
                    ) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPrice(
                    stock.percent
                  )}
                  %
                </h3>
              </div>

            </div>

          )}

      </div>

      {/* =========================
          COMPANY INFO
      ========================= */}

      {company && (

        <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl">

          <div className="flex flex-col items-center gap-6 md:flex-row">

            {company.logo && (
              <img
                src={company.logo}
                alt={
                  company.name ||
                  searchedSymbol
                }
                className="h-20 w-20 rounded-2xl bg-white p-2.5 object-contain shadow-xl"
              />
            )}

            <div className="text-center md:text-left space-y-2 flex-1">
              <h3 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-tight">
                {company.name ||
                  searchedSymbol}
              </h3>

              <p className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest">
                {company.ticker ||
                  searchedSymbol}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm pt-4 border-t border-white/5">

                <div className="bg-zinc-900/50 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-zinc-500 font-bold block uppercase text-[10px]">
                    Exchange
                  </span>
                  <p className="font-black text-white mt-1">
                    {company.exchange ||
                      "N/A"}
                  </p>
                </div>

                <div className="bg-zinc-900/50 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-zinc-500 font-bold block uppercase text-[10px]">
                    Country
                  </span>
                  <p className="font-black text-white mt-1">
                    {company.country ||
                      "N/A"}
                  </p>
                </div>

                <div className="bg-zinc-900/50 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-zinc-500 font-bold block uppercase text-[10px]">
                    Currency
                  </span>
                  <p className="font-black text-white mt-1">
                    {company.currency ||
                      "N/A"}
                  </p>
                </div>

                <div className="bg-zinc-900/50 p-3.5 rounded-2xl border border-white/5">
                  <span className="text-zinc-500 font-bold block uppercase text-[10px]">
                    Market
                  </span>
                  <p className="font-black text-yellow-400 mt-1 uppercase">
                    {market ||
                      "N/A"}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          WATCHLIST
      ========================= */}

      {stock && (

        <div className="flex justify-center">

          <button
            type="button"
            onClick={
              handleAddWatchlist
            }
            className="rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-yellow-500/30 px-8 py-4 font-black text-xs sm:text-sm uppercase tracking-wider text-yellow-400 transition shadow-xl active:scale-95 cursor-pointer"
          >
            ⭐ Add to Watchlist
          </button>

        </div>

      )}

      {/* =========================
          PAPER TRADING
      ========================= */}

      {stock && (

        <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl">

          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-black text-yellow-400 uppercase tracking-widest">
              Simulator
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-tight">
              📄 Paper Trading
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">
              Practice professional strategies with virtual risk-free capital.
            </p>
          </div>

          {/* Balance */}

          <div className="mt-8 rounded-2xl border border-green-500/25 bg-zinc-900/90 p-5 sm:p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Virtual Balance
            </p>

            <h3 className="mt-2 text-2xl sm:text-3xl font-black text-green-400 tracking-tight">
              ₹
              {Number(
                balance
              ).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                }
              )}
            </h3>
          </div>

          {/* Stock Info */}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Trading Asset
              </p>
              <h4 className="mt-1 text-lg font-black text-white">
                {searchedSymbol}
              </h4>
              <p className="mt-0.5 text-xs font-bold text-yellow-400 uppercase">
                Market: {market}
              </p>
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Current Holdings
              </p>
              <h4 className="mt-1 text-lg font-black text-yellow-400">
                {ownedQuantity} Units
              </h4>
            </div>
          </div>

          {/* Quantity */}

          <div className="mt-6 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-yellow-500/25 bg-zinc-900 px-5 py-4 text-white text-sm sm:text-base font-semibold outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/15"
            />
          </div>

          {/* Order Value */}

          <div className="mt-6 bg-zinc-900/80 p-5 rounded-2xl border border-yellow-500/20">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Order Value
            </p>

            <h3 className="mt-1 text-xl sm:text-2xl font-black text-white tracking-tight">
              ₹
              {(
                Number(
                  stock.current ||
                    0
                ) *
                Number(
                  quantity || 0
                )
              ).toFixed(2)}
            </h3>
          </div>

          {/* Buttons */}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <button
              type="button"
              onClick={
                handleBuy
              }
              disabled={saving}
              className="rounded-2xl bg-green-500 hover:bg-green-400 py-4 font-black text-xs sm:text-sm uppercase tracking-wider text-black transition shadow-xl shadow-green-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {saving
                ? "Processing..."
                : "🟢 BUY POSITION"}
            </button>

            <button
              type="button"
              onClick={
                handleSell
              }
              disabled={
                saving ||
                ownedQuantity <= 0
              }
              className="rounded-2xl bg-red-600 hover:bg-red-500 py-4 font-black text-xs sm:text-sm uppercase tracking-wider text-white transition shadow-xl shadow-red-600/20 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
            >
              {saving
                ? "Processing..."
                : "🔴 SELL POSITION"}
            </button>

          </div>

        </div>

      )}

      {/* =========================
          AI ANALYSIS
      ========================= */}

      {stock && (

        <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl">

          <div className="mb-8 space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-black text-yellow-400 uppercase tracking-widest">
              Neural Engine
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-tight">
              🤖 AI Market Analysis
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">
              Advanced institutional algorithmic indicators and risk matrix.
            </p>
          </div>

          {/* TradingView */}

          {tradingViewSymbol && (
            <div className="rounded-2xl overflow-hidden border border-yellow-500/20 shadow-2xl bg-black mb-8">
              <TradingViewChart
                symbol={
                  tradingViewSymbol
                }
              />
            </div>
          )}

          {/* AI Loading */}

          {aiLoading && (

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-8 text-center backdrop-blur-xl">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent shadow-lg" />
              <p className="mt-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-zinc-400 animate-pulse">
                AI is analyzing market indicators...
              </p>
            </div>

          )}

          {/* AI Error */}

          {!aiLoading &&
            aiError && (

              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center backdrop-blur-xl">
                <p className="font-bold text-red-400 text-xs sm:text-sm">
                  {aiError}
                </p>
              </div>

            )}

          {/* AI RESULT */}

          {!aiLoading &&
            !aiError &&
            aiResult && (

              <div className="grid gap-8 lg:grid-cols-2">

                {/* SIGNAL & LEVELS */}

                <div className="space-y-6">

                  <div className="rounded-2xl border border-yellow-500/25 bg-zinc-900/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
                    <h4
                      className={`text-3xl sm:text-4xl font-black tracking-tight ${
                        aiResult.signal ===
                        "BUY"
                          ? "text-green-400"
                          : aiResult.signal ===
                              "SELL"
                            ? "text-red-400"
                            : "text-yellow-400"
                      }`}
                    >
                      {aiResult.signal ||
                        "HOLD"}
                    </h4>

                    <div className="pt-2 border-t border-white/5 space-y-2 text-xs sm:text-sm font-semibold text-zinc-300">
                      <p className="flex justify-between">
                        <span className="text-zinc-400">Confidence Score:</span>
                        <span className="font-black text-green-400">
                          {aiResult?.confidence || 0}%
                        </span>
                      </p>

                      <p className="flex justify-between">
                        <span className="text-zinc-400">Risk Assessment:</span>
                        <span className="font-black text-yellow-400">
                          {aiResult.risk || "-"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* LEVELS */}

                  <div className="rounded-2xl border border-yellow-500/25 bg-zinc-900/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
                    <h4 className="text-lg font-black text-yellow-400 tracking-tight">
                      AI Key Levels & Indicators
                    </h4>

                    <div className="space-y-3 text-xs sm:text-sm font-semibold text-zinc-300">
                      <p className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-zinc-400">📍 Support:</span>
                        <span className="font-black text-green-400">
                          {aiResult.support ??
                            "N/A"}
                        </span>
                      </p>

                      <p className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-zinc-400">📍 Resistance:</span>
                        <span className="font-black text-red-400">
                          {aiResult.resistance ??
                            "N/A"}
                        </span>
                      </p>

                      <p className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-zinc-400">🎯 Target:</span>
                        <span className="font-black text-yellow-400">
                          {aiResult.target ??
                            "N/A"}
                        </span>
                      </p>

                      <p className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-zinc-400">🛑 Stop Loss:</span>
                        <span className="font-black text-orange-400">
                          {aiResult.stopLoss ??
                            "N/A"}
                        </span>
                      </p>

                      <p className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-zinc-400">📊 RSI (14):</span>
                        <span className="font-black text-cyan-400">
                          {aiResult.rsi !==
                            undefined
                            ? Number(
                                aiResult.rsi
                              ).toFixed(
                                2
                              )
                            : "N/A"}
                        </span>
                      </p>

                      <p className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-zinc-400">📈 EMA 20:</span>
                        <span className="font-black text-blue-400">
                          {aiResult.ema20 !==
                            undefined
                            ? Number(
                                aiResult.ema20
                              ).toFixed(
                                2
                              )
                            : "N/A"}
                        </span>
                      </p>

                      <p className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-zinc-400">📉 EMA 50:</span>
                        <span className="font-black text-purple-400">
                          {aiResult.ema50 !==
                            undefined
                            ? Number(
                                aiResult.ema50
                              ).toFixed(
                                2
                              )
                            : "N/A"}
                        </span>
                      </p>

                      <p className="flex justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-zinc-400">⚡ MACD Signal:</span>
                        <span className="font-black text-pink-400 uppercase">
                          {aiResult.macd
                            ?.signal ||
                            "N/A"}
                        </span>
                      </p>

                    </div>

                  </div>

                </div>

                {/* REASONS */}

                <div>

                  <div className="rounded-2xl border border-yellow-500/25 bg-zinc-900/90 p-6 backdrop-blur-xl shadow-xl h-full space-y-4">
                    <h4 className="text-lg font-black text-yellow-400 tracking-tight">
                      AI Technical Rationale
                    </h4>

                    {aiResult.reasons
                      ?.length > 0 ? (

                      <ul className="space-y-3.5 text-xs sm:text-sm font-medium text-zinc-300">
                        {aiResult.reasons.map(
                          (
                            reason,
                            index
                          ) => (

                            <li
                              key={
                                index
                              }
                              className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 leading-relaxed"
                            >
                              <span className="text-yellow-400 shrink-0 font-black">✅</span>
                              <span>{reason}</span>
                            </li>

                          )
                        )}
                      </ul>

                    ) : (

                      <p className="text-xs text-zinc-500 font-semibold">
                        No detailed reasons available.
                      </p>

                    )}

                  </div>

                </div>

              </div>

            )}

        </div>

      )}

    </div>
  );
}