import React from "react";
import {
  GraduationCap,
  CandlestickChart,
  TrendingUp,
  ShieldCheck,
  FileText,
  Infinity,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Master Chart Patterns",
    description: "Decode institutional price action with high-accuracy chart setups, continuation patterns, and breakout formations.",
    icon: GraduationCap,
  },
  {
    title: "Candlestick Analysis",
    description: "Master market psychology and buyer-seller sentiment through multi-timeframe candlestick confirmations and reversal triggers.",
    icon: CandlestickChart,
  },
  {
    title: "Swing Trading",
    description: "Identify high-momentum swing opportunities across stocks and crypto with precise entry, target, and trailing stop frameworks.",
    icon: TrendingUp,
  },
  {
    title: "Risk Management",
    description: "Protect your trading capital like a professional using strict position sizing, risk-to-reward matrices, and drawdown control.",
    icon: ShieldCheck,
  },
  {
    title: "Lifetime Access",
    description: "Enjoy uncompromised lifetime access to all core course modules, live session archives, and future curriculum updates.",
    icon: Infinity,
  },
  {
    title: "Detailed PDF Notes",
    description: "Accelerate your learning curve with comprehensive downloadable cheat sheets, formula sheets, and strategy blueprint guides.",
    icon: FileText,
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-black text-white py-28 selection:bg-yellow-400 selection:text-black">
      
      {/* Cinematic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "45px 45px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} /> Platform Highlights
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Stock Scorcher?
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-zinc-400 font-light"
          >
            Everything you need to transform from a retail beginner into a consistently profitable trader in one elite platform.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-[2.5rem] border border-white/10 bg-[#060606] p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/50 hover:shadow-[0_0_40px_rgba(250,204,21,0.08)] flex flex-col justify-between"
              >
                <div>
                  {/* Icon Box */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 transition-all duration-500 group-hover:bg-yellow-400 group-hover:text-black group-hover:scale-105 shadow-lg shadow-yellow-400/10">
                    <Icon size={28} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-7 text-xl font-extrabold text-white tracking-tight">
                    {item.title}
                  </h3>

                  {/* Unique Description */}
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {/* Subtle bottom indicator */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-600 font-medium group-hover:text-yellow-400/80 transition-colors">
                  <span>Stock Scorcher Curriculum</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}