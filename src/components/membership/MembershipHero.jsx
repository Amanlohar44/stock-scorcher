import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Crown, Sparkles, ShieldCheck, ArrowRight, Zap, TrendingUp, Users } from "lucide-react";

export default function MembershipHero() {
  return (
    <>
      <Helmet>
        <title>Premium Trading Membership & AI Tools | Stock Scorcher</title>
        <meta name="description" content="Unlock advanced AI stock analysis, real-time paper trading, smart alerts, and institutional-grade tools with Stock Scorcher Membership." />
        <meta name="keywords" content="Stock Scorcher membership, AI stock analysis, paper trading platform, stock market AI tools" />
      </Helmet>

      <section className="relative overflow-hidden bg-black text-[#ededed] pt-28 pb-16 selection:bg-yellow-400 selection:text-black">
        
        {/* Global Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.12),transparent_70%)] pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(34,197,94,0.08),transparent_70%)] pointer-events-none blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">

          {/* Header Center Content */}
          <div className="text-center max-w-4xl mx-auto">
            
            <div className="inline-flex items-center gap-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-5 py-2 backdrop-blur-xl shadow-lg mb-8">
              <Crown className="text-yellow-400 animate-pulse" size={18} />
              <span className="text-yellow-300 font-bold text-xs sm:text-sm tracking-widest uppercase">
                Stock Scorcher AI Membership
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1] mb-8">
              Unlock Institutional-Grade <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                AI Stock Analysis.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
              Get professional AI buy/sell signals, zero-risk paper trading, deep portfolio insights, and automated smart market alerts in one unified platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
              <a href="#membership-pricing" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-8.5 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 cursor-pointer">
                  <Zap size={18} />
                  Become Premium
                  <ArrowRight size={18} />
                </button>
              </a>

              <Link to="/stock-analysis" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black px-8.5 py-4 rounded-2xl font-bold transition-all duration-300 backdrop-blur-md cursor-pointer">
                  Try Free Analysis
                </button>
              </Link>
            </div>

          </div>

          {/* Modern Feature Highlights / Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28">
            
            <div className="group relative bg-[#060606] border border-white/10 hover:border-yellow-400/40 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
                <Sparkles size={26} />
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-3">
                AI Recommendations
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Receive precise BUY, SELL, or HOLD suggestions backed by institutional confidence scoring algorithms.
              </p>
            </div>

            <div className="group relative bg-[#060606] border border-white/10 hover:border-green-500/40 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-3">
                Paper Trading Terminal
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Test strategies seamlessly with ₹10,00,000 in virtual capital without risking your hard-earned money.
              </p>
            </div>

            <div className="group relative bg-[#060606] border border-white/10 hover:border-yellow-400/40 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
                <Users size={26} />
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-3">
                VIP Community
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Connect with professional traders, get early feature access, and unlock exclusive market insights.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}