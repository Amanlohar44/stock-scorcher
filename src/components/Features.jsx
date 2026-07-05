export default function Features() {
  const features = [
    "Master Chart Patterns",
    "Candlestick Analysis",
    "Swing Trading",
    "Risk Management",
    "Lifetime Access",
    "PDF Notes",
  ];

  return (
    <section className="bg-black py-20 px-8">
      <h2 className="text-4xl font-bold text-center text-yellow-400 mb-12">
        Why Choose Stock Scorcher?
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((item) => (
          <div
            key={item}
            className="bg-zinc-900 p-8 rounded-xl border border-yellow-500 hover:scale-105 transition"
          >
            <h3 className="text-2xl text-yellow-400 font-semibold mb-4">
              {item}
            </h3>

            <p className="text-gray-300">
              Learn professional strategies with detailed explanations and real
              market examples.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}