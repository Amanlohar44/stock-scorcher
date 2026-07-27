export default function AboutFounder() {
  return (
    <section className="relative bg-[#030303] py-24 text-white overflow-hidden selection:bg-yellow-400 selection:text-black">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Founder Image Container */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-500/30 to-yellow-600/10 blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />
              <img
                src="/founder.png"
                alt="Aman Lohar - Founder of Stock Scorcher"
                className="relative w-full max-w-[380px] sm:max-w-[420px] rounded-3xl border border-yellow-400/30 shadow-2xl object-cover bg-zinc-950"
              />
            </div>
          </div>

          {/* Founder Details & Bio */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs sm:text-sm font-black text-yellow-400 tracking-wider uppercase">
              Founder & CEO
            </div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Aman Lohar
            </h2>

            <p className="text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-8 text-zinc-400">
              Founder of <span className="text-yellow-400 font-bold">Stock Scorcher</span>, dedicated to helping traders master the Stock Market, Swing Trading, Investing, Risk Management, and AI-Powered Trading with practical, real-world strategies.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <h3 className="text-2xl sm:text-3xl font-black text-yellow-400">
                  10K+
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-400">
                  Active Students
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <h3 className="text-2xl sm:text-3xl font-black text-yellow-400">
                  AI
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-400">
                  Powered Platform
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <h3 className="text-2xl sm:text-3xl font-black text-yellow-400">
                  Live
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-400">
                  Expert Mentorship
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950/80 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
                <h3 className="text-2xl sm:text-3xl font-black text-yellow-400">
                  Premium
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-400">
                  Masterclass Courses
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}