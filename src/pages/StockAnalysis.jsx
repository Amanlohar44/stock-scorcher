import Navbar from "../components/NavbarOld";
import Footer from "../components/Footer";
import StockSearch from "../components/StockSearch";

export default function StockAnalysis() {
  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

        <div className="text-center mb-12">

          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400">
            🤖 AI Stock Analysis
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Analyze any stock using AI-powered signals, live price, and technical indicators.
          </p>

        </div>

        <StockSearch />

      </div>

      <Footer />

    </div>
  );
}