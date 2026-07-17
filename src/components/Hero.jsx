import hero from "../assets/hero.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-black via-[#081325] to-black text-white">
      <div className="max-w-7xl mx-auto px-6 h-[85vh] flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left -mt-20">
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

          <p className="text-gray-400 mt-2 text-base md:text-lg leading-7 max-w-xl mx-auto md:mx-0">
  Learn Chart Patterns, Price Action, Swing Trading & Candlestick Analysis with
  <span className="text-yellow-400 font-semibold"> Stock Scorcher</span>.
  Practical lessons designed for beginners by
  <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full border border-yellow-400 text-yellow-400 font-semibold">
  Founded by Aman Lohar
</div>
</p>

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
          
                      <button className="min-w-[170px] h-14 bg-yellow-400 text-black font-bold rounded-xl hover:scale-105 duration-300 whitespace-nowrap">
  Get Started
</button>

            <button className="min-w-[170px] h-14 border border-yellow-400 text-yellow-400 font-bold rounded-xl hover:bg-yellow-400 hover:text-black duration-300 whitespace-nowrap">
  Learn More
</button>
            <p className="mt-4 whitespace-nowrap text-sm text-gray-400">
  ⭐ Trusted by Beginners • 100% Practical Learning
</p>
          </div>
        </div>

       {/* Right */}
<div className="lg:w-1/2 flex justify-center items-end relative">

  {/* Blue Glow */}
  <div className="absolute w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full"></div>

  <img
  src={hero}
  alt="Aman Lohar"
  className="relative z-10 w-[430px] lg:w-[500px] object-contain transition duration-500 hover:scale-105"
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