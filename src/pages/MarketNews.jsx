import { useCallback, useEffect, useState, useMemo } from "react";
import {
  FaNewspaper,
  FaChartLine,
  FaBitcoin,
  FaDollarSign,
  FaSyncAlt,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaSearch,
  FaFire,
} from "react-icons/fa";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";
import { getMarketNews } from "../services/finnhub";

const categories = [
  { name: "All Feeds", apiCategory: null, icon: <FaNewspaper /> },
  { name: "Stocks", apiCategory: "general", icon: <FaChartLine /> },
  { name: "Crypto", apiCategory: "crypto", icon: <FaBitcoin /> },
  { name: "Forex", apiCategory: "forex", icon: <FaDollarSign /> },
];

function formatTime(timestamp) {
  if (!timestamp) return "Just now";
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCategoryLabel(category) {
  if (category === "general") return "Equities";
  if (category === "crypto") return "Crypto";
  if (category === "forex") return "Forex";
  return "Global";
}

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="rounded-3xl border border-yellow-500/10 bg-zinc-950 p-6 animate-pulse space-y-4"
        >
          <div className="flex justify-between">
            <div className="h-6 w-20 rounded-full bg-zinc-900" />
            <div className="h-5 w-24 rounded bg-zinc-900" />
          </div>
          <div className="h-7 w-4/5 rounded bg-zinc-900" />
          <div className="h-4 w-full rounded bg-zinc-900" />
          <div className="h-4 w-3/4 rounded bg-zinc-900" />
        </div>
      ))}
    </div>
  );
}

export default function MarketNews() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Feeds");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNews = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const selectedCategory = categories.find(
          (category) => category.name === activeCategory
        );

        let finalNews = [];

        if (activeCategory === "All Feeds") {
          const results = await Promise.allSettled([
            getMarketNews("general"),
            getMarketNews("crypto"),
            getMarketNews("forex"),
          ]);

          results.forEach((result, index) => {
            if (result.status === "fulfilled") {
              const categoryNames = ["general", "crypto", "forex"];
              const categoryName = categoryNames[index];
              const categoryNews = result.value.map((item) => ({
                ...item,
                category: categoryName,
              }));
              finalNews.push(...categoryNews);
            }
          });
        } else {
          const data = await getMarketNews(selectedCategory.apiCategory);
          finalNews = data.map((item) => ({
            ...item,
            category: selectedCategory.apiCategory,
          }));
        }

        // Clean up invalid entries
        finalNews = finalNews.filter((item) => item.headline && item.url);

        // Remove duplicate URLs
        const uniqueNews = Array.from(
          new Map(finalNews.map((item) => [item.url, item])).values()
        );

        // Sort latest first
        uniqueNews.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));

        setNews(uniqueNews.slice(0, 40));
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Market News Error:", err);
        setError("Unable to sync financial intelligence feeds right now.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeCategory]
  );

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Filter news based on search query
  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return news;
    return news.filter(
      (item) =>
        item.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [news, searchQuery]);

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <MemberSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 min-w-0 w-full">
        <MemberTopbar toggleSidebar={() => setOpenSidebar(true)} />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">

          {/* TOP BANNER */}
          <div className="bg-gradient-to-r from-yellow-400/10 via-zinc-900 to-black p-6 md:p-8 rounded-3xl border border-yellow-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/20 px-4 py-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
                  <FaFire className="text-yellow-400" /> Institutional Financial Intelligence
                </div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                  Global Market News Terminal 📰
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm max-w-2xl">
                  Real-time algorithmic feeds tracking macroeconomics, equities, cryptocurrency movements, and forex liquidity.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchNews(true)}
                  disabled={refreshing || loading}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 text-black px-5 py-3 font-black text-xs hover:bg-yellow-300 transition cursor-pointer shadow-lg disabled:opacity-50 shrink-0"
                >
                  <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Syncing..." : "Sync Live Feeds"}
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH & CATEGORY BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950 p-4 rounded-3xl border border-yellow-500/20 shadow-xl">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 font-bold text-xs transition cursor-pointer ${
                    activeCategory === category.name
                      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headlines or source..."
                className="w-full bg-black border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white outline-none focus:border-yellow-400 transition"
              />
            </div>
          </div>

          {/* STATUS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4 flex items-center justify-between">
              <span className="text-zinc-400 text-xs font-semibold">Feed Status</span>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-bold text-green-400 text-xs uppercase">Connected</span>
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4 flex items-center justify-between">
              <span className="text-zinc-400 text-xs font-semibold">Active Stream</span>
              <span className="font-bold text-white text-xs">{activeCategory}</span>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-4 flex items-center justify-between">
              <span className="text-zinc-400 text-xs font-semibold">Last Synchronized</span>
              <span className="font-bold text-yellow-400 text-xs">
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                  : "Syncing..."}
              </span>
            </div>
          </div>

          {/* ERROR STATE */}
          {error && !loading && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center space-y-4">
              <FaExclamationTriangle className="mx-auto text-4xl text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Connection Interrupted</h3>
              <p className="text-gray-400 text-xs">{error}</p>
              <button
                onClick={() => fetchNews(true)}
                className="rounded-xl bg-yellow-400 px-5 py-2.5 font-bold text-black text-xs hover:bg-yellow-300 cursor-pointer shadow-lg"
              >
                Reconnect Stream
              </button>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && <NewsSkeleton />}

          {/* NEWS GRID */}
          {!loading && !error && filteredNews.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredNews.map((item, index) => (
                <article
                  key={`${item.url}-${index}`}
                  className="group rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 transition-all duration-300 hover:border-yellow-400/60 hover:bg-zinc-900 shadow-xl flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-400">
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-xs text-zinc-500 font-semibold">
                        {formatTime(item.datetime)}
                      </span>
                    </div>

                    {item.image && (
                      <div className="overflow-hidden rounded-2xl border border-white/5">
                        <img
                          src={item.image}
                          alt={item.headline}
                          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <h3 className="text-lg md:text-xl font-black leading-tight transition group-hover:text-yellow-400">
                      {item.headline}
                    </h3>

                    <p className="text-xs md:text-sm leading-relaxed text-zinc-400 line-clamp-3">
                      {item.summary || "Read complete institutional coverage and analytical breakdown from the original source."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-zinc-300">{item.source || "Market Wire"}</p>
                      <p className="text-[10px] text-zinc-500">Stock Scorcher Intelligence</p>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black cursor-pointer shadow-lg shrink-0"
                    >
                      Read Article <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* EMPTY SEARCH / NO RESULTS */}
          {!loading && !error && filteredNews.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-12 text-center space-y-3">
              <FaNewspaper className="mx-auto text-4xl text-zinc-600" />
              <h3 className="text-xl font-bold">No Matching Headlines Found</h3>
              <p className="text-zinc-400 text-xs">Try searching for a different keyword or switch categories.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 rounded-xl bg-yellow-400 px-5 py-2.5 font-bold text-black text-xs hover:bg-yellow-300 cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}