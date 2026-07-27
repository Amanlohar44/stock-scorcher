import React from "react";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function MembershipCTA() {
  return (
    <section className="relative bg-black py-24 overflow-hidden border-t border-white/5 selection:bg-yellow-400 selection:text-black">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-[#030303] border border-yellow-400/30 rounded-[3rem] p-10 sm:p-16 shadow-[0_0_80px_rgba(250,204,21,0.08)] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Zap size={14} />
            Start Trading Smarter Today
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Ready to Elevate Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
              Trading Performance?
            </span>
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Join professional traders utilizing Stock Scorcher's real-time signals, automated smart alerts, and paper trading analytics.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => {
                const pricing = document.getElementById("membership-pricing");
                if (pricing) {
                  pricing.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer"
            >
              Get Instant Access
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
            <ShieldCheck size={14} className="text-zinc-400" />
            Instant Account Activation &bull; Secure 256-Bit Razorpay Gateway
          </div>

        </div>
      </div>
    </section>
  );
}