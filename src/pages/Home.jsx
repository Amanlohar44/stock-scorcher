import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getAuth } from "firebase/auth";
import axios from "axios";
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
      } catch (err) {
        // Not a partner yet
      }
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

      <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-yellow-400 selection:text-black">
        <main>
          
          {/* 1. Cinematic Hero Section */}
          <section id="home">
            <Hero />
          </section>

          {/* Founder Badge */}
          <FounderBadge />

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

          {/* 2. About Founder Section */}
          <section id="about" className="py-16 sm:py-24">
            <AboutFounder />
            
            <div className="mt-10 flex justify-center px-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 px-8 py-4 text-xs sm:text-sm font-black text-black uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(250,204,21,0.25)] active:scale-95 cursor-pointer"
              >
                <User size={18} /> Explore Full Bio & Story <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          {/* 3. Core Platform Features */}
          <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                Why Choose Stock Scorcher
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Built for Traders Who Want <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">Real Results</span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base font-light">
                Combine human price action mastery with cutting-edge AI algorithmic intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group rounded-[2rem] border border-yellow-500/20 bg-zinc-950 p-8 transition-all duration-300 hover:border-yellow-400/50 hover:-translate-y-1 shadow-2xl backdrop-blur-xl">
                <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-white">Price Action & Patterns</h3>
                <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                  Master institutional candlestick formations, support-resistance zones, and high-probability breakout strategies.
                </p>
              </div>

              <div className="group rounded-[2rem] border border-yellow-500/20 bg-zinc-950 p-8 transition-all duration-300 hover:border-yellow-400/50 hover:-translate-y-1 shadow-2xl backdrop-blur-xl">
                <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={24} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-extrabold text-white">AI Real-Time Signals</h3>
                <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                  Leverage our automated algorithmic scanning tools to spot potential momentum shifts in stocks and crypto instantly.
                </p>
              </div>

              <div className="group rounded-[2rem] border border-yellow-500/20 bg-zinc-950 p-8 transition-all duration-300 hover:border-yellow-400/50 hover:-translate-y-1 shadow-2xl backdrop-blur-xl">
                <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-white">Risk & Psychology</h3>
                <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                  Learn strict capital protection formulas and emotional discipline to stay profitable through every market cycle.
                </p>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          {/* 4. Featured Courses Preview */}
          <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-extrabold uppercase tracking-widest">
                  Masterclass Modules
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  Featured Trading <span className="text-yellow-400">Courses</span>
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base max-w-xl font-light">
                  Step-by-step video courses designed to take you from a beginner to an independent professional trader.
                </p>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 text-xs sm:text-sm font-black text-black uppercase tracking-wider hover:bg-yellow-300 transition-all shadow-[0_0_25px_rgba(250,204,21,0.25)] active:scale-95 shrink-0"
              >
                View All Courses <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Course Card 1 */}
              <div className="group rounded-[2.5rem] border border-yellow-500/20 bg-zinc-950 p-8 transition-all duration-300 hover:border-yellow-400/50 hover:-translate-y-2 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-black uppercase tracking-wider">
                    Bestseller
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors mt-5 tracking-tight">
                    Price Action & Chart Pattern Mastery
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                    Learn to read institutional candles and high-probability chart setups with complete accuracy.
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-300 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-400 shrink-0" /> Candlestick Psychology</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-400 shrink-0" /> Support & Resistance Setup</li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Comprehensive</span>
                  <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-wider">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Course Card 2 */}
              <div className="group rounded-[2.5rem] border border-yellow-500/20 bg-zinc-950 p-8 transition-all duration-300 hover:border-yellow-400/50 hover:-translate-y-2 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider">
                    AI Integrated
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors mt-5 tracking-tight">
                    AI Algorithmic Trading Blueprint
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                    Harness automated AI signals and quantitative tools for stocks & crypto markets.
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-300 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-400 shrink-0" /> Live AI Signal Scanners</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-400 shrink-0" /> Quantitative Setup Rules</li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Advanced</span>
                  <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-wider">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Course Card 3 */}
              <div className="group rounded-[2.5rem] border border-yellow-500/20 bg-zinc-950 p-8 transition-all duration-300 hover:border-yellow-400/50 hover:-translate-y-2 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider">
                    Mentorship
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors mt-5 tracking-tight">
                    Swing & Intraday Masterclass
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                    Comprehensive swing trading setups backed by weekly live mentor sessions.
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-300 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-400 shrink-0" /> Multi-Timeframe Analysis</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-400 shrink-0" /> Weekly Live Q&A</li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Pro Level</span>
                  <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-wider">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          {/* 5. VIP Membership Banner */}
          <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="relative rounded-[2.5rem] border border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-black to-zinc-950 p-8 sm:p-12 md:p-16 overflow-hidden shadow-[0_0_50px_rgba(250,204,21,0.12)] backdrop-blur-2xl">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-widest">
                  <Crown size={14} /> VIP Membership
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Unlock Live AI Signals & <span className="text-yellow-400">Private Community</span>
                </h2>
                <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
                  Join our exclusive club for real-time market scanners, portfolio tracking, and direct interaction with Aman Lohar.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    to="/membership"
                    className="flex items-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 font-black text-black text-xs sm:text-sm uppercase tracking-wider hover:bg-yellow-300 transition-all shadow-[0_0_25px_rgba(250,204,21,0.3)] active:scale-95"
                  >
                    View Membership Plans <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          {/* 6. Blog & Insights Teaser Section */}
          <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-extrabold uppercase tracking-widest">
                  Market Insights
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  Latest From Our <span className="text-yellow-400">Blog</span>
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base max-w-xl font-light">
                  Read professional trading psychology guides, market breakdowns, and strategy breakdowns.
                </p>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-yellow-500/30 bg-zinc-950 px-7 py-4 text-xs sm:text-sm font-black text-yellow-400 uppercase tracking-wider hover:bg-zinc-900 transition-all shadow-xl active:scale-95 shrink-0"
              >
                <FileText size={16} /> Read All Articles <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Partner Network Section Teaser */}
          <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="rounded-[2.5rem] border border-yellow-500/20 bg-zinc-950 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none"></div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-extrabold uppercase tracking-widest mb-4">
                Growth Partner Network
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                Earn Commissions by Promoting <span className="text-yellow-400">Stock Scorcher</span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light mb-8">
                Are you a creator, influencer, or student? Join our certified partner network, get your unique referral link, and earn attractive payouts on every course enrollment.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handlePartnerClick}
                  className="rounded-xl bg-yellow-400 hover:bg-yellow-300 px-8 py-4 text-xs sm:text-sm font-black text-black uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(250,204,21,0.25)] active:scale-95 cursor-pointer"
                >
                  {isPartner ? "Go to Partner Dashboard" : "Become a Partner"}
                </button>
                <Link
                  to="/partner/leaderboard"
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 text-xs sm:text-sm font-bold text-white uppercase tracking-wider transition-all"
                >
                  View Leaderboard
                </Link>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          {/* 7. Student Reviews Snippet */}
          <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black uppercase tracking-widest">
              Success Stories ⭐
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
              What Our Traders Are Saying
            </h2>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="rounded-[2rem] border border-yellow-500/20 bg-zinc-950 p-8 shadow-xl backdrop-blur-xl">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  "Aman sir's price action course completely changed my trading style. I am now consistently profitable!"
                </p>
                <div className="mt-6 pt-4 border-t border-white/5 text-xs font-black text-yellow-400 uppercase tracking-wider">
                  — Manish Patel 
                </div>
              </div>

              <div className="rounded-[2rem] border border-yellow-500/20 bg-zinc-950 p-8 shadow-xl backdrop-blur-xl">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  "The AI signals and chart pattern modules are top-notch. Best investment for my trading journey."
                </p>
                <div className="mt-6 pt-4 border-t border-white/5 text-xs font-black text-yellow-400 uppercase tracking-wider">
                  — Priya Verma
                </div>
              </div>

              <div className="rounded-[2rem] border border-yellow-500/20 bg-zinc-950 p-8 shadow-xl backdrop-blur-xl">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  "Clean interface, genuine mentorship, and powerful tools. Highly recommended for every trader."
                </p>
                <div className="mt-6 pt-4 border-t border-white/5 text-xs font-black text-yellow-400 uppercase tracking-wider">
                  — Vikram Rathore
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 text-xs font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-widest transition-colors"
              >
                Read All Student Testimonials & Success Stories <ArrowRight size={14} />
              </Link>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          {/* 8. Quick FAQ & Help Section */}
          <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Got Questions? We've Got Answers
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-light">
              Explore our detailed FAQ center or talk to our support team directly.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/faq"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 font-bold text-xs sm:text-sm text-white hover:border-yellow-400 transition-all active:scale-95"
              >
                <HelpCircle size={16} className="text-yellow-400" /> View FAQ Center
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-black text-xs sm:text-sm text-black hover:bg-yellow-300 transition-all shadow-xl active:scale-95 uppercase tracking-wider"
              >
                Contact Support <ArrowRight size={16} />
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