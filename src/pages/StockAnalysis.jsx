import MemberLayout from "../components/member/MemberLayout";
import StockSearch from "../components/StockSearch";

export default function StockAnalysis() {
  return (
    <MemberLayout>

      <div className="p-4 md:p-8">

        {/* Header */}
        <div className="mb-8 md:mb-10">

          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">
            🤖 Premium AI Tool
          </div>

          <h1 className="mt-5 text-3xl font-black text-white md:text-5xl">
            AI Stock Analysis
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-gray-400 md:text-lg">
            Analyze stocks using live market data, interactive charts,
            company information and AI-powered trading signals.
          </p>

        </div>

        {/* Stock Search */}
        <StockSearch />

      </div>

    </MemberLayout>
  );
}