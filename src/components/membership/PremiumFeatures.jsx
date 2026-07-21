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
      className="relative overflow-hidden bg-[#030303] py-28"
    >

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-[#030303]" />

        {/* Gold Glow */}
        <div className="absolute -top-44 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[170px]" />

        {/* Blue Glow */}
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[170px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)
          `,
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Badge */}

        <div className="flex justify-center">

          <div className="flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400">

            <Sparkles size={16} />

            Premium Membership

          </div>

        </div>

        {/* Heading */}

        <h2 className="mt-8 text-center text-5xl font-black md:text-6xl">

          Unlock

          <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">

            Premium Features

          </span>

        </h2>

        <p className="mx-auto mt-7 max-w-3xl text-center text-lg leading-8 text-zinc-400">

          Experience AI-powered trading tools designed for serious traders.
          Learn faster, trade smarter and manage your investments like a
          professional.

        </p>

        {/* Stats */}

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">

          {stats.map((item) => (

            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur-xl"
            >

              <h3 className="text-4xl font-black text-yellow-400">

                {item.value}

              </h3>

              <p className="mt-3 text-zinc-400">

                {item.label}

              </p>

            </div>

          ))}

        </div>

        {/* Feature Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                      {features.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-yellow-400 hover:shadow-[0_0_45px_rgba(250,204,21,.18)]"
            >
              {/* Glow */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl transition-all duration-500 group-hover:bg-yellow-400/20" />

              {/* Icon */}
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-black">

                {item.icon}

              </div>

              {/* Title */}

              <h3 className="relative z-10 mt-7 text-2xl font-bold text-white">

                {item.title}

              </h3>

              {/* Description */}

              <p className="relative z-10 mt-5 leading-8 text-zinc-400">

                {item.desc}

              </p>

              {/* Features */}

              <div className="relative z-10 mt-8 space-y-3">

                <div className="flex items-center gap-2">

                  <CheckCircle
                    size={18}
                    className="text-green-400"
                  />

                  <span className="text-sm text-zinc-300">

                    Lifetime Access

                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <CheckCircle
                    size={18}
                    className="text-green-400"
                  />

                  <span className="text-sm text-zinc-300">

                    Premium Support

                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <CheckCircle
                    size={18}
                    className="text-green-400"
                  />

                  <span className="text-sm text-zinc-300">

                    Future Updates

                  </span>

                </div>

              </div>

              {/* Badge */}

              <div className="relative z-10 mt-8 inline-flex rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">

                Included in Premium

              </div>

            </div>
          ))}

        </div>

        {/* CTA */}

        <div className="mt-24 rounded-[32px] border border-yellow-400/20 bg-gradient-to-r from-yellow-400/10 via-transparent to-blue-500/10 p-10 backdrop-blur-xl">

          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">

            <div>

              <h3 className="text-4xl font-black text-white">

                Ready to Unlock Premium?

              </h3>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">

                Join Stock Scorcher Premium today and unlock AI-powered
                trading tools, smart alerts, premium community and much more.

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
  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(250,204,21,.35)]"
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