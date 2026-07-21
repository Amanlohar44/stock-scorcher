import {
  GraduationCap,
  CandlestickChart,
  TrendingUp,
  ShieldCheck,
  FileText,
  Infinity,
} from "lucide-react";

const features = [
  {
    title: "Master Chart Patterns",
    icon: GraduationCap,
  },
  {
    title: "Candlestick Analysis",
    icon: CandlestickChart,
  },
  {
    title: "Swing Trading",
    icon: TrendingUp,
  },
  {
    title: "Risk Management",
    icon: ShieldCheck,
  },
  {
    title: "Lifetime Access",
    icon: Infinity,
  },
  {
    title: "PDF Notes",
    icon: FileText,
  },
];

export default function Features() {
  return (
    <section className="relative bg-[#030303] py-24 px-6">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        <h2 className="text-center text-5xl font-black text-white">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Stock Scorcher?
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-center text-zinc-400 text-lg">
          Everything you need to become a profitable trader in one premium platform.
        </p>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/60 hover:bg-white/10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-400 transition-all duration-500 group-hover:bg-yellow-400 group-hover:text-black">
                  <Icon size={32} />
                </div>

                <h3 className="mt-7 text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  Learn professional strategies with real market examples,
                  AI-powered education and practical trading concepts.
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}