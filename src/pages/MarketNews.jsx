import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, Search, Bookmark, Share2, Sparkles, 
  TrendingUp, TrendingDown, Clock, Filter, ExternalLink, BookmarkCheck, ChevronRight
} from 'lucide-react';

// ==========================================
// MOCK DATA: NEWS & AI SUMMARIES
// ==========================================
const CATEGORIES = ['Top Stories', 'Markets', 'Economy', 'IPO', 'Global', 'Crypto'];

const MOCK_NEWS = [
  {
    id: 1,
    title: "RBI keeps repo rate unchanged at 6.5% for the 8th consecutive time",
    source: "Scorcher Financial",
    time: "15 mins ago",
    category: "Economy",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    impact: "Neutral",
    aiSummary: "The Reserve Bank of India (RBI) MPC decided to hold the repo rate at 6.50%, aligning with market expectations. Inflation remains the primary focus. Banking and auto sectors might see range-bound movement today as no immediate rate cut stimulus was provided.",
    tags: ['RBI', 'Interest Rates', 'Banking']
  },
  {
    id: 2,
    title: "Reliance Retail Q4 Profits surge 22% YoY, announces massive expansion",
    source: "Market Watch",
    time: "1 hour ago",
    category: "Markets",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    impact: "Bullish",
    aiSummary: "Reliance Retail reported a net profit jump of 22%, beating street estimates. The management outlined an aggressive store expansion strategy. Technical indicators for RELIANCE show a strong breakout potential above ₹2950 levels.",
    tags: ['RELIANCE', 'Earnings', 'Retail']
  },
  {
    id: 3,
    title: "US Fed hints at possible rate hike if inflation persists",
    source: "Global Times",
    time: "2 hours ago",
    category: "Global",
    image: "https://images.unsplash.com/photo-1621252179027-9c988c5efbc5?auto=format&fit=crop&q=80&w=800",
    impact: "Bearish",
    aiSummary: "Hawkish comments from Fed officials have spooked global markets. US indices closed in the red, and the ripple effect is expected to gap-down Indian IT and banking stocks today. Safe-haven assets like Gold might see a rally.",
    tags: ['US Fed', 'Inflation', 'Global']
  },
  {
    id: 4,
    title: "Swiggy IPO: Grey Market Premium (GMP) hits 40% ahead of listing",
    source: "Scorcher Exclusives",
    time: "3 hours ago",
    category: "IPO",
    image: null,
    impact: "Bullish",
    aiSummary: "Strong institutional subscription has driven Swiggy's GMP up by 40%. Retail investors are highly active. Expect a strong listing gain if market sentiment remains positive on the listing day.",
    tags: ['IPO', 'Swiggy', 'Startups']
  },
  {
    id: 5,
    title: "Bitcoin crosses $70,000 mark as institutional buying resumes",
    source: "Crypto Wire",
    time: "4 hours ago",
    category: "Crypto",
    image: null,
    impact: "Bullish",
    aiSummary: "Spot Bitcoin ETFs have seen massive inflows over the last 48 hours. BTC has breached the $70k psychological resistance. Next immediate technical target sits at $72,500.",
    tags: ['Bitcoin', 'Crypto', 'ETF']
  }
];

export default function MarketNews() {
  const [activeCategory, setActiveCategory] = useState('Top Stories');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState([2]); // ID 2 is bookmarked by default
  const [expandedNewsId, setExpandedNewsId] = useState(1); // First news expanded for AI summary

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'Top Stories' || news.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const getImpactColor = (impact) => {
    if (impact === 'Bullish') return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (impact === 'Bearish') return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
  };

  const getImpactIcon = (impact) => {
    if (impact === 'Bullish') return <TrendingUp size={14} />;
    if (impact === 'Bearish') return <TrendingDown size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Newspaper className="text-red-600" size={32} />
            Market News & AI Insights
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
            Live updates curated and summarized by Scorcher AI for faster decision making.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search news, stocks, or tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MAIN FEED */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CATEGORY TABS */}
          <div className="flex overflow-x-auto custom-scrollbar pb-2 -mb-2 gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
                  activeCategory === category 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* NEWS LIST */}
          <div className="space-y-4 pt-2">
            <AnimatePresence mode="popLayout">
              {filteredNews.map((news) => {
                const isExpanded = expandedNewsId === news.id;
                const isBookmarked = bookmarks.includes(news.id);

                return (
                  <motion.div 
                    key={news.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                  >
                    <div 
                      className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row gap-5"
                      onClick={() => setExpandedNewsId(isExpanded ? null : news.id)}
                    >
                      {/* Optional Image */}
                      {news.image && (
                        <div className="w-full sm:w-48 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0 hidden sm:block">
                          <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {news.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs font-bold text-zinc-500">
                                <Clock size={12} /> {news.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => toggleBookmark(news.id, e)}
                                className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                              >
                                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                              </button>
                            </div>
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold leading-snug mb-2 group-hover:text-red-600 transition-colors">
                            {news.title}
                          </h3>
                          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">Source: {news.source}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${getImpactColor(news.impact)}`}>
                            {getImpactIcon(news.impact)}
                            {news.impact} Impact
                          </span>
                          {news.tags.map(tag => (
                            <span key={tag} className="text-xs font-medium text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI SUMMARY EXPANSION */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-zinc-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50"
                        >
                          <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                                <Sparkles size={16} />
                              </div>
                              <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100">AI Quick Summary</h4>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-4">
                              {news.aiSummary}
                            </p>
                            <div className="flex items-center gap-3">
                              <button className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                                Read Full Article <ExternalLink size={14} />
                              </button>
                              <button className="flex items-center gap-1 text-sm font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                                <Share2 size={14} /> Share
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredNews.length === 0 && (
              <div className="py-20 text-center bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <Search className="mx-auto h-8 w-8 text-zinc-400 mb-3" />
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No news found</p>
                <p className="text-sm text-zinc-500 mt-1">Try adjusting your search or category filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Trending Topics Widget */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="text-red-600" size={20} />
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {['#Nifty50', '#RBI', '#RelianceRetail', '#USFed', '#SwiggyIPO', '#BitcoinETF'].map((tag, i) => (
                <button key={i} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-500 rounded-lg text-sm font-bold text-zinc-600 dark:text-zinc-300 transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Market Sentiment Widget */}
          <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-900 dark:to-zinc-950 text-white rounded-2xl shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10"></div>
             <div className="p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-green-400" />
                  AI Market Sentiment
                </h3>
                
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-5xl font-black text-green-500">
                    68
                  </span>
                  <span className="text-sm font-medium text-zinc-400 mb-2">/100 (Bullish)</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>FII Data</span>
                      <span className="text-green-400">Net Buyers</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 w-[70%] h-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Global Cues</span>
                      <span className="text-red-400">Weak</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 w-[30%] h-full"></div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2">
                  Full Market Report <ChevronRight size={16} />
                </button>
             </div>
          </div>
          
          {/* Bookmarks Quick Access */}
          {bookmarks.length > 0 && (
            <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Bookmark className="text-red-600" size={20} />
                Saved Reading
              </h3>
              <div className="space-y-3">
                {bookmarks.map(id => {
                  const item = MOCK_NEWS.find(n => n.id === id);
                  if(!item) return null;
                  return (
                    <div key={id} className="flex gap-3 items-start group cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-red-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 transition-colors line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}