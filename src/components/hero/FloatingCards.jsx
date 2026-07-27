import React from "react";

export default function FloatingCards() {
  return (
    <>
      {/* 1. BUY CARD (Desktop) */}
      <div className="absolute left-0 top-16 hidden w-56 rounded-3xl border border-green-500/20 bg-[#060606]/90 p-5 shadow-2xl backdrop-blur-xl lg:block">
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          AI Signal
        </p>

        <h3 className="mt-2 text-4xl font-black text-green-400">
          BUY
        </h3>

        <p className="mt-2 text-sm text-zinc-400 font-light">
          Confidence
        </p>

        <div className="mt-3 h-2 rounded-full bg-zinc-800">
          <div className="h-full w-[94%] rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
        </div>

        <p className="mt-2 font-extrabold text-green-400 text-sm">
          94% Accuracy
        </p>
      </div>

      {/* 2. PROFIT CARD (Desktop) */}
      <div className="absolute bottom-16 right-0 hidden w-60 rounded-3xl border border-yellow-500/20 bg-[#060606]/90 p-5 shadow-2xl backdrop-blur-xl lg:block">
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          Today's Profit
        </p>

        <h3 className="mt-2 text-3xl font-black text-yellow-400">
          +18.42%
        </h3>

        <p className="mt-2 text-sm text-zinc-400 font-light">
          Paper Trading Portfolio
        </p>
      </div>

      {/* 3. AI ANALYSIS CARD (Desktop) */}
      <div className="absolute right-10 top-4 hidden w-52 rounded-3xl border border-blue-500/20 bg-[#060606]/90 p-5 shadow-2xl backdrop-blur-xl xl:block">
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
          AI Analysis
        </p>

        <div className="mt-4 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Trend</span>
            <span className="font-bold text-green-400">Bullish</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Risk</span>
            <span className="font-bold text-yellow-400">Medium</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Target</span>
            <span className="font-bold text-cyan-400">+12%</span>
          </div>
        </div>
      </div>

      {/* 4. MOBILE CARDS (Responsive Grid) */}
      <div className="absolute -bottom-24 left-0 right-0 grid grid-cols-2 gap-4 px-3 lg:hidden z-20">
        <div className="rounded-2xl border border-green-500/20 bg-[#060606]/95 p-4 backdrop-blur-xl shadow-lg">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400">
            AI Signal
          </p>
          <h3 className="mt-1 text-2xl font-black text-green-400">
            BUY
          </h3>
          <p className="text-[11px] text-zinc-500 font-light">
            Confidence 94%
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-500/20 bg-[#060606]/95 p-4 backdrop-blur-xl shadow-lg">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400">
            Today Profit
          </p>
          <h3 className="mt-1 text-xl font-black text-yellow-400">
            +18.42%
          </h3>
          <p className="text-[11px] text-zinc-500 font-light">
            Paper Trading
          </p>
        </div>
      </div>
    </>
  );
}