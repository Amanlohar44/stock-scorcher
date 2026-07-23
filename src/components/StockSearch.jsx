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
    <div className="w-full max-w-[1600px] mx-auto">

      {/* =========================
          SEARCH
      ========================= */}

      <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 shadow-2xl md:p-10">

        <h2 className="text-center text-3xl font-bold text-yellow-400">
          AI Market Search
        </h2>

        <p className="mt-3 text-center text-gray-400">
          Search Stocks, Crypto and Forex markets.
        </p>

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
            className="flex-1 rounded-xl border border-zinc-700 bg-black px-5 py-4 text-lg outline-none transition focus:border-yellow-400"
          />

          <button
            onClick={
              handleSearch
            }
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
          >
            <Search size={20} />

            {loading
              ? "Searching..."
              : "Search"}
          </button>

        </div>

        {/* Loading */}

        {loading && (
          <div className="mt-10 text-center">

            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />

            <p className="mt-4 text-gray-400">
              Fetching live market data...
            </p>

          </div>
        )}

        {/* Stock Data */}

        {!loading &&
          stock && (

            <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-3">

              <div className="rounded-2xl border border-yellow-500/20 bg-black p-6">

                <p className="text-sm text-gray-400">
                  Current Price
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-400">
                  {formatPrice(
                    stock.current
                  )}
                </h2>

              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-black p-6">

                <p className="text-sm text-gray-400">
                  Day High
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {formatPrice(
                    stock.high
                  )}
                </h2>

              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-black p-6">

                <p className="text-sm text-gray-400">
                  Day Low
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {formatPrice(
                    stock.low
                  )}
                </h2>

              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-black p-6">

                <p className="text-sm text-gray-400">
                  Previous Close
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {formatPrice(
                    stock.previousClose
                  )}
                </h2>

              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-black p-6">

                <p className="text-sm text-gray-400">
                  Open
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {formatPrice(
                    stock.open
                  )}
                </h2>

              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-black p-6">

                <p className="text-sm text-gray-400">
                  % Change
                </p>

                <h2
                  className={`mt-2 text-3xl font-bold ${
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
                </h2>

              </div>

            </div>

          )}

      </div>

      {/* =========================
          COMPANY INFO
      ========================= */}

      {company && (

        <div className="mt-10 rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 md:p-8">

          <div className="flex flex-col items-center gap-6 md:flex-row">

            {company.logo && (
              <img
                src={company.logo}
                alt={
                  company.name ||
                  searchedSymbol
                }
                className="h-20 w-20 rounded-full bg-white p-2 object-contain"
              />
            )}

            <div className="text-center md:text-left">

              <h2 className="text-3xl font-bold text-yellow-400">
                {company.name ||
                  searchedSymbol}
              </h2>

              <p className="mt-2 text-gray-400">
                {company.ticker ||
                  searchedSymbol}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

                <div>
                  <span className="text-gray-500">
                    Exchange
                  </span>

                  <p className="font-semibold">
                    {company.exchange ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">
                    Country
                  </span>

                  <p className="font-semibold">
                    {company.country ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">
                    Currency
                  </span>

                  <p className="font-semibold">
                    {company.currency ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">
                    Market
                  </span>

                  <p className="font-semibold text-yellow-400">
                    {market?.toUpperCase() ||
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

        <div className="mt-6 flex justify-center">

          <button
            onClick={
              handleAddWatchlist
            }
            className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
          >
            ⭐ Add to Watchlist
          </button>

        </div>

      )}

      {/* =========================
          PAPER TRADING
      ========================= */}

      {stock && (

        <div className="mt-10 rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 md:p-8">

          <h2 className="text-3xl font-bold text-yellow-400">
            📄 Paper Trading
          </h2>

          <p className="mt-2 text-gray-400">
            Practice trading with virtual money.
          </p>

          {/* Balance */}

          <div className="mt-6 rounded-2xl border border-green-500/20 bg-black p-5">

            <p className="text-gray-400">
              Virtual Balance
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-400">
              ₹
              {Number(
                balance
              ).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                }
              )}
            </h2>

          </div>

          {/* Stock */}

          <div className="mt-6">

            <p className="text-gray-400">
              Trading Asset
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              {searchedSymbol}
            </h3>

            <p className="mt-1 text-sm text-yellow-400">
              Market:{" "}
              {market?.toUpperCase()}
            </p>

          </div>

          {/* Owned */}

          <div className="mt-5">

            <p className="text-gray-400">
              You Own
            </p>

            <h3 className="mt-1 text-xl font-bold text-yellow-400">
              {ownedQuantity} Units
            </h3>

          </div>

          {/* Quantity */}

          <div className="mt-6">

            <label className="text-gray-400">
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
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none focus:border-yellow-400"
            />

          </div>

          {/* Order Value */}

          <div className="mt-5">

            <p className="text-gray-400">
              Order Value
            </p>

            <h3 className="mt-1 text-2xl font-bold">
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

          <div className="mt-8 grid grid-cols-2 gap-4">

            <button
              onClick={
                handleBuy
              }
              disabled={saving}
              className="rounded-xl bg-green-500 py-4 font-bold text-black transition hover:bg-green-400 disabled:opacity-50"
            >
              {saving
                ? "Processing..."
                : "🟢 BUY"}
            </button>

            <button
              onClick={
                handleSell
              }
              disabled={
                saving ||
                ownedQuantity <= 0
              }
              className="rounded-xl bg-red-500 py-4 font-bold text-white transition hover:bg-red-400 disabled:bg-zinc-700 disabled:text-gray-500"
            >
              {saving
                ? "Processing..."
                : "🔴 SELL"}
            </button>

          </div>

        </div>

      )}

      {/* =========================
          AI ANALYSIS
      ========================= */}

      {stock && (

        <div className="mt-10 rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 md:p-8">

          <h2 className="mb-8 text-3xl font-bold text-yellow-400">
            🤖 AI Market Analysis
          </h2>

          {/* TradingView */}

          {tradingViewSymbol && (
            <TradingViewChart
              symbol={
                tradingViewSymbol
              }
            />
          )}

          {/* AI Loading */}

          {aiLoading && (

            <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-black p-8 text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />

              <p className="mt-4 text-gray-400">
                AI is analyzing market data...
              </p>

            </div>

          )}

          {/* AI Error */}

          {!aiLoading &&
            aiError && (

              <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">

                <p className="font-semibold text-red-400">
                  {aiError}
                </p>

              </div>

            )}

          {/* AI RESULT */}

          {!aiLoading &&
            !aiError &&
            aiResult && (

              <div className="mt-8 grid gap-8 md:grid-cols-2">

                {/* SIGNAL */}

                <div>

                  <div className="rounded-2xl border border-yellow-500/20 bg-black p-6">

                    <h3
                      className={`text-4xl font-bold ${
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
                    </h3>

                    <p className="mt-4 text-gray-300">

                      Confidence:

                      <span className="font-bold text-green-400">
                        {" "}
                        {aiResult?.confidence || 0}%
                      </span>

                    </p>

                    <p className="mt-2 text-gray-300">

                      Risk:

                      <span className="font-bold text-yellow-400">
                        {" "}
                        {aiResult.risk ||
                          "-"}
                      </span>

                    </p>

                  </div>

                  {/* LEVELS */}

                  <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-black p-6">

                    <h3 className="mb-4 text-xl font-bold text-yellow-400">
                      AI Levels
                    </h3>

                    <div className="space-y-3 text-gray-300">

                      <p>
                        📍 Support:{" "}
                        <span className="text-green-400">
                          {aiResult.support ??
                            "N/A"}
                        </span>
                      </p>

                      <p>
                        📍 Resistance:{" "}
                        <span className="text-red-400">
                          {aiResult.resistance ??
                            "N/A"}
                        </span>
                      </p>

                      <p>
                        🎯 Target:{" "}
                        <span className="text-yellow-400">
                          {aiResult.target ??
                            "N/A"}
                        </span>
                      </p>

                      <p>
                        🛑 Stop Loss:{" "}
                        <span className="text-orange-400">
                          {aiResult.stopLoss ??
                            "N/A"}
                        </span>
                      </p>

                      <p>
                        📊 RSI:{" "}
                        <span className="text-cyan-400">
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

                      <p>
                        📈 EMA20:{" "}
                        <span className="text-blue-400">
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

                      <p>
                        📉 EMA50:{" "}
                        <span className="text-purple-400">
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

                      <p>
                        ⚡ MACD:{" "}
                        <span className="text-pink-400">
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

                  <div className="rounded-2xl border border-yellow-500/20 bg-black p-6">

                    <h3 className="mb-4 text-xl font-bold text-yellow-400">
                      AI Reasons
                    </h3>

                    {aiResult.reasons
                      ?.length > 0 ? (

                      <ul className="space-y-3 text-gray-300">

                        {aiResult.reasons.map(
                          (
                            reason,
                            index
                          ) => (

                            <li
                              key={
                                index
                              }
                              className="leading-6"
                            >
                              ✅{" "}
                              {reason}
                            </li>

                          )
                        )}

                      </ul>

                    ) : (

                      <p className="text-gray-500">
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