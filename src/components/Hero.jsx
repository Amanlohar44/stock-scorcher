import hero from "../assets/hero.png";

export default function Hero() {
  return (
    <section className="bg-black text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-12">

        {/* Left */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
            Master the{" "}
            <span className="text-yellow-400">
              Stock Market
            </span>
          </h1>

          <p className="text-gray-400 mt-6 text-base sm:text-lg max-w-xl mx-auto md:mx-0">
            Learn Chart Patterns, Candlestick Analysis, Swing Trading,
            Price Action and Professional Trading Strategies with
            Stock Scorcher.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5">
            <button className="w-full sm:w-auto bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 duration-300">
              Get Started
            </button>

            <button className="w-full sm:w-auto border border-yellow-400 text-yellow-400 px-8 py-4 rounded-xl hover:bg-yellow-400 hover:text-black duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-center">
          <img
            src={hero}
            alt="Stock Market"
            className="w-full max-w-xs sm:max-w-md md:max-w-lg drop-shadow-[0_0_40px_rgba(255,193,7,0.5)]"
          />
        </div>

      </div>
    </section>
  );
}