import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPlay,
  FaRobot,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";

import hero from "../assets/hero.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0">

        <div className="absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-yellow-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 h-[550px] w-[550px] rounded-full bg-blue-600/10 blur-[180px]" />

        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/5 blur-[120px]" />

      </div>

      {/* ================= LIVE MARKET TICKER ================= */}

      <div className="relative border-b border-zinc-800 bg-black/70 backdrop-blur-xl">

        <div className="overflow-hidden whitespace-nowrap py-3">

          <div className="inline-flex min-w-full animate-[ticker_30s_linear_infinite] gap-14 px-10 text-sm font-semibold">

            <span className="text-green-400">
              🇮🇳 NIFTY ▲ +1.28%
            </span>

            <span className="text-green-400">
              🇮🇳 SENSEX ▲ +0.94%
            </span>

            <span className="text-orange-400">
              ₿ BTC ▲ +3.11%
            </span>

            <span className="text-cyan-400">
              Ξ ETH ▲ +2.42%
            </span>

            <span className="text-blue-400">
              💱 EUR/USD +0.28%
            </span>

            <span className="text-pink-400">
              🤖 AI Accuracy 94.8%
            </span>

            <span className="text-yellow-400">
              📈 Live Global Market Scanner
            </span>

          </div>

        </div>

      </div>

      {/* ================= HERO ================= */}

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 pt-20 pb-12 lg:flex-row">

        {/* ================= LEFT ================= */}

        <div className="flex-1">

          <div className="inline-flex items-center gap-3 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2">

            <FaRobot className="text-yellow-400" />

            <span className="text-sm font-semibold text-yellow-300">

              India's AI Powered Trading Platform

            </span>

          </div>

          <h1 className="mt-8 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">

            Trade Smarter

            <span className="mt-2 block text-yellow-400">

              Stocks • Crypto • Forex

            </span>

            <span className="mt-2 block">

              Using Artificial Intelligence

            </span>

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">

            Learn professional trading, AI stock analysis,
            portfolio management, live market insights and
            paper trading inside one premium ecosystem.

          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <Link
              to="/membership"
              className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 font-bold text-black transition hover:scale-105"
            >
              Become Premium

              <FaArrowRight />
            </Link>

            <Link
              to="/stock-analysis"
              className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-yellow-500 px-8 font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
            >
              <FaPlay />

              Try AI Analysis
            </Link>

          </div>

          {/* Tags */}

          <div className="mt-8 flex flex-wrap gap-3">

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm">
              📈 Stocks
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm">
              ₿ Crypto
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm">
              💱 Forex
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm">
              🤖 AI Signals
            </span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm">
              🧠 AI Mentor
            </span>

          </div>

                  </div>

        {/* ================= RIGHT ================= */}

        <div className="relative flex flex-1 items-center justify-center">

          {/* Glow */}

          <div className="absolute h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-[170px]" />

          <div className="absolute h-[420px] w-[420px] rounded-full bg-yellow-500/10 blur-[130px]" />

          {/* Hero Image */}

          <img
            src={hero}
            alt="Stock Scorcher"
            className="relative z-20 w-[280px] object-contain transition duration-500 hover:scale-105 sm:w-[420px] lg:w-[560px]"
          />

          {/* AI BUY */}

          <div className="absolute left-0 top-20 hidden w-60 rounded-3xl border border-green-500/20 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-xl lg:block">

            <p className="text-xs uppercase tracking-widest text-zinc-400">
              AI Signal
            </p>

            <h2 className="mt-2 text-4xl font-black text-green-400">
              BUY
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Confidence Score
            </p>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-800">

              <div className="h-full w-[94%] rounded-full bg-green-400"></div>

            </div>

            <p className="mt-2 font-bold text-green-400">
              94%
            </p>

          </div>

          {/* Profit Card */}

          <div className="absolute bottom-16 right-0 hidden w-64 rounded-3xl border border-yellow-500/20 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-xl lg:block">

            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Today's Profit
            </p>

            <h2 className="mt-2 text-4xl font-black text-yellow-400">
              +18.42%
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Paper Trading Portfolio
            </p>

          </div>

          {/* AI Analysis */}

          <div className="absolute right-10 top-6 hidden w-56 rounded-3xl border border-blue-500/20 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-xl xl:block">

            <p className="text-xs uppercase tracking-widest text-zinc-400">
              AI Analysis
            </p>

            <div className="mt-4 flex justify-between">

              <span className="text-zinc-400">
                Trend
              </span>

              <span className="font-bold text-green-400">
                Bullish
              </span>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-zinc-400">
                Risk
              </span>

              <span className="font-bold text-yellow-400">
                Medium
              </span>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-zinc-400">
                Target
              </span>

              <span className="font-bold text-blue-400">
                +12%
              </span>

            </div>

          </div>

        </div>

      </div>

            {/* ================= MOBILE PREMIUM CARDS ================= */}

      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-4 px-6 lg:hidden">

        <div className="rounded-3xl border border-green-500/20 bg-zinc-900/90 p-5 backdrop-blur-xl">

          <p className="text-xs uppercase tracking-widest text-zinc-400">
            AI Signal
          </p>

          <h3 className="mt-2 text-3xl font-black text-green-400">
            BUY
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Confidence 94%
          </p>

        </div>

        <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900/90 p-5 backdrop-blur-xl">

          <p className="text-xs uppercase tracking-widest text-zinc-400">
            Today Profit
          </p>

          <h3 className="mt-2 text-3xl font-black text-yellow-400">
            +18.42%
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Paper Trading
          </p>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-5 px-6 md:grid-cols-4">

        <div className="rounded-3xl border border-yellow-500/10 bg-zinc-900/70 p-6 text-center backdrop-blur-xl">

          <FaUsers className="mx-auto mb-4 text-3xl text-yellow-400" />

          <h2 className="text-4xl font-black text-yellow-400">
            10K+
          </h2>

          <p className="mt-2 text-zinc-400">
            Active Traders
          </p>

        </div>

        <div className="rounded-3xl border border-green-500/10 bg-zinc-900/70 p-6 text-center backdrop-blur-xl">

          <FaChartLine className="mx-auto mb-4 text-3xl text-green-400" />

          <h2 className="text-4xl font-black text-green-400">
            94%
          </h2>

          <p className="mt-2 text-zinc-400">
            AI Accuracy
          </p>

        </div>

        <div className="rounded-3xl border border-blue-500/10 bg-zinc-900/70 p-6 text-center backdrop-blur-xl">

          <FaRobot className="mx-auto mb-4 text-3xl text-blue-400" />

          <h2 className="text-4xl font-black text-blue-400">
            24/7
          </h2>

          <p className="mt-2 text-zinc-400">
            AI Support
          </p>

        </div>

        <div className="rounded-3xl border border-purple-500/10 bg-zinc-900/70 p-6 text-center backdrop-blur-xl">

          <FaShieldAlt className="mx-auto mb-4 text-3xl text-purple-400" />

          <h2 className="text-4xl font-black text-purple-400">
            100%
          </h2>

          <p className="mt-2 text-zinc-400">
            Secure Platform
          </p>

        </div>

      </div>

      {/* ================= FOUNDER ================= */}

      <div className="mx-auto mt-14 flex justify-center px-6">

        <div className="rounded-full border border-yellow-500/20 bg-zinc-900/80 px-8 py-4 backdrop-blur-xl">

          <span className="font-bold text-yellow-400">
            👑 Founded by Aman Lohar
          </span>

        </div>

      </div>

            {/* ================= BOTTOM FADE ================= */}

      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-black via-black/90 to-transparent"></div>

    </section>
  );
}