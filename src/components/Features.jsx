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
    <section className="bg-black py-14 md:py-20 px-5 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mb-10 md:mb-12">
        Why Choose Stock Scorcher?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
        {features.map((item) => (
          <div
            key={item}
            className="bg-zinc-900 p-6 md:p-8 rounded-xl border border-yellow-500 transition duration-300 lg:hover:scale-105"
          >
            <h3 className="text-xl md:text-2xl text-yellow-400 font-semibold mb-4">
              {item}
            </h3>

            <p className="text-gray-300 text-sm md:text-base leading-7">
              Learn professional strategies with detailed explanations and real
              market examples.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}