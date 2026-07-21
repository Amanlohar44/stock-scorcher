import { Link } from "react-router-dom";
import { Crown, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function MembershipHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">

      {/* Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-yellow-500/10 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-36">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-5 py-2">

            <Crown className="text-yellow-400" size={18} />

            <span className="text-yellow-300 font-semibold">
              Stock Scorcher AI Membership
            </span>

          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight text-white">

            Unlock

            <span className="block text-yellow-400">

              AI Powered Stock Analysis

            </span>

          </h1>

          <p className="mt-8 text-gray-400 max-w-3xl mx-auto text-lg md:text-xl leading-8">

            Get professional AI stock analysis, paper trading,
            portfolio insights, AI mentor, smart alerts and much more —
            all in one premium membership.

          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">

            <a href="#pricing">

              <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all">

                Become Premium

                <ArrowRight size={20} />

              </button>

            </a>

            <Link to="/stock-analysis">

              <button className="border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-8 py-4 rounded-2xl font-bold transition-all">

                Try Free Analysis

              </button>

            </Link>

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

            <Sparkles className="text-yellow-400 mb-5" size={34} />

            <h3 className="text-2xl font-bold text-white">

              AI Recommendation

            </h3>

            <p className="text-gray-400 mt-3">

              Get BUY, SELL or HOLD suggestions with confidence score.

            </p>

          </div>

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

            <ShieldCheck className="text-green-400 mb-5" size={34} />

            <h3 className="text-2xl font-bold text-white">

              Paper Trading

            </h3>

            <p className="text-gray-400 mt-3">

              Practice with ₹10,00,000 virtual balance without risking money.

            </p>

          </div>

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

            <Crown className="text-yellow-400 mb-5" size={34} />

            <h3 className="text-2xl font-bold text-white">

              Premium Community

            </h3>

            <p className="text-gray-400 mt-3">

              Unlock exclusive AI tools and upcoming premium features.

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}