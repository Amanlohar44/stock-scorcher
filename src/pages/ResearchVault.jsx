import { useState } from "react";
import {
  FaFolderOpen,
  FaFilePdf,
  FaDownload,
  FaLock,
  FaShieldAlt,
  FaChartBar,
  FaSearch,
  FaCrown,
} from "react-icons/fa";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function ResearchVault() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Reports");
  const [searchQuery, setSearchQuery] = useState("");

  const researchReports = [
    {
      id: 1,
      title: "Q3 Institutional Strategy & Sector Rotation Outlook",
      category: "Monthly Outlook",
      date: "July 2026",
      size: "4.2 MB",
      author: "StockScorcher Research Desk",
      badge: "Exclusive",
      description: "Comprehensive macro analysis covering banking credit growth, capital goods momentum, and FII positioning.",
    },
    {
      id: 2,
      title: "Renewable Energy & EV Infrastructure Deep-Dive",
      category: "Sector Analysis",
      date: "July 2026",
      size: "6.8 MB",
      author: "Equity Quantitative Team",
      badge: "High Conviction",
      description: "Detailed fundamental breakdown of top 5 green energy players with 3-year valuation projections.",
    },
    {
      id: 3,
      title: "Advanced Order Flow Imbalance & Liquidity Traps",
      category: "Masterclass Notes",
      date: "June 2026",
      size: "3.1 MB",
      author: "Aman Lohar (Founder)",
      badge: "Pro Core",
      description: "Technical playbook on reading level-2 market depth and institutional block deals.",
    },
    {
      id: 4,
      title: "Midcap Growth Stocks: Fundamental Screening Playbook",
      category: "Company Research",
      date: "June 2026",
      size: "5.5 MB",
      author: "Institutional Screening Unit",
      badge: "Verified Data",
      description: "Screening models identifying debt-free companies with 20%+ return on capital employed (ROCE).",
    },
  ];

  const filteredReports = researchReports.filter(
    (item) =>
      (activeCategory === "All Reports" || item.category === activeCategory) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDownload = (title) => {
    alert(`📥 Downloading secured secure report: "${title}". Thank you for being an Elite Member!`);
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
                <FaCrown className="text-yellow-400" /> Institutional Archive
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Research Vault & Reports 📁
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl">
                Access exclusive weekly reports, deep sector analysis, and proprietary fundamental research papers compiled by our quantitative desk.
              </p>
            </div>
          </div>

          {/* CATEGORIES & SEARCH BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950 p-4 rounded-3xl border border-yellow-500/20 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {["All Reports", "Monthly Outlook", "Sector Analysis", "Masterclass Notes", "Company Research"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer ${
                    activeCategory === cat
                      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search research documents..."
                className="w-full bg-black border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white outline-none focus:border-yellow-400 transition"
              />
            </div>
          </div>

          {/* REPORTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-400">
                      {report.category}
                    </span>
                    <span className="text-xs text-zinc-500 font-semibold">
                      {report.date} • {report.size}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl shrink-0">
                      <FaFilePdf />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white hover:text-yellow-400 transition">
                        {report.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-semibold">Author: {report.author}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/5">
                    {report.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <FaShieldAlt /> Secured Vault Access
                  </span>

                  <button
                    onClick={() => handleDownload(report.title)}
                    className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-xs hover:bg-yellow-300 transition cursor-pointer shadow-lg shrink-0"
                  >
                    <FaDownload /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}