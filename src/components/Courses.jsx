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
      className="bg-[#0b0b0f] py-16 md:py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl md:text-5xl font-black text-center mb-14">
          <span className="text-white">Our </span>
          <span className="text-yellow-400">Premium Courses</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="group rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-zinc-900 to-[#111] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(250,204,21,.18)]">

            <div className="mb-5 inline-flex rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
              Coming Soon
            </div>

            <h3 className="text-3xl font-bold text-white">
              Basic Trading Course
            </h3>

            <p className="mt-5 text-zinc-400 leading-8">
              Perfect for beginners who want to learn Stock Market from zero with
              simple concepts and practical examples.
            </p>

            <ul className="mt-8 space-y-3 text-zinc-300">
              <li>✔ Beginner Friendly</li>
              <li>✔ Basic Concepts</li>
              <li>✔ Coming Soon</li>
            </ul>

            <button
              onClick={goToPricing}
              className="mt-10 w-full rounded-xl bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              Enroll Now
            </button>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-3xl border-2 border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-zinc-900 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_45px_rgba(250,204,21,.35)]">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-black">
              MOST POPULAR
            </div>

            <h3 className="mt-5 text-3xl font-bold text-yellow-400">
              Premium
            </h3>

            <p className="mt-5 text-zinc-300 leading-8">
              Complete Recorded Trading Course with lifetime access and future
              updates.
            </p>

            <ul className="mt-8 space-y-3 text-zinc-200">
              <li>✔ Complete Recorded Course</li>
              <li>✔ PDF Notes</li>
              <li>✔ Lifetime Access</li>
              <li>✔ Future Updates</li>
            </ul>

            <button
              onClick={goToPricing}
              className="mt-10 w-full rounded-xl bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              Enroll Now
            </button>
          </div>

          {/* Card 3 */}
          <div className="group rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-zinc-900 to-[#111] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(250,204,21,.18)]">

            <div className="mb-5 inline-flex rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
              Live Guidance
            </div>

            <h3 className="text-3xl font-bold text-white">
              Pro Mentorship
            </h3>

            <p className="mt-5 text-zinc-400 leading-8">
              Personal mentorship with live sessions, portfolio review and direct
              guidance.
            </p>

            <ul className="mt-8 space-y-3 text-zinc-300">
              <li>✔ Everything in Premium</li>
              <li>✔ Live Mentorship</li>
              <li>✔ Portfolio Review</li>
              <li>✔ Priority Support</li>
            </ul>

            <button
              onClick={goToPricing}
              className="mt-10 w-full rounded-xl bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              Enroll Now
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}