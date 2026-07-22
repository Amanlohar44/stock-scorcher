import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";
import StockSearch from "../components/StockSearch";

export default function StockAnalysis() {
  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* Sidebar */}

      <MemberSidebar />

      {/* Main Content */}

      <div className="flex-1 min-w-0">

        {/* Topbar */}

        <MemberTopbar />

        {/* Page Content */}

        <main className="p-6 md:p-8">

          {/* Header */}

          <div className="mb-10">

            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">
              🤖 Premium AI Tool
            </div>

            <h1 className="mt-5 text-3xl md:text-5xl font-black text-white">
              AI Stock Analysis
            </h1>

            <p className="mt-3 max-w-3xl text-gray-400 text-base md:text-lg">
              Analyze stocks using live market data, interactive charts,
              company information and AI-powered trading signals.
            </p>

          </div>

          {/* Stock Search & Analysis */}

          <StockSearch />

        </main>

      </div>

    </div>
  );
}