import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Crown, 
  HelpCircle, 
  ShieldCheck, 
  TrendingUp, 
  Star,
  Zap,
  CheckCircle2,
  FileText,
  User
} from "lucide-react";

import Hero from "../components/hero/Hero";
import FounderBadge from "../components/hero/FounderBadge";
import AboutFounder from "../components/AboutFounder";
import WhatsAppButton from "../components/WhatsAppButton";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// ==========================================
// FRAMER MOTION (Premium Snappy Easing)
// ==========================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  const [isPartner, setIsPartner] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkPartnerStatus = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${API_BASE_URL}/api/partners/status/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.exists) {
          setIsPartner(true);
        }
      } catch (err) {}
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) checkPartnerStatus();
    });

    return () => unsubscribe();
  }, [auth]);

  const handlePartnerClick = (e) => {
    e.preventDefault();
    if (isPartner) {
      navigate('/partner/dashboard');
    } else {
      navigate('/partner/apply');
    }
  };

  return (
    <>
      <Helmet>
        <title>Stock Scorcher | AI Trading Platform & Masterclass by Aman Lohar</title>
        <meta
          name="description"
          content="Master the stock market and crypto with advanced AI signals, technical analysis, price action, and professional trading courses by Aman Lohar."
        />
        <meta
          name="keywords"
          content="Stock Scorcher, Aman Lohar, Stock Market Course, Swing Trading, AI Trading, Technical Analysis, Trading Mentorship"
        />
        <link rel="canonical" href="https://stockscorcher.com/" />
      </Helmet>

      {/* Pure Black Background with Premium Typography Settings */}
      <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden selection:bg-yellow-500/30 selection:text-yellow-200 antialiased">
        <main>
          
          {/* 1. Cinematic Hero Section */}
          <section id="home">
            <Hero />
          </section>

          <FounderBadge />

          {/* Premium Faded Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 2. About Founder Section */}
          <section id="about" className="py-20 sm:py-28 relative">
            {/* Subtle Ambient Glow */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative z-10">
              <AboutFounder />
              
              <div className="mt-14 flex justify-center px-4">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-yellow-500/50 px-8 py-4 text-xs sm:text-sm font-bold text-white uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.15)] active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <User size={18} className="text-yellow-500 group-hover:scale-110 transition-transform" /> 
                  <span>Explore Full Bio & Story</span>
                  <ArrowRight size={16} className="text-yellow-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 3. Core Platform Features */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto relative">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-center max-w-3xl mx-auto mb-20 space-y-6 relative z-10"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[11px] font-black uppercase tracking-widest">
                <Zap size={14} /> Why Choose Stock Scorcher
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Built for Traders Who Want <br/>
                <span className="bg-gradient-to-b from-yellow-300 to-yellow-600 bg-clip-text text-transparent">Real Results</span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                Combine human price action mastery with cutting-edge AI algorithmic intelligence to dominate the markets.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10"
            >
              {[
                { icon: TrendingUp, title: "Price Action & Patterns", desc: "Master institutional candlestick formations, support-resistance zones, and high-probability breakout strategies." },
                { icon: Zap, title: "AI Real-Time Signals", desc: "Leverage our automated algorithmic scanning tools to spot potential momentum shifts in stocks and crypto instantly.", pulse: true },
                { icon: ShieldCheck, title: "Risk & Psychology", desc: "Learn strict capital protection formulas and emotional discipline to stay profitable through every market cycle." }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={fadeUp} className="group relative rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#0f0f0f] to-[#050505] p-8 transition-all duration-500 hover:border-yellow-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(250,204,21,0.05)] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full -z-10 group-hover:bg-yellow-500/10 transition-colors duration-500"></div>
                  
                  <div className="h-14 w-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-yellow-500 mb-8 group-hover:scale-110 group-hover:border-yellow-500/30 transition-all duration-500 shadow-lg">
                    <feature.icon size={28} className={feature.pulse ? "animate-pulse" : ""} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-medium group-hover:text-zinc-300 transition-colors">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 4. Featured Courses Preview */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[11px] font-black uppercase tracking-widest">
                  <Crown size={14} /> Masterclass Modules
                </span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                  Featured Trading <span className="bg-gradient-to-b from-yellow-300 to-yellow-600 bg-clip-text text-transparent">Courses</span>
                </h2>
                <p className="text-zinc-400 text-sm sm:text-lg max-w-xl font-medium leading-relaxed">
                  Step-by-step video courses designed to take you from a beginner to an independent professional trader.
                </p>
              </div>
              <Link
                to="/courses"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-8 py-4 text-xs sm:text-sm font-black text-black uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] active:scale-95 shrink-0"
              >
                View All Courses <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Course Card 1 */}
              <motion.div variants={fadeUp} className="group rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#0f0f0f] to-[#050505] p-8 transition-all duration-500 hover:border-yellow-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(250,204,21,0.05)] flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-bl-full -z-10 group-hover:bg-yellow-500/10 transition-colors duration-500"></div>
                <div>
                  <span className="px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                    Bestseller
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors mt-6 tracking-tight leading-snug">
                    Price Action & Chart Pattern Mastery
                  </h3>
                  <p className="text-sm text-zinc-400 mt-4 font-medium leading-relaxed">
                    Learn to read institutional candles and high-probability chart setups with complete accuracy.
                  </p>
                  <ul className="mt-8 space-y-4 text-sm text-zinc-300 font-semibold">
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-yellow-500 shrink-0" /> Candlestick Psychology</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-yellow-500 shrink-0" /> Support & Resistance Setup</li>
                  </ul>
                </div>
                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Comprehensive</span>
                  <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-500 hover:text-yellow-400 uppercase tracking-widest">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>

              {/* Course Card 2 */}
              <motion.div variants={fadeUp} className="group rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#0f0f0f] to-[#050505] p-8 transition-all duration-500 hover:border-blue-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.05)] flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-full -z-10 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
                <div>
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                    AI Integrated
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mt-6 tracking-tight leading-snug">
                    AI Algorithmic Trading Blueprint
                  </h3>
                  <p className="text-sm text-zinc-400 mt-4 font-medium leading-relaxed">
                    Harness automated AI signals and quantitative tools for stocks & crypto markets.
                  </p>
                  <ul className="mt-8 space-y-4 text-sm text-zinc-300 font-semibold">
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Live AI Signal Scanners</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Quantitative Setup Rules</li>
                  </ul>
                </div>
                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Advanced</span>
                  <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>

              {/* Course Card 3 */}
              <motion.div variants={fadeUp} className="group rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#0f0f0f] to-[#050505] p-8 transition-all duration-500 hover:border-green-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(34,197,94,0.05)] flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-bl-full -z-10 group-hover:bg-green-500/10 transition-colors duration-500"></div>
                <div>
                  <span className="px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest">
                    Mentorship
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-green-400 transition-colors mt-6 tracking-tight leading-snug">
                    Swing & Intraday Masterclass
                  </h3>
                  <p className="text-sm text-zinc-400 mt-4 font-medium leading-relaxed">
                    Comprehensive swing trading setups backed by weekly live mentor sessions.
                  </p>
                  <ul className="mt-8 space-y-4 text-sm text-zinc-300 font-semibold">
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Multi-Timeframe Analysis</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Weekly Live Q&A</li>
                  </ul>
                </div>
                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Pro Level</span>
                  <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-black text-green-500 hover:text-green-400 uppercase tracking-widest">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>

            </motion.div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 5. VIP Membership Banner */}
          <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative rounded-[2.5rem] border border-yellow-500/20 bg-gradient-to-br from-[#1a1500] via-[#050505] to-[#0a0a0a] p-8 sm:p-14 md:p-20 overflow-hidden shadow-[0_0_80px_rgba(250,204,21,0.05)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl space-y-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-black uppercase tracking-widest shadow-inner">
                  <Crown size={14} /> VIP Membership
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Unlock Live AI Signals & <span className="bg-gradient-to-b from-yellow-300 to-yellow-600 bg-clip-text text-transparent">Private Community</span>
                </h2>
                <p className="text-zinc-300 text-sm sm:text-lg font-medium leading-relaxed max-w-2xl">
                  Join our exclusive club for real-time market scanners, portfolio tracking, and direct interaction with Aman Lohar.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    to="/membership"
                    className="group flex items-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 font-black text-black text-sm uppercase tracking-widest transition-all hover:bg-yellow-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(250,204,21,0.2)] active:scale-95"
                  >
                    View Membership Plans <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 6. Blog & Insights Teaser Section */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-black uppercase tracking-widest">
                  Market Insights
                </span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                  Latest From Our <span className="bg-gradient-to-b from-yellow-300 to-yellow-600 bg-clip-text text-transparent">Blog</span>
                </h2>
                <p className="text-zinc-400 text-sm sm:text-lg max-w-xl font-medium leading-relaxed">
                  Read professional trading psychology guides, market breakdowns, and strategy breakdowns.
                </p>
              </div>
              <Link
                to="/blog"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0a0a0a] px-8 py-4 text-xs sm:text-sm font-bold text-white uppercase tracking-widest hover:bg-[#111] hover:border-yellow-500/30 transition-all shadow-xl active:scale-95 shrink-0"
              >
                <FileText size={16} className="text-yellow-500" /> Read All Articles <ArrowRight size={16} className="text-yellow-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </section>

          {/* 7. Partner Network Section Teaser */}
          <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-[3rem] border border-white/5 bg-gradient-to-b from-[#0f0f0f] to-[#050505] p-10 sm:p-20 text-center relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
              
              <span className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-black uppercase tracking-widest mb-8 backdrop-blur-md">
                Growth Partner Network
              </span>
              <h2 className="relative z-10 text-4xl sm:text-5xl font-black tracking-tight mb-6">
                Earn Commissions by Promoting <br/><span className="bg-gradient-to-b from-yellow-300 to-yellow-600 bg-clip-text text-transparent">Stock Scorcher</span>
              </h2>
              <p className="relative z-10 text-zinc-400 text-sm sm:text-lg max-w-3xl mx-auto font-medium mb-12 leading-relaxed">
                Are you a creator, influencer, or student? Join our certified partner network, get your unique referral link, and earn attractive payouts on every course enrollment.
              </p>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handlePartnerClick}
                  className="w-full sm:w-auto rounded-2xl bg-yellow-400 hover:bg-yellow-300 px-8 py-4 text-sm font-black text-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  {isPartner ? "Go to Partner Dashboard" : "Become a Partner"}
                </button>
                <Link
                  to="/partner/leaderboard"
                  className="w-full sm:w-auto rounded-2xl border border-white/10 bg-[#0a0a0a] hover:bg-[#111] px-8 py-4 text-sm font-bold text-white uppercase tracking-widest transition-all"
                >
                  View Leaderboard
                </Link>
              </div>
            </motion.div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mt-20" />

          {/* 8. Student Reviews Snippet */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-black uppercase tracking-widest">
                Success Stories ⭐
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-6">
                What Our Traders Are Saying
              </h2>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { name: "Manish Patel", text: "\"Aman sir's price action course completely changed my trading style. I am now consistently profitable!\"" },
                { name: "Priya Verma", text: "\"The AI signals and chart pattern modules are top-notch. Best investment for my trading journey.\"" },
                { name: "Vikram Rathore", text: "\"Clean interface, genuine mentorship, and powerful tools. Highly recommended for every trader.\"" }
              ].map((review, i) => (
                <motion.div key={i} variants={fadeUp} className="rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#0f0f0f] to-[#050505] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-yellow-500/30 transition-all duration-300">
                  <div className="flex gap-1 text-yellow-500 mb-6">
                    {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                    {review.text}
                  </p>
                  <div className="mt-8 pt-5 border-t border-white/5 text-[11px] font-black text-yellow-500 uppercase tracking-widest">
                    — {review.name}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-16">
              <Link
                to="/reviews"
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-yellow-500 uppercase tracking-widest transition-colors"
              >
                Read All Student Testimonials & Success Stories <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-yellow-500" />
              </Link>
            </motion.div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 9. Quick FAQ & Help Section */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Got Questions? We've Got Answers
            </h2>
            <p className="text-zinc-400 text-sm sm:text-lg font-medium leading-relaxed">
              Explore our detailed FAQ center or talk to our support team directly.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/faq"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0a0a] hover:bg-[#111] px-8 py-4 font-bold text-sm text-white transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <HelpCircle size={18} className="text-yellow-500" /> View FAQ Center
              </Link>
              <Link
                to="/contact"
                className="group flex items-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 font-black text-sm text-black hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] active:scale-95 uppercase tracking-widest"
              >
                Contact Support <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>

        </main>

        {/* Floating WhatsApp Support Button */}
        <WhatsAppButton />

      </div>
    </>
  );
}