import React from "react";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Badge from "../ui/Badge";

export default function HeroLeft() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex-1 text-left"
    >
      <Badge color="gold">
        <Sparkles size={16} className="mr-2 text-yellow-400 animate-pulse" />
        Institutional-Grade AI Trading Ecosystem
      </Badge>

      <h1 className="mt-8 text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05]">
        Trade with <span className="text-white">Absolute Precision</span>

        <span className="mt-2 block bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
          Stocks • Crypto • Forex
        </span>

        <span className="mt-2 block text-zinc-300 text-3xl sm:text-5xl font-extrabold">
          Powered by Advanced AI.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-400 font-light">
        Combine institutional price action mastery with real-time quantitative AI intelligence. Master the markets, scale your portfolio, and trade like a pro.
      </p>

      {/* Hero Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center gap-4">

        {/* Start Learning → Courses */}
        <Link to="/courses">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-8 py-4 text-sm font-extrabold text-black transition-all duration-300 hover:scale-105 hover:bg-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.3)] cursor-pointer"
          >
            Explore Masterclass
            <ArrowRight size={18} />
          </button>
        </Link>

        {/* Become Premium → Membership */}
        <Link to="/membership">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:border-yellow-400 hover:text-yellow-400 cursor-pointer"
          >
            Unlock VIP Signals
            <ArrowRight size={18} />
          </button>
        </Link>

      </div>

      {/* Feature Trust Badges */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Badge color="green">
          ⚡ Live AI Scanners
        </Badge>

        <Badge color="blue">
          📊 Quantitative Edge
        </Badge>

        <Badge>
          🎓 Pro Mentorship
        </Badge>
      </div>

    </motion.div>
  );
}