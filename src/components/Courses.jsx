export default function Courses() {
  const goToPricing = () => {
    const pricing = document.getElementById("pricing");

    if (pricing) {
      pricing.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="bg-[#0b0b0f] py-20" id="courses">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-yellow-400 mb-14">
          Our Premium Courses
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">
              Master Chart Patterns
            </h3>

            <p className="text-gray-300 mb-8">
              Learn all important chart patterns with live market examples.
            </p>

            <button
              onClick={goToPricing}
              className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
            >
              Enroll Now
            </button>
          </div>

          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">
              Swing Trading Mastery
            </h3>

            <p className="text-gray-300 mb-8">
              Professional swing trading strategies with risk management.
            </p>

            <button
              onClick={goToPricing}
              className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
            >
              Enroll Now
            </button>
          </div>

          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">
              Candlestick Analysis
            </h3>

            <p className="text-gray-300 mb-8">
              Understand every candlestick pattern like a professional trader.
            </p>

            <button
              onClick={goToPricing}
              className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
            >
              Enroll Now
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}