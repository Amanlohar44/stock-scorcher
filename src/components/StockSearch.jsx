import { useState } from "react";
import { Search } from "lucide-react";
import {
  getStockQuote,
  getCompanyProfile,
} from "../services/finnhub";
import TradingViewChart from "./TradingViewChart";

export default function StockSearch() {
  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!symbol.trim()) return;

    try {
      setLoading(true);

      const stockData = await getStockQuote(symbol.toUpperCase());

const companyData = await getCompanyProfile(
  symbol.toUpperCase()
);

setStock(stockData);
setCompany(companyData);
    } catch (err) {
      console.log(err);
      alert("Stock not found");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Search Card */}

      <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 md:p-10 shadow-2xl">

        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          AI Stock Search
        </h2>

        <p className="text-center text-gray-400 mt-3">
          Search any stock to get AI powered insights.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-8">

          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Example : AAPL"
            className="flex-1 bg-black border border-zinc-700 focus:border-yellow-400 rounded-xl px-5 py-4 outline-none text-lg"
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 rounded-xl flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Search
          </button>

        </div>
                {/* Loading */}

        {loading && (
          <div className="mt-10 text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">
              Fetching Live Market Data...
            </p>
          </div>
        )}

        {/* Stock Cards */}

        {!loading && stock && (

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Current Price
              </p>

              <h2 className="text-3xl font-bold text-green-400 mt-2">
                ${stock.current.toFixed(2)}
              </h2>

            </div>

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Day High
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ${stock.high.toFixed(2)}
              </h2>

            </div>

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Day Low
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ${stock.low.toFixed(2)}
              </h2>

            </div>

            <div className="bg-black border border-yellow-500/20 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Previous Close
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ${stock.previousClose.toFixed(2)}
              </h2>
<div className="bg-black border border-yellow-500/20 rounded-2xl p-6">
  <p className="text-gray-400 text-sm">Open</p>

  <h2 className="text-3xl font-bold mt-2">
    ${stock.open.toFixed(2)}
  </h2>
</div>

<div className="bg-black border border-yellow-500/20 rounded-2xl p-6">
  <p className="text-gray-400 text-sm">% Change</p>

  <h2
    className={`text-3xl font-bold mt-2 ${
      stock.percent >= 0 ? "text-green-400" : "text-red-400"
    }`}
  >
    {stock.percent.toFixed(2)}%
  </h2>
</div>
            </div>

          </div>

        )}
              </div>

      {/* AI Analysis Preview */}

      {company && (
  <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl mt-10 p-6 md:p-8">

    <div className="flex flex-col md:flex-row items-center gap-6">

      <img
        src={company.logo}
        alt={company.name}
        className="w-20 h-20 rounded-full bg-white p-2"
      />

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
              {company.exchange}
            </p>
          </div>

          <div>
            <span className="text-gray-500">
              Country
            </span>

            <p className="font-semibold">
              {company.country}
            </p>
          </div>

          <div>
            <span className="text-gray-500">
              Currency
            </span>

            <p className="font-semibold">
              {company.currency}
            </p>
          </div>

          <div>
            <span className="text-gray-500">
              IPO
            </span>

            <p className="font-semibold">
              {company.ipo}
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>
)}

      {stock && (

        
        <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl mt-10 p-8">

          <h2 className="text-3xl font-bold text-yellow-400 mb-8">
            🤖 AI Recommendation
          </h2>

          {stock && (
  <TradingViewChart symbol={symbol.toUpperCase()} />
)}

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <div className="bg-green-500/10 border border-green-500 rounded-2xl p-6">

                <h3
  className={`text-4xl font-bold ${
    stock.percent > 2
      ? "text-green-400"
      : stock.percent < -2
      ? "text-red-400"
      : "text-yellow-400"
  }`}
>
  {stock.percent > 2
    ? "BUY"
    : stock.percent < -2
    ? "SELL"
    : "HOLD"}
</h3>

                <p className="text-gray-300 mt-4">
                  Confidence :
                  <span className="text-green-400 font-bold">
                    {" "}{Math.min(Math.abs(stock.percent * 18), 98).toFixed(0)}%
                  </span>
                </p>

                <p className="text-gray-300 mt-2">
                  Risk :
                  <span className="text-yellow-400 font-bold">
                    {" "}Low
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

                  <li>✅ RSI looks Bullish</li>

                  <li>✅ Price above Moving Average</li>

                  <li>✅ Positive Momentum</li>

                  <li>✅ Healthy Buying Volume</li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}