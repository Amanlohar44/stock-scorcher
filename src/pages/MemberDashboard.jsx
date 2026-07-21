import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";
import MemberStatCard from "../components/member/MemberStatCard";
import MemberFeatureCard from "../components/member/MemberFeatureCard";

export default function MemberDashboard() {

  return (

    <div className="min-h-screen bg-black text-white flex">

      <MemberSidebar />

      <div className="flex-1">

        <MemberTopbar />

        <div className="p-8">

          <h1 className="text-4xl font-bold text-yellow-400">
            Welcome Pro Member 👑
          </h1>

          <p className="text-gray-400 mt-2">
            AI Powered Trading Dashboard
          </p>

          <div className="grid md:grid-cols-4 gap-6 mt-10">

            <MemberStatCard
              title="Portfolio"
              value="₹0"
              color="text-green-400"
            />

            <MemberStatCard
              title="Profit"
              value="+0%"
              color="text-green-400"
            />

            <MemberStatCard
              title="Watchlist"
              value="0"
              color="text-yellow-400"
            />

            <MemberStatCard
              title="Signals"
              value="BUY"
              color="text-green-400"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            <MemberFeatureCard
              title="📈 Live Market"
              desc="Track live stock prices and charts."
            />

            <MemberFeatureCard
              title="🤖 AI Analysis"
              desc="Get AI powered Buy/Sell recommendations."
            />

            <MemberFeatureCard
              title="📄 Paper Trading"
              desc="Practice trading without risking money."
            />

            <MemberFeatureCard
              title="⭐ Watchlist"
              desc="Save your favorite stocks."
            />

          </div>

        </div>

      </div>

    </div>

  );
}