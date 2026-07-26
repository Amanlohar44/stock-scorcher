export default function AboutFounder() {
  return (
    <section className="relative bg-[#030303] py-24 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          <div className="flex justify-center">
            <img
              src="/founder.png"
              alt="Aman Lohar - Founder of Stock Scorcher"
              className="w-[420px] rounded-3xl border border-yellow-400/20 shadow-2xl"
            />
          </div>

          <div>

            <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">
              Founder & CEO
            </span>

            <h2 className="mt-6 text-5xl font-black">
              Aman Lohar
            </h2>

            <p className="mt-6 text-lg leading-9 text-zinc-400">
              Founder of <span className="text-yellow-400">Stock Scorcher</span>,
              dedicated to helping traders learn Stock Market,
              Swing Trading, Investing, Risk Management and AI Powered
              Trading with practical strategies.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-3xl font-black text-yellow-400">
                  10K+
                </h3>
                <p className="mt-2 text-zinc-400">
                  Students
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-3xl font-black text-yellow-400">
                  AI
                </h3>
                <p className="mt-2 text-zinc-400">
                  Powered Platform
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-3xl font-black text-yellow-400">
                  Live
                </h3>
                <p className="mt-2 text-zinc-400">
                  Mentorship
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-3xl font-black text-yellow-400">
                  Premium
                </h3>
                <p className="mt-2 text-zinc-400">
                  Courses
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}