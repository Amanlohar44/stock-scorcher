import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChartLine,
  FaRobot,
  FaUsers,
  FaBullseye,
  FaShieldAlt,
  FaGraduationCap,
  FaBrain,
} from "react-icons/fa";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";



export default function About() {
  return (
    <>
      <Helmet>
        <title>About Stock Scorcher | Founded by Aman Lohar</title>

        <meta
          name="description"
          content="Learn about Stock Scorcher, India's AI Powered Stock Market Platform founded by Aman Lohar."
        />

        <link
          rel="canonical"
          href="https://stockscorcher.com/about"
        />
      </Helmet>

      <div className="min-h-screen overflow-x-hidden bg-[#030303] text-white">

        <Navbar />

        <main>

        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden pt-40 pb-24">

          <div className="absolute inset-0">

            <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[180px]" />

            <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[170px]" />

            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
                `,
                backgroundSize: "45px 45px",
              }}
            />

          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm font-medium text-yellow-400">

                <FaChartLine />

                ABOUT STOCK SCORCHER

              </span>

              <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">

                Building India's

                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

                  AI Powered

                </span>

                Stock Market Platform

              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-9 text-zinc-400">

                Stock Scorcher was founded by
                <span className="font-semibold text-white">
                  {" "}Aman Lohar
                </span>
                {" "}with one mission —
                make professional stock market education
                and AI-powered analysis available for everyone.

              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  to="/membership"
                  className="flex items-center gap-3 rounded-2xl bg-yellow-500 px-8 py-4 font-bold text-black transition hover:scale-105"
                >
                  Become Premium

                  <FaArrowRight />

                </Link>

                <Link
                  to="/stock-analysis"
                  className="rounded-2xl border border-yellow-500/20 px-8 py-4 font-bold transition hover:bg-white/5"
                >
                  AI Analysis
                </Link>

              </div>

              <div className="mt-14 grid grid-cols-3 gap-5">

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

                  <FaUsers className="text-3xl text-yellow-400" />

                  <h2 className="mt-4 text-3xl font-black">

                    10K+

                  </h2>

                  <p className="text-zinc-400">

                    Students

                  </p>

                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

                  <FaRobot className="text-3xl text-yellow-400" />

                  <h2 className="mt-4 text-3xl font-black">

                    94%

                  </h2>

                  <p className="text-zinc-400">

                    AI Accuracy

                  </p>

                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

                  <FaShieldAlt className="text-3xl text-yellow-400" />

                  <h2 className="mt-4 text-3xl font-black">

                    24/7

                  </h2>

                  <p className="text-zinc-400">

                    Support

                  </p>

                </div>

              </div>

            </div>
                        {/* RIGHT SIDE */}

            <div className="relative flex items-center justify-center">

              {/* Golden Glow */}
              <div className="absolute h-[520px] w-[520px] rounded-full bg-yellow-500/15 blur-[140px]" />

              {/* Blue Glow */}
              <div className="absolute bottom-0 h-[320px] w-[420px] rounded-full bg-blue-500/10 blur-[150px]" />

              {/* Founder Image */}

              <img
  src="/founder.png"
  alt="Aman Lohar"
  className="relative z-20 mt-10 w-[260px] sm:w-[320px] md:w-[400px] lg:mt-0 lg:w-[470px] object-contain"
/>



              {/* Bottom Fade */}

              <div className="absolute bottom-0 left-0 right-0 z-30 h-32 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent" />

              <div className="mt-6 w-full lg:hidden">
  <div className="rounded-3xl border border-yellow-500/20 bg-black/70 p-6 backdrop-blur-xl text-center">
    <p className="text-xs uppercase tracking-[4px] text-yellow-400">
      Founder & CEO
    </p>

    <h3 className="mt-2 text-3xl font-black">
      Aman Lohar
    </h3>

    <p className="text-zinc-400">
      Stock Scorcher
    </p>
  </div>
</div>

              {/* Founder Card */}

              <div className="hidden lg:block absolute bottom-10 left-0 z-40 rounded-3xl border border-yellow-500/20 bg-black/70 px-6 py-5 backdrop-blur-2xl">

                <p className="text-xs uppercase tracking-[5px] text-yellow-400">
                  Founder & CEO
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Aman Lohar
                </h3>

                <p className="text-zinc-400">
                  Stock Scorcher
                </p>

              </div>

              {/* AI Accuracy */}

              <div className="hidden lg:block absolute right-0 top-10 z-40 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">

                <p className="text-4xl font-black text-yellow-400">
                  94%
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  AI Accuracy
                </p>

              </div>

              

                

            </div>

          </div>

        </section>

        {/* ================= STORY ================= */}

        <section className="mx-auto max-w-7xl px-6 py-24">

          <div className="grid gap-10 lg:grid-cols-2">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

              <FaBullseye className="text-5xl text-yellow-400" />

              <h2 className="mt-8 text-4xl font-black">

                Our Mission

              </h2>

              <p className="mt-6 leading-9 text-zinc-400">

                To simplify stock market education using
                AI technology, premium courses,
                practical trading strategies,
                and real market experience so that
                every trader can grow with confidence.

              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

              <FaBrain className="text-5xl text-yellow-400" />

              <h2 className="mt-8 text-4xl font-black">

                Our Vision

              </h2>

              <p className="mt-6 leading-9 text-zinc-400">

                Build India's most trusted AI powered
                stock market platform where
                education, analysis,
                mentorship and technology
                work together for every trader.

              </p>

            </div>

          </div>

        </section>

                {/* ================= WHY STOCK SCORCHER ================= */}

        <section className="mx-auto max-w-7xl px-6 py-24">

          <div className="text-center">

            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm font-semibold text-yellow-400">
              WHY CHOOSE US
            </span>

            <h2 className="mt-6 text-4xl font-black md:text-5xl">
              Why Traders Choose
              <span className="block bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Stock Scorcher
              </span>
            </h2>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-yellow-500/30 hover:-translate-y-2">

              <FaGraduationCap className="text-5xl text-yellow-400" />

              <h3 className="mt-6 text-2xl font-bold">
                Premium Learning
              </h3>

              <p className="mt-4 leading-8 text-zinc-400">
                Practical trading education designed for beginners and experienced traders.
              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-yellow-500/30 hover:-translate-y-2">

              <FaRobot className="text-5xl text-yellow-400" />

              <h3 className="mt-6 text-2xl font-bold">
                AI Analysis
              </h3>

              <p className="mt-4 leading-8 text-zinc-400">
                Smart AI powered market analysis with confidence score and trading insights.
              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-yellow-500/30 hover:-translate-y-2">

              <FaUsers className="text-5xl text-yellow-400" />

              <h3 className="mt-6 text-2xl font-bold">
                Community
              </h3>

              <p className="mt-4 leading-8 text-zinc-400">
                Join thousands of traders learning and growing together every day.
              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-yellow-500/30 hover:-translate-y-2">

              <FaShieldAlt className="text-5xl text-yellow-400" />

              <h3 className="mt-6 text-2xl font-bold">
                Trusted Platform
              </h3>

              <p className="mt-4 leading-8 text-zinc-400">
                Professional education, AI tools and continuous support in one place.
              </p>

            </div>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="mx-auto max-w-7xl px-6 pb-24">

          <div className="grid gap-6 rounded-[40px] border border-white/10 bg-gradient-to-r from-yellow-500/10 via-white/5 to-blue-500/10 p-10 md:grid-cols-4">

            <div className="text-center">
              <h3 className="text-5xl font-black text-yellow-400">10K+</h3>
              <p className="mt-3 text-zinc-400">Students</p>
            </div>

            <div className="text-center">
              <h3 className="text-5xl font-black text-yellow-400">94%</h3>
              <p className="mt-3 text-zinc-400">AI Accuracy</p>
            </div>

            <div className="text-center">
              <h3 className="text-5xl font-black text-yellow-400">24/7</h3>
              <p className="mt-3 text-zinc-400">Support</p>
            </div>

            <div className="text-center">
              <h3 className="text-5xl font-black text-yellow-400">100+</h3>
              <p className="mt-3 text-zinc-400">Learning Videos</p>
            </div>

          </div>

        </section>

                {/* ================= CTA ================= */}

        <section className="relative overflow-hidden px-6 pb-28">

          <div className="absolute inset-0">

            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/10 blur-[170px]" />

          </div>

          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-white/5 to-blue-500/10 px-8 py-20 text-center backdrop-blur-2xl">

            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 text-sm font-semibold text-yellow-400">

              JOIN STOCK SCORCHER

            </span>

            <h2 className="mt-8 text-4xl font-black leading-tight md:text-6xl">

              Ready To Become A

              <span className="block bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

                Smarter Trader?

              </span>

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-zinc-400">

              Learn Stock Market, Swing Trading, AI Analysis,
              Price Action and Risk Management with
              India's growing trading community.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                to="/membership"
                className="flex items-center gap-3 rounded-2xl bg-yellow-500 px-8 py-4 font-bold text-black transition duration-300 hover:scale-105 hover:bg-yellow-400"
              >

                Become Premium

                <FaArrowRight />

              </Link>

              <Link
                to="/stock-analysis"
                className="rounded-2xl border border-yellow-500/20 px-8 py-4 font-bold transition duration-300 hover:bg-white/5 hover:border-yellow-500"
              >

                Try AI Analysis

              </Link>

            </div>

          </div>

        </section>

        </main>

        <Footer />

      </div>

    </>
  );
}