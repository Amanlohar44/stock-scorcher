import { useCallback, useEffect, useState } from "react";
import {
  FaNewspaper,
  FaChartLine,
  FaBitcoin,
  FaDollarSign,
  FaSyncAlt,
  FaExternalLinkAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";
import { getMarketNews } from "../services/finnhub";

const categories = [
  {
    name: "All",
    apiCategory: null,
    icon: <FaNewspaper />,
  },
  {
    name: "Stocks",
    apiCategory: "general",
    icon: <FaChartLine />,
  },
  {
    name: "Crypto",
    apiCategory: "crypto",
    icon: <FaBitcoin />,
  },
  {
    name: "Forex",
    apiCategory: "forex",
    icon: <FaDollarSign />,
  },
];

function formatTime(timestamp) {
  if (!timestamp) return "Recently";

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
  if (category === "general") return "Stocks";
  if (category === "crypto") return "Crypto";
  if (category === "forex") return "Forex";

  return "Market";
}

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="rounded-3xl border border-yellow-500/10 bg-zinc-900 p-6 animate-pulse"
        >
          <div className="flex justify-between">
            <div className="h-6 w-20 rounded-full bg-zinc-800" />
            <div className="h-5 w-24 rounded bg-zinc-800" />
          </div>

          <div className="h-7 w-4/5 rounded bg-zinc-800 mt-6" />

          <div className="h-4 w-full rounded bg-zinc-800 mt-5" />
          <div className="h-4 w-11/12 rounded bg-zinc-800 mt-3" />
          <div className="h-4 w-3/4 rounded bg-zinc-800 mt-3" />

          <div className="flex justify-between mt-8">
            <div className="h-4 w-28 rounded bg-zinc-800" />
            <div className="h-4 w-20 rounded bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MarketNews() {
  const [openSidebar, setOpenSidebar] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");

  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const selectedCategory = categories.find(
          (category) => category.name === activeCategory
        );

        let finalNews = [];

        if (activeCategory === "All") {
          const results = await Promise.allSettled([
            getMarketNews("general"),
            getMarketNews("crypto"),
            getMarketNews("forex"),
          ]);

          results.forEach((result, index) => {
            if (result.status === "fulfilled") {
              const categoryNames = [
                "general",
                "crypto",
                "forex",
              ];

              const categoryName = categoryNames[index];

              const categoryNews = result.value.map((item) => ({
                ...item,
                category: categoryName,
              }));

              finalNews.push(...categoryNews);
            }
          });
        } else {
          const data = await getMarketNews(
            selectedCategory.apiCategory
          );

          finalNews = data.map((item) => ({
            ...item,
            category: selectedCategory.apiCategory,
          }));
        }

        // Remove invalid news
        finalNews = finalNews.filter(
          (item) => item.headline && item.url
        );

        // Remove duplicate URLs
        const uniqueNews = Array.from(
          new Map(
            finalNews.map((item) => [item.url, item])
          ).values()
        );

        // Latest first
        uniqueNews.sort(
          (a, b) => (b.datetime || 0) - (a.datetime || 0)
        );

        // Limit news
        setNews(uniqueNews.slice(0, 30));

        setLastUpdated(new Date());
      } catch (err) {
        console.error("Market News Error:", err);

        setError(
          "Unable to load market news right now. Please try again."
        );
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

  const handleRefresh = () => {
    fetchNews(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden">

      {/* =========================
          SIDEBAR
      ========================= */}

      <MemberSidebar
        open={openSidebar}
        setOpen={setOpenSidebar}
      />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="flex-1 min-w-0 w-full">

        {/* TOPBAR */}

        <MemberTopbar
          toggleSidebar={() =>
            setOpenSidebar(true)
          }
        />

        {/* CONTENT */}

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">

          {/* =========================
              HEADER
          ========================= */}

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">
                <FaNewspaper />

                Premium Market News
              </div>

              <h1 className="mt-5 text-3xl md:text-5xl font-black">
                Market News
              </h1>

              <p className="mt-3 max-w-3xl text-gray-400 text-base md:text-lg">
                Stay updated with the latest developments
                across Stocks, Crypto and Forex markets.
              </p>

            </div>

            {/* REFRESH */}

            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center justify-center gap-3 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black disabled:opacity-50"
            >

              <FaSyncAlt
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh News"}

            </button>

          </div>


          {/* =========================
              CATEGORY FILTER
          ========================= */}

          <div className="mt-8 flex gap-3 overflow-x-auto pb-2">

            {categories.map((category) => (

              <button
                key={category.name}
                onClick={() =>
                  setActiveCategory(category.name)
                }
                className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                  activeCategory === category.name
                    ? "bg-yellow-400 text-black"
                    : "border border-white/10 bg-zinc-900 text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400"
                }`}
              >

                {category.icon}

                {category.name}

              </button>

            ))}

          </div>


          {/* =========================
              MARKET STATUS
          ========================= */}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900 p-5">

              <p className="text-gray-400 text-sm">
                News Feed
              </p>

              <div className="flex items-center gap-2 mt-2">

                <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

                <span className="font-bold text-green-400">
                  Live
                </span>

              </div>

            </div>


            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900 p-5">

              <p className="text-gray-400 text-sm">
                Coverage
              </p>

              <p className="mt-2 font-bold">
                Stocks • Crypto • Forex
              </p>

            </div>


            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-900 p-5">

              <p className="text-gray-400 text-sm">
                Last Updated
              </p>

              <p className="mt-2 font-bold text-yellow-400">
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "Loading..."}
              </p>

            </div>

          </div>


          {/* =========================
              NEWS SECTION
          ========================= */}

          <div className="mt-10">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-2xl font-bold">
                  Latest Market Updates
                </h2>

                <p className="mt-2 text-gray-400">
                  Real-time market news and important
                  developments.
                </p>

              </div>

            </div>


            {/* ERROR */}

            {error && !loading && (

              <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">

                <FaExclamationTriangle className="mx-auto text-4xl text-red-400" />

                <h3 className="mt-4 text-xl font-bold text-red-400">
                  News Unavailable
                </h3>

                <p className="mt-2 text-gray-400">
                  {error}
                </p>

                <button
                  onClick={handleRefresh}
                  className="mt-5 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
                >
                  Try Again
                </button>

              </div>

            )}


            {/* LOADING */}

            {loading && <div className="mt-6">
              <NewsSkeleton />
            </div>}


            {/* NEWS GRID */}

            {!loading && !error && news.length > 0 && (

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                {news.map((item, index) => (

                  <article
                    key={`${item.url}-${index}`}
                    className="group rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-yellow-400/5"
                  >

                    {/* TOP */}

                    <div className="flex items-center justify-between gap-4">

                      <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                        {getCategoryLabel(
                          item.category
                        )}
                      </span>

                      <span className="text-xs sm:text-sm text-gray-500">
                        {formatTime(
                          item.datetime
                        )}
                      </span>

                    </div>


                    {/* IMAGE */}

                    {item.image && (

                      <div className="mt-5 overflow-hidden rounded-2xl">

                        <img
                          src={item.image}
                          alt={item.headline}
                          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      </div>

                    )}


                    {/* TITLE */}

                    <h3 className="mt-5 text-xl md:text-2xl font-bold leading-tight transition group-hover:text-yellow-400">

                      {item.headline}

                    </h3>


                    {/* DESCRIPTION */}

                    <p className="mt-3 leading-7 text-gray-400">

                      {item.summary ||
                        "Read the latest market developments and financial news from the original source."}

                    </p>


                    {/* FOOTER */}

                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div>

                        <p className="text-sm font-semibold text-gray-300">

                          {item.source ||
                            "Market News"}

                        </p>

                        <p className="text-xs text-gray-500 mt-1">

                          Stock Scorcher News

                        </p>

                      </div>


                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
                      >

                        Read Full Article

                        <FaExternalLinkAlt
                          size={12}
                        />

                      </a>

                    </div>

                  </article>

                ))}

              </div>

            )}


            {/* EMPTY */}

            {!loading &&
              !error &&
              news.length === 0 && (

                <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-900 p-10 text-center">

                  <FaNewspaper className="mx-auto text-4xl text-gray-600" />

                  <h3 className="mt-4 text-xl font-bold">
                    No News Found
                  </h3>

                  <p className="mt-2 text-gray-400">
                    Try refreshing or selecting another category.
                  </p>

                  <button
                    onClick={handleRefresh}
                    className="mt-5 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
                  >
                    Refresh News
                  </button>

                </div>

              )}

          </div>

        </main>

      </div>

    </div>
  );
}