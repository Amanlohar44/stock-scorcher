import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaChartLine,
  FaRobot,
  FaUsers,
  FaBullseye,
  FaShieldAlt,
  FaGraduationCap,
  FaBrain
} from "react-icons/fa";


// Elite Apple-Style Animation Easing
const customEase = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: customEase } }
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: customEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Stock Scorcher | Founded by Aman Lohar</title>
        <meta
          name="description"
          content="Stock Scorcher is an elite AI-powered trading ecosystem founded by Aman Lohar. Engineering edge for retail traders through institutional price action and AI."
        />
        <meta name="keywords" content="Stock Scorcher, Aman Lohar, Trading Ecosystem, Quant Trading, Institutional Price Action, AI Screener" />
        <link rel="canonical" href="https://stockscorcher.com/about" />
      </Helmet>

      {/* Pure Black Background with crisp text rendering */}
      <div className="min-h-screen bg-black text-[#ededed] font-sans selection:bg-[#EAB308] selection:text-black overflow-x-hidden antialiased">
        

        {/* Global Tech Grid Overlay */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, #ffffff 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />

        <main className="relative z-10 pt-32 pb-24">
          
          {/* ================= 1. HERO (The Statement) ================= */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pb-24 lg:pb-32 flex flex-col items-center justify-center min-h-[70vh]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[radial-gradient(ellipse_at_top,#EAB30815,transparent_60%)] pointer-events-none" />

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="relative z-10 w-full text-center flex flex-col items-center"
            >
              <motion.div variants={fadeUp} className="mb-8 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 backdrop-blur-md">
                <FaChartLine className="text-[#EAB308] w-3 h-3" />
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  Institutional Edge for Retail Traders
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] max-w-5xl text-white">
                Engineering the <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
                  Future of Trading.
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-8 text-base sm:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light">
                Stock Scorcher is a state-of-the-art market ecosystem. We combine battle-tested price action frameworks with proprietary AI to eliminate noise and execute with precision.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-12 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                <Link
                  to="/membership"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#EAB308] text-black font-bold text-sm sm:text-base hover:bg-white transition-colors duration-500 flex items-center justify-center gap-3 group"
                >
                  Enter the Ecosystem
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/#courses"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-white font-semibold text-sm sm:text-base transition-colors duration-500 flex items-center justify-center"
                >
                  Explore Courses
                </Link>
              </motion.div>
            </motion.div>
          </section>

          {/* ================= 2. THE METRICS ================= */}
          <section className="border-y border-white/10 bg-black/50 backdrop-blur-2xl">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10"
              >
                {[
                  { val: "10,000+", label: "Active Network" },
                  { val: "94.2%", label: "System Accuracy" },
                  { val: "24/7", label: "Market Support" },
                  { val: "100+", label: "Masterclass Modules" }
                ].map((stat, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="py-12 sm:py-16 text-center flex flex-col items-center justify-center hover:bg-white/[0.02] transition-colors duration-500">
                    <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{stat.val}</h3>
                    <p className="mt-3 text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-[0.15em]">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ================= 3. THE MANIFESTO (Founder Layout) ================= */}
          <section className="py-24 lg:py-40 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
              
              {/* Image Column */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeScale}
                className="lg:col-span-5 relative"
              >
                <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/15 to-transparent aspect-[4/5] max-h-[600px] overflow-hidden group">
                  <div className="absolute inset-0 bg-[#050505]" />
                  <img 
                    src="/founder.png" 
                    alt="Aman Lohar" 
                    className="relative z-10 w-full h-full object-cover rounded-[23px] grayscale-[15%] contrast-[1.1] transition-transform duration-1000 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-20 h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 z-30">
                    <p className="text-[10px] font-black tracking-[0.2em] text-[#EAB308] uppercase mb-1 drop-shadow-lg">Founder & Architect</p>
                    <p className="text-2xl font-bold text-white tracking-tight">Aman Lohar</p>
                  </div>
                </div>
              </motion.div>

              {/* Text/Manifesto Column */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="lg:col-span-7 lg:py-10"
              >
                <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-[1.1] mb-10">
                  Trading is a system. <br />
                  <span className="text-neutral-600">Not a gamble.</span>
                </motion.h2>
                
                <div className="space-y-8 text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
                  <motion.p variants={fadeUp}>
                    "The retail trading industry is broken. Millions enter the market daily, armed with lagging indicators and emotional biases, only to become liquidity for institutional players. I saw this cycle of capital destruction and decided to build a definitive solution."
                  </motion.p>
                  <motion.p variants={fadeUp}>
                    <strong className="font-semibold text-white">Stock Scorcher was engineered with a singular focus:</strong> to democratize institutional-grade strategies. We strip away the noise. No complicated setups, no blind calls. Just pure market structure, liquidity concepts, and mathematical risk management.
                  </motion.p>
                  <motion.p variants={fadeUp}>
                    By fusing our core price action methodologies with proprietary Artificial Intelligence, we have created an ecosystem that does not just teach you how to trade — it equips you with the architecture to execute flawlessly."
                  </motion.p>
                </div>

                <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-white/10 inline-block">
                  <p className="text-xl font-bold text-white tracking-tight italic font-serif">Aman Lohar</p>
                  <p className="text-xs text-neutral-500 font-bold tracking-[0.1em] uppercase mt-1">Stock Scorcher</p>
                </motion.div>
              </motion.div>

            </div>
          </section>

          {/* ================= 4. THE INFRASTRUCTURE (Bento Grid 2.0) ================= */}
          <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                The Infrastructure
              </h2>
              <p className="text-neutral-400 text-lg">A comprehensive suite built for consistent execution.</p>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
            >
              {/* Feature 1 */}
              <motion.div variants={fadeUp} className="md:col-span-2 bg-[#050505] border border-white/5 rounded-3xl p-8 sm:p-12 hover:border-white/10 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-[#EAB308]/5 transition-colors duration-700" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <FaBrain className="text-4xl text-neutral-600 group-hover:text-[#EAB308] transition-colors duration-500 mb-12" />
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">Institutional Education</h3>
                    <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-lg">
                      We deconstruct complex market concepts into a structured, step-by-step masterclass. Master Naked Charts, Order Blocks, Liquidity Sweeps, and advanced Options Mechanics without the overwhelm.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={fadeUp} className="bg-[#050505] border border-white/5 rounded-3xl p-8 sm:p-10 hover:border-white/10 transition-colors group flex flex-col justify-between">
                <FaRobot className="text-3xl text-neutral-600 group-hover:text-[#EAB308] transition-colors duration-500 mb-8" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">AI Market Screener</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Our algorithms process millions of data points across the NIFTY 500 daily to pinpoint high-probability setups before they break out.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={fadeUp} className="bg-[#050505] border border-white/5 rounded-3xl p-8 sm:p-10 hover:border-white/10 transition-colors group flex flex-col justify-between">
                <FaShieldAlt className="text-3xl text-neutral-600 group-hover:text-[#EAB308] transition-colors duration-500 mb-8" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Risk Frameworks</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Dynamic position sizing models and capital preservation blueprints designed to mathematically protect your portfolio.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div variants={fadeUp} className="md:col-span-2 bg-[#050505] border border-white/5 rounded-3xl p-8 sm:p-10 hover:border-white/10 transition-colors group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div>
                  <FaUsers className="text-3xl text-neutral-600 group-hover:text-[#EAB308] transition-colors duration-500 mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">The Inner Circle</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                    Join an elite network of serious traders. Real-time market breakdowns, live doubt resolution, and continuous execution support.
                  </p>
                </div>
                <Link to="/membership" className="whitespace-nowrap px-6 py-3 rounded-xl border border-white/10 text-white font-semibold text-sm hover:bg-white hover:text-black transition-colors duration-300">
                  Apply to Join
                </Link>
              </motion.div>
            </motion.div>
          </section>

          {/* ================= 5. THE ULTIMATE CTA ================= */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 relative">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeScale}
                className="relative rounded-[2rem] border border-white/10 bg-[#050505] p-12 sm:p-24 text-center overflow-hidden"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#EAB308]/10 blur-[120px] pointer-events-none rounded-full" />
                
                <h2 className="relative z-10 text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight mb-6">
                  Ready to execute with <br />
                  <span className="text-[#EAB308]">Absolute Clarity?</span>
                </h2>
                
                <p className="relative z-10 text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto mb-12">
                  Stop analyzing. Start executing. Equip yourself with the education, technology, and mentorship required to conquer the markets.
                </p>
                
                <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link
                    to="/membership"
                    className="px-10 py-4 rounded-xl bg-white text-black font-bold text-base hover:bg-[#EAB308] transition-colors duration-300 w-full sm:w-auto"
                  >
                    Unlock Premium
                  </Link>
                  <Link
                    to="/#contact"
                    className="px-10 py-4 rounded-xl border border-white/20 text-white font-semibold text-base hover:bg-white/5 transition-colors duration-300 w-full sm:w-auto"
                  >
                    Contact Team
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

        </main>

        
      </div>
    </>
  );
}