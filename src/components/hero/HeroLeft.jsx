import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Badge from "../ui/Badge";

export default function HeroLeft() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex-1"
    >
      <Badge color="gold">
        <Sparkles size={16} className="mr-2" />
        India's AI Trading Platform
      </Badge>

      <h1 className="mt-8 text-5xl font-black leading-[1.05] sm:text-6xl xl:text-7xl">
        Trade Smarter

        <span className="mt-3 block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Stock • Crypto • Forex
        </span>

        <span className="mt-3 block">
          Powered by AI
        </span>
      </h1>

      <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
        Learn trading, analyze markets with Artificial Intelligence,
        manage your portfolio and master Stocks, Crypto & Forex
        — all from one powerful platform.
      </p>

      {/* Hero Buttons */}
      <div className="mt-10 flex flex-wrap gap-4">

        {/* Start Learning → Courses / Pricing */}
        <Link to="/#pricing">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-base font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-yellow-300"
          >
            Start Learning
            <ArrowRight size={18} />
          </button>
        </Link>

        {/* Become Premium → Membership */}
        <Link to="/membership">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:border-yellow-400 hover:text-yellow-400"
          >
            Become Premium
            <ArrowRight size={18} />
          </button>
        </Link>

      </div>

      <div className="mt-10 flex flex-wrap gap-3">

        <Badge color="green">
          ✔ AI Signals
        </Badge>

        <Badge color="blue">
          📈 Live Markets
        </Badge>

        <Badge>
          🎓 Trading Courses
        </Badge>

      </div>

    </motion.div>
  );
}