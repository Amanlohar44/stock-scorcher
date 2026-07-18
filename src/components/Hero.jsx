import hero from "../assets/hero.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-black via-[#081325] to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-screen lg:min-h-[85vh] flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-12 py-10">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
  Master the
  <br />
  <span className="text-yellow-400">
    Stock Market
  </span>

  <br />

  <span className="block mt-1 text-xl sm:text-2xl md:text-3xl text-white font-semibold">
  Like a Professional
</span>
</h1>

          <p className="text-gray-400 mt-4 text-base md:text-lg leading-7 max-w-xl mx-auto lg:mx-0">
  Learn Chart Patterns, Price Action, Swing Trading & Candlestick Analysis with
  <span className="text-yellow-400 font-semibold"> Stock Scorcher</span>.
  Practical lessons designed for beginners.
</p>

<div className="mt-5 inline-flex items-center justify-center lg:justify-start px-4 py-2 rounded-full border border-yellow-400 text-yellow-400 font-semibold">
  Founded by Aman Lohar
</div>


          <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4">

  <button className="w-full sm:w-auto min-w-[170px] h-14 bg-yellow-400 text-black font-bold rounded-xl hover:scale-105 transition">
    Get Started
  </button>

  <button className="w-full sm:w-auto min-w-[170px] h-14 border border-yellow-400 text-yellow-400 font-bold rounded-xl hover:bg-yellow-400 hover:text-black transition">
    Learn More
  </button>

</div>

<p className="mt-5 text-sm text-gray-400 text-center lg:text-left">
  ⭐ Trusted by Beginners • 100% Practical Learning
</p>
        </div>

       {/* Right */}
<div className="lg:w-1/2 flex justify-center items-end relative">

  {/* Blue Glow */}
  <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-blue-600/30 blur-[120px] rounded-full"></div>

  <img
  src={hero}
  alt="Aman Lohar"
  className="relative z-10 w-[260px] sm:w-[340px] md:w-[430px] lg:w-[500px] object-contain transition duration-500 hover:scale-105"
/>
{/* Founder Name */}
<div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 text-center">
  <h3 className="text-white text-3xl font-bold">
  Stock Scorcher
</h3>

<p className="text-yellow-400 text-sm tracking-[3px] uppercase">
  Founder • Aman Lohar
</p>
</div>
</div>

      </div>
      {/* Bottom Fade */}
<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/95 to-transparent z-10 pointer-events-none"></div>    </section>
  );
}