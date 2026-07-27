import {
  Brain,
  LineChart,
  Shield,
  Bell,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function PremiumFeatures() {
  const features = [
    {
      icon: <Brain size={34} />,
      title: "AI Buy / Sell Signals",
      desc: "Get accurate AI-powered trading signals with smart entry & exit recommendations.",
    },
    {
      icon: <LineChart size={34} />,
      title: "Paper Trading",
      desc: "Practice unlimited trades without risking real money before entering live markets.",
    },
    {
      icon: <Bell size={34} />,
      title: "Smart Alerts",
      desc: "Receive instant stock alerts and never miss profitable trading opportunities.",
    },
    {
      icon: <Shield size={34} />,
      title: "Portfolio Tracking",
      desc: "Track all your investments and monitor profits with a beautiful dashboard.",
    },
  ];

  const stats = [
    {
      value: "500+",
      label: "Premium Members",
    },
    {
      value: "98%",
      label: "Accuracy",
    },
    {
      value: "24/7",
      label: "Support",
    },
    {
      value: "AI",
      label: "Powered",
    },
  ];

  return (
    <section
      id="membership"
      className="relative overflow-hidden bg-[#030303] py-28 selection:bg-yellow-400 selection:text-black"
    >
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#030303]" />
        
        {/* Gold Glow */}
        <div className="absolute -top-44 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[170px]" />

        {/* Blue Glow */}
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[170px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles size={16} />
            Premium Membership
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="mt-8 text-center text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
          Unlock
          <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Premium Features
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-center text-base sm:text-lg leading-relaxed text-zinc-400 font-light">
          Experience AI-powered trading tools designed for serious traders. Trade smarter and manage your investments like a professional.
        </p>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-white/20"
            >
              <h3 className="text-3xl sm:text-4xl font-black text-yellow-400">
                {item.value}
              </h3>
              <p className="mt-2 text-sm text-zinc-400 font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/60 hover:shadow-[0_0_50px_rgba(250,204,21,0.12)] flex flex-col justify-between"
            >
              {/* Background Accent Glow */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl transition-all duration-500 group-hover:bg-yellow-400/20" />

              <div>
                {/* Icon */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-black shadow-lg">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="relative z-10 mt-6 text-2xl font-black text-white tracking-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-zinc-400 font-light">
                  {item.desc}
                </p>

                {/* Included Features Bullet Points */}
                <div className="relative z-10 mt-6 space-y-2.5 border-t border-white/5 pt-6">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-xs font-medium text-zinc-300">
                      Lifetime Access
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-xs font-medium text-zinc-300">
                      Premium Support
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-xs font-medium text-zinc-300">
                      Future Updates
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Badge */}
              <div className="relative z-10 mt-8 inline-flex items-center justify-center rounded-full bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                Included in Premium
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call To Action Banner */}
        <div className="mt-24 rounded-[2.5rem] border border-yellow-400/30 bg-gradient-to-r from-yellow-400/[0.08] via-black/40 to-blue-500/[0.08] p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row text-center lg:text-left">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Ready to Unlock Premium?
              </h3>
              <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-400 font-light">
                Join Stock Scorcher Premium today and unlock AI-powered trading tools, smart alerts, private community and much more.
              </p>
            </div>

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
              className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-400 px-8 py-4 text-base sm:text-lg font-black text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(250,204,21,.35)] cursor-pointer whitespace-nowrap shadow-xl"
            >
              Join Membership
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}