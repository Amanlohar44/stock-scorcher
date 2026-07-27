export default function MarketSelector({
  market,
  setMarket,
}) {
  const markets = [
    {
      id: "indian",
      name: "🇮🇳 Indian Stocks",
    },
    {
      id: "us",
      name: "🇺🇸 US Stocks",
    },
    {
      id: "crypto",
      name: "₿ Crypto",
    },
    {
      id: "forex",
      name: "💱 Forex",
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-black text-yellow-400 mb-5">
        Select Market Terminal
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {markets.map((item) => (
          <button
            key={item.id}
            onClick={() => setMarket(item.id)}
            className={`rounded-2xl border p-5 transition-all duration-300 font-bold text-xs sm:text-sm cursor-pointer ${
              market === item.id
                ? "bg-yellow-400 text-black border-yellow-400 scale-105 shadow-xl shadow-yellow-400/20 font-black"
                : "bg-zinc-950 text-zinc-300 border-yellow-500/20 hover:border-yellow-400/60 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}