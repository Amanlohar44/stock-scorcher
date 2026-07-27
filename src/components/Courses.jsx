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
    <section
      id="courses"
      className="bg-[#030303] py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-yellow-400 selection:text-black"
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Heading */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs sm:text-sm font-black text-yellow-400 tracking-wider uppercase">
            Masterclass Offerings
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="text-white">Our </span>
            <span className="text-yellow-400">Premium Courses</span>
          </h2>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

          {/* Card 1: Basic Trading Course */}
          <div className="group flex flex-col justify-between rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-zinc-950 to-[#0c0c0e] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/60 hover:shadow-[0_0_40px_rgba(250,204,21,.15)]">
            <div>
              <div className="mb-6 inline-flex rounded-full bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-yellow-400">
                Coming Soon
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Basic Trading Course
              </h3>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-400">
                Perfect for beginners who want to learn the Stock Market from zero with simple concepts and practical examples.
              </p>

              <ul className="mt-8 space-y-3.5 text-xs sm:text-sm font-semibold text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Beginner Friendly
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Foundation Concepts
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Launching Soon
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={goToPricing}
              className="mt-10 w-full rounded-2xl bg-yellow-400 hover:bg-yellow-500 py-4 font-black text-xs sm:text-sm uppercase tracking-wider text-black transition-all duration-300 shadow-xl shadow-yellow-400/20 active:scale-95 cursor-pointer"
            >
              Enroll Now
            </button>
          </div>

          {/* Card 2: Premium Course (Most Popular) */}
          <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-yellow-400 bg-gradient-to-b from-yellow-400/10 via-zinc-950 to-zinc-950 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(250,204,21,.3)] shadow-2xl">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-5 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-lg">
              MOST POPULAR
            </div>

            <div>
              <h3 className="mt-4 text-2xl sm:text-3xl font-black text-yellow-400 tracking-tight">
                Premium Mastery
              </h3>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-300">
                Complete Recorded Trading Course with lifetime access and future updates directly from Aman Lohar.
              </p>

              <ul className="mt-8 space-y-3.5 text-xs sm:text-sm font-semibold text-zinc-200">
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Complete Recorded Modules
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Exclusive PDF Notes & Sheets
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Lifetime Terminal Access
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Free Future Content Updates
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={goToPricing}
              className="mt-10 w-full rounded-2xl bg-yellow-400 hover:bg-yellow-500 py-4 font-black text-xs sm:text-sm uppercase tracking-wider text-black transition-all duration-300 shadow-xl shadow-yellow-400/30 active:scale-95 cursor-pointer"
            >
              Enroll Now
            </button>
          </div>

          {/* Card 3: Pro Mentorship */}
          <div className="group flex flex-col justify-between rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-zinc-950 to-[#0c0c0e] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/60 hover:shadow-[0_0_40px_rgba(250,204,21,.15)]">
            <div>
              <div className="mb-6 inline-flex rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-400">
                Live Guidance
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Pro Mentorship
              </h3>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-400">
                Personal mentorship with live sessions, portfolio reviews, and direct institutional guidance.
              </p>

              <ul className="mt-8 space-y-3.5 text-xs sm:text-sm font-semibold text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Everything in Premium
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Live Interactive Sessions
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Personal Portfolio Review
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-yellow-400">✔</span> Priority VIP Support
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={goToPricing}
              className="mt-10 w-full rounded-2xl bg-yellow-400 hover:bg-yellow-500 py-4 font-black text-xs sm:text-sm uppercase tracking-wider text-black transition-all duration-300 shadow-xl shadow-yellow-400/20 active:scale-95 cursor-pointer"
            >
              Enroll Now
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}