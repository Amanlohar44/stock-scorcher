export default function FloatingCards() {
  return (
    <>
      {/* BUY CARD */}

      <div className="absolute left-0 top-16 hidden w-56 rounded-3xl border border-green-500/20 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-xl lg:block">

        <p className="text-xs uppercase tracking-widest text-zinc-400">
          AI Signal
        </p>

        <h3 className="mt-2 text-4xl font-black text-green-400">
          BUY
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          Confidence
        </p>

        <div className="mt-3 h-2 rounded-full bg-zinc-700">

          <div className="h-full w-[94%] rounded-full bg-green-400"></div>

        </div>

        <p className="mt-2 font-bold text-green-400">
          94%
        </p>

      </div>

      {/* PROFIT CARD */}

      <div className="absolute bottom-16 right-0 hidden w-60 rounded-3xl border border-yellow-500/20 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-xl lg:block">

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

      {/* AI ANALYSIS */}

      <div className="absolute right-10 top-4 hidden w-52 rounded-3xl border border-blue-500/20 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-xl xl:block">

        <p className="text-xs uppercase tracking-widest text-zinc-400">
          AI Analysis
        </p>

        <div className="mt-4 space-y-3">

          <div className="flex justify-between">
            <span className="text-zinc-400">Trend</span>
            <span className="font-bold text-green-400">Bullish</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Risk</span>
            <span className="font-bold text-yellow-400">Medium</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Target</span>
            <span className="font-bold text-cyan-400">+12%</span>
          </div>

        </div>

      </div>

      {/* MOBILE CARDS */}

      <div className="absolute -bottom-24 left-0 right-0 grid grid-cols-2 gap-4 px-3 lg:hidden">

        <div className="rounded-2xl border border-green-500/20 bg-zinc-900/90 p-4 backdrop-blur-xl">

          <p className="text-xs text-zinc-400">
            AI Signal
          </p>

          <h3 className="mt-2 text-2xl font-black text-green-400">
            BUY
          </h3>

          <p className="text-xs text-zinc-500">
            Confidence 94%
          </p>

        </div>

        <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900/90 p-4 backdrop-blur-xl">

          <p className="text-xs text-zinc-400">
            Today Profit
          </p>

          <h3 className="mt-2 text-2xl font-black text-yellow-400">
            +18.42%
          </h3>

          <p className="text-xs text-zinc-500">
            Paper Trading
          </p>

        </div>

      </div>

    </>
  );
}