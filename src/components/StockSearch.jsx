import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import useMarketSearch from "../hooks/useMarketSearch";
import TradingViewChart from "./TradingViewChart";
import getTradingViewSymbol from "../utils/getTradingViewSymbol";
import marketDetector from "../utils/marketDetector";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { addToWatchlist } from "../services/watchlist";
import { generateAIAnalysis } from "../ai/analysis";
import { getHistoricalPrices } from "../services/historyService";

export default function StockSearch() {
  const [symbol, setSymbol] = useState("");
const {
  loading,
  stock,
  company,
  searchMarket,
} = useMarketSearch();

  // =========================
  // PAPER TRADING
  // =========================

  const [quantity, setQuantity] = useState(1);

  const [balance, setBalance] = useState(100000);

  const [portfolio, setPortfolio] = useState({});

  const [saving, setSaving] = useState(false);

  // Current market
  // Future ready for:
  // stock
  // crypto
  // forex

  const market = marketDetector(symbol);
  const [aiResult, setAiResult] = useState(null);

  // =========================
  // FIREBASE USER DATA
  // =========================

  useEffect(() => {
    loadPaperTradingData();
  }, []);

 useEffect(() => {
  async function loadAI() {
    if (!stock || !symbol) return;

    try {
      const prices = await getHistoricalPrices(symbol);

      const result = generateAIAnalysis(prices);

      setAiResult(result);

    } catch (err) {
      console.log(err);
    }
  }

  loadAI();

}, [stock, symbol]);

  const loadPaperTradingData = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log("User not logged in");
        return;
      }

      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        if (data.paperTrading) {
          setBalance(
            data.paperTrading.balance ?? 100000
          );

          setPortfolio(
            data.paperTrading.portfolio ?? {}
          );
        }
      }
    } catch (error) {
      console.log(
        "Failed to load paper trading data:",
        error
      );
    }
  };

  // =========================
  // SAVE FIREBASE DATA
  // =========================

  const savePaperTradingData = async (
    newBalance,
    newPortfolio
  ) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Please login first");
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
            portfolio: newPortfolio,
            updatedAt: new Date().toISOString(),
          },
        },
        {
          merge: true,
        }
      );

      return true;

    } catch (error) {
      console.log(
        "Firebase save error:",
        error
      );

      alert(
        "Failed to save trading data"
      );

      return false;
    }
  };

  // =========================
  // SEARCH STOCK
  // =========================

  const handleSearch = async () => {
  if (!symbol.trim()) {
    alert("Please enter a symbol");
    return;
  }

  await searchMarket(symbol.trim().toUpperCase());
  try {
  const current = stock?.current || 100;

  const prices = [];

  for (let i = 60; i >= 0; i--) {
    prices.push(current - Math.random() * 20 + Math.random() * 20);
  }

  const result = generateAIAnalysis(prices);

  setAiResult(result);

} catch (err) {
  console.log(err);
}
};


  // =========================
  // BUY STOCK
  // =========================

  const handleBuy = async () => {
    if (!stock) return;

    const user = auth.currentUser;

    if (!user) {
      alert(
        "Please login to use Paper Trading"
      );
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      alert(
        "Please enter a valid quantity"
      );
      return;
    }

    const stockSymbol =
      symbol.trim().toUpperCase();

    const currentPrice =
      Number(stock.current);

    const totalCost =
      currentPrice * qty;

    // Check Balance

    if (totalCost > balance) {
      alert(
        "❌ Insufficient virtual balance"
      );
      return;
    }

    setSaving(true);

    try {
      const existing =
        portfolio[stockSymbol];

      const existingQuantity =
        existing?.quantity || 0;

      const existingBuyPrice =
        existing?.buyPrice || 0;

      // Average Buy Price

      const totalExistingValue =
        existingQuantity *
        existingBuyPrice;

      const totalNewValue =
        qty * currentPrice;

      const totalQuantity =
        existingQuantity + qty;

      const averageBuyPrice =
        totalQuantity > 0
          ? (
              (totalExistingValue +
                totalNewValue) /
              totalQuantity
            )
          : currentPrice;

      const newBalance =
        balance - totalCost;

      const newPortfolio = {
        ...portfolio,

        [stockSymbol]: {
          symbol: stockSymbol,

          market,

          quantity: totalQuantity,

          buyPrice: averageBuyPrice,

          currentPrice: currentPrice,

          updatedAt:
            new Date().toISOString(),
        },
      };

      // Save Firebase

      const saved =
        await savePaperTradingData(
          newBalance,
          newPortfolio
        );

      if (!saved) {
        return;
      }

      // Update UI

      setBalance(newBalance);

      setPortfolio(
        newPortfolio
      );

      alert(
        `✅ BUY Successful!\n\n${qty} ${stockSymbol} shares bought.`
      );

    } catch (error) {
      console.log(error);

      alert(
        "BUY order failed"
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SELL STOCK
  // =========================

  const handleSell = async () => {
    if (!stock) return;

    const user = auth.currentUser;

    if (!user) {
      alert(
        "Please login to use Paper Trading"
      );
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      alert(
        "Please enter a valid quantity"
      );
      return;
    }

    const stockSymbol =
      symbol.trim().toUpperCase();

    const existing =
      portfolio[stockSymbol];

    const ownedQuantity =
      existing?.quantity || 0;

    // No Stock

    if (ownedQuantity <= 0) {
      alert(
        `❌ You don't own any ${stockSymbol} shares.`
      );
      return;
    }

    // Selling More Than Owned

    if (qty > ownedQuantity) {
      alert(
        `❌ You only own ${ownedQuantity} shares.`
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
        balance + totalValue;

      const newPortfolio = {
        ...portfolio,
      };

      // Remove Stock
      // If all shares sold

      if (remainingQuantity === 0) {
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

      // Save Firebase

      const saved =
        await savePaperTradingData(
          newBalance,
          newPortfolio
        );

      if (!saved) {
        return;
      }

      // Update UI

      setBalance(newBalance);

      setPortfolio(
        newPortfolio
      );

      alert(
        `✅ SELL Successful!\n\n${qty} ${stockSymbol} shares sold.`
      );

    } catch (error) {
      console.log(error);

      alert(
        "SELL order failed"
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CURRENT STOCK HOLDING
  // =========================

  const ownedQuantity =
    portfolio[
      symbol.trim().toUpperCase()
    ]?.quantity || 0;

  // =========================
  // RETURN
  // =========================

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6">

      {/* ========================= */}
      {/* SEARCH */}
      {/* ========================= */}

      <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 md:p-10 shadow-2xl">

        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          AI Stock Search
        </h2>

        <p className="text-center text-gray-400 mt-3">
          Search stocks and practice trading with virtual money.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-8">

          <input
            value={symbol}
            onChange={(e) =>
              setSymbol(
                e.target.value.toUpperCase()
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Example: AAPL"
            className="flex-1 bg-black border border-zinc-700 focus:border-yellow-400 rounded-xl px-5 py-4 outline-none text-lg"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-8 rounded-xl flex items-center justify-center gap-2"
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
              Fetching Live Market Data...
            </p>

          </div>
        )}

        {/* Stock Data */}

        {!loading && stock && (

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mt-10">

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Current Price
              </p>

              <h2 className="text-3xl font-bold text-green-400 mt-2">
                ${stock.current?.toFixed(2)}
              </h2>

            </div>

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Day High
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ${stock.high?.toFixed(2)}
              </h2>

            </div>

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Day Low
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ${stock.low?.toFixed(2)}
              </h2>

            </div>

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Previous Close
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ${stock.previousClose?.toFixed(2)}
              </h2>

            </div>

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Open
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ${stock.open?.toFixed(2)}
              </h2>

            </div>

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                % Change
              </p>

              <h2
                className={`text-3xl font-bold mt-2 ${
                  stock.percent >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {stock.percent?.toFixed(2)}%
              </h2>

            </div>

          </div>

        )}

      </div>

      {/* ========================= */}
      {/* COMPANY INFO */}
      {/* ========================= */}

      {company && (

        <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl mt-10 p-6 md:p-8">

          <div className="flex flex-col md:flex-row items-center gap-6">

            {company.logo && (
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 rounded-full bg-white p-2"
              />
            )}

            <div className="text-center md:text-left">

              <h2 className="text-3xl font-bold text-yellow-400">
                {company.name}
              </h2>

              <p className="text-gray-400 mt-2">
                {company.ticker}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-5 text-sm">

                <div>
                  <span className="text-gray-500">
                    Exchange
                  </span>

                  <p className="font-semibold">
                    {company.exchange || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">
                    Country
                  </span>

                  <p className="font-semibold">
                    {company.country || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">
                    Currency
                  </span>

                  <p className="font-semibold">
                    {company.currency || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">
                    IPO
                  </span>

                  <p className="font-semibold">
                    {company.ipo || "N/A"}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {stock && (
  <div className="mt-6 flex justify-center">
    <button
      onClick={async () => {
        try {
          await addToWatchlist({
            symbol: symbol.toUpperCase(),
            market: marketDetector(symbol),
            name: company?.name || symbol,
          });

          alert("⭐ Added to Watchlist");
        } catch (err) {
          alert(err.message);
        }
      }}
      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl"
    >
      ⭐ Add to Watchlist
    </button>
  </div>
)}

      {/* ========================= */}
      {/* PAPER TRADING */}
      {/* ========================= */}

      {stock && (

        <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl mt-10 p-6 md:p-8">

          <h2 className="text-3xl font-bold text-yellow-400">
            📄 Paper Trading
          </h2>

          <p className="text-gray-400 mt-2">
            Practice trading with virtual money.
          </p>

          {/* Balance */}

          <div className="mt-6 bg-black border border-green-500/20 rounded-2xl p-5">

            <p className="text-gray-400">
              Virtual Balance
            </p>

            <h2 className="text-3xl font-bold text-green-400 mt-2">
              ${balance.toFixed(2)}
            </h2>

          </div>

          {/* Stock */}

          <div className="mt-6">

            <p className="text-gray-400">
              Trading Stock
            </p>

            <h3 className="text-2xl font-bold text-white mt-1">
              {symbol.toUpperCase()}
            </h3>

            <p className="text-sm text-yellow-400 mt-1">
  Market: {market.toUpperCase()}
</p>

          </div>

          {/* Owned */}

          <div className="mt-5">

            <p className="text-gray-400">
              You Own
            </p>

            <h3 className="text-xl font-bold text-yellow-400 mt-1">
              {ownedQuantity} Shares
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
              className="w-full mt-2 bg-black border border-zinc-700 focus:border-yellow-400 rounded-xl px-5 py-4 outline-none text-white"
            />

          </div>

          {/* Order Value */}

          <div className="mt-5">

            <p className="text-gray-400">
              Order Value
            </p>

            <h3 className="text-2xl font-bold text-white mt-1">
              $
              {(
                (stock.current || 0) *
                Number(quantity || 0)
              ).toFixed(2)}
            </h3>

          </div>

          {/* Buttons */}

          <div className="grid grid-cols-2 gap-4 mt-8">

            <button
              onClick={handleBuy}
              disabled={saving}
              className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition"
            >
              {saving
                ? "Processing..."
                : "🟢 BUY"}
            </button>

            <button
              onClick={handleSell}
              disabled={
                saving ||
                ownedQuantity <= 0
              }
              className="bg-red-500 hover:bg-red-400 disabled:bg-zinc-700 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition"
            >
              {saving
                ? "Processing..."
                : "🔴 SELL"}
            </button>

          </div>

        </div>

      )}

      {/* ========================= */}
      {/* AI ANALYSIS */}
      {/* ========================= */}

      {stock && (

        <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl mt-10 p-8">

          <h2 className="text-3xl font-bold text-yellow-400 mb-8">
            🤖 AI Recommendation
          </h2>

          <TradingViewChart
  symbol={symbol}
/>

          <div className="grid md:grid-cols-2 gap-8 mt-8">

            <div>

              <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

                <h3
                  className={`text-4xl font-bold ${
                    stock.percent > 2
                      ? "text-green-400"
                      : stock.percent < -2
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {aiResult?.signal || "Loading..."}
                </h3>

                <p className="text-gray-300 mt-4">

                  Confidence:

                  <span className="text-green-400 font-bold">
                    {" "}
                    {aiResult?.confidence || 0}%
                    %
                  </span>

                </p>

                <p className="text-gray-300 mt-2">

                  Risk:

                  <span className="text-yellow-400 font-bold">
                    {" "}
                    {aiResult?.risk || "-"}
                  </span>

                </p>

              </div>

            </div>

            <div>

              <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

                <h3 className="text-xl font-bold text-yellow-400 mb-4">
                  AI Reasons
                </h3>

                <ul className="space-y-3 text-gray-300">
  {aiResult?.reasons?.map((reason, index) => (
    <li key={index}>
      ✅ {reason}
    </li>
  ))}
</ul>

              </div>
              <div className="mt-6 bg-black border border-yellow-500/20 rounded-2xl p-6">

  <h3 className="text-xl font-bold text-yellow-400 mb-4">
    AI Levels
  </h3>

  <div className="space-y-2 text-gray-300">

    <p>📍 Support: <span className="text-green-400">{aiResult?.support}</span></p>

    <p>📍 Resistance: <span className="text-red-400">{aiResult?.resistance}</span></p>

    <p>🎯 Target: <span className="text-yellow-400">{aiResult?.target}</span></p>

    <p>🛑 Stop Loss: <span className="text-orange-400">{aiResult?.stopLoss}</span></p>

    <p>📊 RSI: <span className="text-cyan-400">{aiResult?.rsi?.toFixed(2)}</span></p>

    <p>📈 EMA20: <span className="text-blue-400">{aiResult?.ema20?.toFixed(2)}</span></p>

    <p>📉 EMA50: <span className="text-purple-400">{aiResult?.ema50?.toFixed(2)}</span></p>

    <p>⚡ MACD: <span className="text-pink-400">{aiResult?.macd?.signal}</span></p>

  </div>

</div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}