import { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaChartLine,
  FaShieldAlt,
  FaPaperPlane,
  FaSync,
  FaBrain,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function AiAssistant() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("RELIANCE");
  const [customQuery, setCustomQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello Pro Trader. I am your StockScorcher AI Investor Assistant. Select an asset above or ask me any market intelligence query (e.g., 'Analyze Bitcoin momentum' or 'Explain today's Nifty trend').",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [analysisResult, setAnalysisResult] = useState({
    asset: "RELIANCE (NSE)",
    trend: "Bullish",
    score: "82 / 100",
    riskLevel: "Moderate",
    support: "₹2,680",
    resistance: "₹2,850",
    reasoning: "Strong institutional buying volume backed by robust Q3 earnings growth and positive sector relative strength. Price is consolidating near key moving averages.",
    sentiment: "Positive",
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setAnalyzing(true);

    setTimeout(() => {
      if (asset === "RELIANCE") {
        setAnalysisResult({
          asset: "RELIANCE (NSE)",
          trend: "Bullish",
          score: "82 / 100",
          riskLevel: "Moderate",
          support: "₹2,680",
          resistance: "₹2,850",
          reasoning: "Strong institutional volume and positive sector momentum. Bullish crossover on daily moving averages.",
          sentiment: "Positive",
        });
      } else if (asset === "BTC") {
        setAnalysisResult({
          asset: "BITCOIN (CRYPTO)",
          trend: "Neutral / Consolidation",
          score: "68 / 100",
          riskLevel: "High",
          support: "$62,000",
          resistance: "$68,500",
          reasoning: "Derivatives open interest remains high. Price is testing major psychological resistance with moderate volatility.",
          sentiment: "Neutral",
        });
      } else if (asset === "NIFTY") {
        setAnalysisResult({
          asset: "NIFTY 50 INDEX",
          trend: "Bullish Breakout",
          score: "85 / 100",
          riskLevel: "Low-Moderate",
          support: "23,200",
          resistance: "23,800",
          reasoning: "Sustained FII inflows and strong banking sector leadership driving index past previous swing highs.",
          sentiment: "Positive",
        });
      }
      setAnalyzing(false);
    }, 600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    const userMsg = {
      sender: "user",
      text: customQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const query = customQuery;
    setCustomQuery("");
    setAnalyzing(true);

    setTimeout(() => {
      let aiResponseText = `Based on current market data regarding "${query}", technical indicators show stable momentum. Always maintain proper risk management and stop-loss protocols as markets are inherently volatile.`;
      
      const lower = query.toLowerCase();
      if (lower.includes("reliance")) {
        aiResponseText = "Reliance Industries is displaying strong accumulation near support zones. Institutional delivery volume is up 14% week-over-week.";
      } else if (lower.includes("bitcoin") || lower.includes("btc")) {
        aiResponseText = "Bitcoin is currently trading in a tight range. Watch key ETF inflow metrics and exchange reserve balances for breakout direction.";
      } else if (lower.includes("market") || lower.includes("nifty")) {
        aiResponseText = "Today's broader market breadth is positive with strong participation in midcap financials and IT exporters.";
      }

      const aiMsg = {
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <MemberSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 min-w-0 w-full">
        <MemberTopbar toggleSidebar={() => setOpenSidebar(true)} />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">

          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-yellow-400/10 via-zinc-900 to-black p-6 md:p-8 rounded-3xl border border-yellow-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/20 px-4 py-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
                <FaBrain className="text-yellow-400" /> Neural Market Intelligence
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                AI Research & Investor Assistant 🤖
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl">
                Advanced algorithmic screening, multi-indicator evaluation, and transparent risk analysis powered by institutional data feeds.
              </p>
            </div>
          </div>

          {/* RISK DISCLAIMER NOTICE */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center gap-3">
            <FaExclamationTriangle className="text-amber-400 text-xl shrink-0" />
            <p className="text-xs text-amber-300">
              <strong>Institutional Notice:</strong> AI analysis is for research and educational purposes only. It does not constitute guaranteed financial advice or a direct recommendation to buy or sell securities. Always manage your risk.
            </p>
          </div>

          {/* ASSET QUICK SELECTOR */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Quick Asset Scan:</span>
            {[
              { id: "RELIANCE", label: "RELIANCE (NSE)" },
              { id: "BTC", label: "BITCOIN (Crypto)" },
              { id: "NIFTY", label: "NIFTY 50" },
            ].map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleAssetSelect(asset.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedAsset === asset.id
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                    : "bg-zinc-900 border border-white/10 text-zinc-300 hover:border-yellow-400/40"
                }`}
              >
                {asset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: STRUCTURED AI ANALYSIS REPORT */}
            <div className="lg:col-span-1 rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 shadow-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <FaChartLine className="text-yellow-400" /> Technical Breakdown
                  </h3>
                  {analyzing ? (
                    <FaSync className="animate-spin text-yellow-400" />
                  ) : (
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                      Live Verified
                    </span>
                  )}
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Target Asset</span>
                    <span className="font-bold text-white">{analysisResult.asset}</span>
                  </div>

                  <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Primary Trend</span>
                    <span className="font-black text-yellow-400">{analysisResult.trend}</span>
                  </div>

                  <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Technical Score</span>
                    <span className="font-black text-green-400">{analysisResult.score}</span>
                  </div>

                  <div className="bg-black/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Risk Assessment</span>
                    <span className="font-black text-amber-400">{analysisResult.riskLevel}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/60 p-3 rounded-2xl border border-white/5 text-center">
                      <p className="text-zinc-500 font-semibold text-[10px]">Support Zone</p>
                      <p className="font-bold text-white mt-1">{analysisResult.support}</p>
                    </div>
                    <div className="bg-black/60 p-3 rounded-2xl border border-white/5 text-center">
                      <p className="text-zinc-500 font-semibold text-[10px]">Resistance Zone</p>
                      <p className="font-bold text-white mt-1">{analysisResult.resistance}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className="text-zinc-400 font-semibold">Algorithmic Reasoning:</p>
                    <p className="text-zinc-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
                      {analysisResult.reasoning}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">StockScorcher AI Engine v4.2</p>
              </div>
            </div>

            {/* RIGHT: INTERACTIVE AI ASSISTANT CHAT */}
            <div className="lg:col-span-2 rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 md:p-8 shadow-2xl flex flex-col h-[650px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-lg">
                    <FaRobot />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">StockScorcher Investor Assistant</h3>
                    <p className="text-[10px] text-zinc-400 font-semibold">Ask anything about stocks, crypto, or macro trends.</p>
                  </div>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" title="AI Online" />
              </div>

              {/* Chat Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-yellow-400 text-black font-semibold rounded-br-none"
                          : "bg-black/80 border border-white/10 text-zinc-200 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}
                {analyzing && (
                  <div className="flex items-center gap-2 text-yellow-400 text-xs italic animate-pulse">
                    <FaRobot /> AI is analyzing market indicators...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask AI (e.g., 'Analyze Tesla stock' or 'Why is gold rallying?')..."
                  className="flex-1 bg-black border border-white/10 rounded-2xl px-4 py-3 text-xs md:text-sm text-white outline-none focus:border-yellow-400 transition"
                />
                <button
                  type="submit"
                  disabled={analyzing}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xs hover:bg-yellow-300 transition cursor-pointer shadow-lg disabled:opacity-50 flex items-center gap-2 shrink-0"
                >
                  <FaPaperPlane /> Send
                </button>
              </form>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}