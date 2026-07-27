import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, Calendar, User, Clock, ArrowUpRight, Tag, Sparkles, 
  X, Share2, ThumbsUp, Bookmark, ChevronLeft, Calculator, CheckCircle2, 
  Loader2, Flame, Eye, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase Imports
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; 



const customEase = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const BLOG_CATEGORIES = ['All', 'Stock Market', 'Crypto', 'Technical Analysis', 'Trading Strategies', 'Risk Management'];

const FEATURED_POST = {
  id: 'featured-1',
  title: 'Mastering Price Action Trading: A Complete Roadmap for Beginners',
  excerpt: 'Learn how to read naked charts, identify liquidity sweeps, and trade high-probability setups without relying on lagging indicators.',
  category: 'Technical Analysis',
  author: 'Aman Lohar',
  date: 'July 26, 2026',
  readTime: '8 min read',
  views: '14.2k',
  likesCount: 418,
  image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
  slug: 'mastering-price-action-trading',
  content: `
    Price Action trading is the absolute discipline of making trading decisions based purely on historical price movements rather than relying heavily on lagging technical indicators.

    ### 1. Understanding Market Structure
    Markets move in cycles. Before taking any trade position, you must identify whether the macro trend is:
    * **Uptrend:** Higher Highs (HH) and Higher Lows (HL)
    * **Downtrend:** Lower Highs (LH) and Lower Lows (LL)
    * **Consolidation:** Equal Highs and Equal Lows (Sideways Range)

    ### 2. Identifying Liquidity Sweeps
    Institutional smart money requires liquidity to execute large block orders. They frequently push prices past obvious support and resistance levels to trigger retail stop-losses before driving the market toward the true directional target.

    ### 3. Institutional Execution Rule
    Always wait for a verified Change of Character (CHoCH) on lower timeframes after a higher-timeframe key order block is tested before committing capital.
  `
};

const BLOG_POSTS = [
  {
    id: 'post-1',
    title: 'Top 5 Risk Management Rules Every Crypto & Stock Trader Must Follow',
    excerpt: 'Protect your capital first, make profits second. Here is the exact position sizing formula used by professional traders.',
    category: 'Risk Management',
    author: 'Aman Lohar',
    date: 'July 22, 2026',
    readTime: '5 min read',
    views: '9.8k',
    likesCount: 275,
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=800',
    slug: 'top-5-risk-management-rules',
    content: `
      Risk management is the ultimate boundary separating consistent profitability from gambling in financial markets.

      ### Rule 1: The Strict 1% Rule
      Never risk more than 1% to 2% of your total trading capital on a single setup. If your account size is ₹1,00,000, your maximum drawdown per trade should never exceed ₹1,000.

      ### Rule 2: Inflexible Stop-Loss Placement
      A trade executed without a protective stop-loss is an unmanaged liability. Always place stops where the fundamental premise of your trade thesis becomes invalid.

      ### Rule 3: Asymmetric Risk-to-Reward (RRR)
      Target a minimum RRR of 1:2 or higher. For every ₹100 risked, position your profit target to capture at least ₹200.
    `
  },
  {
    id: 'post-2',
    title: 'Understanding Market Structure: Higher Highs, Lower Lows & Liquidity',
    excerpt: 'Decode how institutional order flow drives markets. Learn trend shifts, market structure breaks (MSB), and liquidity pools.',
    category: 'Stock Market',
    author: 'Aman Lohar',
    date: 'July 18, 2026',
    readTime: '6 min read',
    views: '11.4k',
    likesCount: 310,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    slug: 'understanding-market-structure',
    content: `
      Market structure forms the core structural backbone of professional technical analysis.

      ### Market Structure Break (MSB)
      When price decisively breaks a significant Higher Low in an established uptrend, or a Lower High in a downtrend, it signals an institutional shift in market bias.

      ### Core Focus Areas:
      1. Precise identification of Swing Highs and Swing Lows.
      2. Differentiating genuine breakout momentum from bull/bear liquidity traps.
      3. Aligning multi-timeframe confirmation (Daily for macro bias, 15-min for tactical execution).
    `
  },
  {
    id: 'post-3',
    title: 'Crypto Market Cycles: How to Anticipate Altcoin Rotation Phases',
    excerpt: 'Analyze Bitcoin dominance dynamics, liquidity flows, and on-chain volume metrics to stay ahead of retail sentiment.',
    category: 'Crypto',
    author: 'Aman Lohar',
    date: 'July 12, 2026',
    readTime: '7 min read',
    views: '16.5k',
    likesCount: 450,
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800',
    slug: 'crypto-market-cycles',
    content: `
      Crypto assets operate in four distinct macro phases: Accumulation, Markup (Bull Run), Distribution, and Markdown (Bear Phase).

      ### The Capital Rotation Blueprint:
      1. **Bitcoin Inflows:** Institutional capital enters Bitcoin first, driving BTC dominance higher.
      2. **Ethereum & Large-Cap Expansion:** Profits rotate smoothly from BTC into ETH and top-tier altcoins.
      3. **Speculative Altcoin Mania:** High-beta mid and low-cap tokens experience parabolic expansion before cycle exhaustion.
    `
  },
  {
    id: 'post-4',
    title: 'Option Buying vs Option Selling: Structuring Capital Efficiency',
    excerpt: 'A comprehensive comparative breakdown of volatility, time decay (Theta), and win probabilities for derivatives traders.',
    category: 'Trading Strategies',
    author: 'Aman Lohar',
    date: 'July 08, 2026',
    readTime: '9 min read',
    views: '12.9k',
    likesCount: 335,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    slug: 'option-buying-vs-option-selling',
    content: `
      Derivatives trading offers supreme leverage but demands rigorous control over time decay.

      * **Option Buying:** Defined risk, asymmetric upside potential. Demands precise directional momentum and rapid execution timing.
      * **Option Selling:** High statistical win rate (~65-72%), requiring higher margin capital and strict volatility hedging.
    `
  },
  {
    id: 'post-5',
    title: 'Trading Psychology: Defeating FOMO and Eliminating Revenge Trades',
    excerpt: 'Trading is 80% emotional regulation and 20% technical strategy. Build mental frameworks to survive severe drawdowns.',
    category: 'Trading Strategies',
    author: 'Aman Lohar',
    date: 'July 01, 2026',
    readTime: '4 min read',
    views: '8.2k',
    likesCount: 220,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    slug: 'trading-psychology-defeating-fomo',
    content: `
      Your psychological state during active market exposure dictates your long-term account survival.

      ### Overcoming Revenge Trading:
      * Enforce a strict daily stop-loss limit (e.g., maximum 2 consecutive losses per session).
      * Shut down your trading terminal immediately once your daily drawdown threshold is breached.
      * Remember: Preserving buying power guarantees you live to trade another session.
    `
  },
  {
    id: 'post-6',
    title: 'How to Build an Objective Trading Journal for Consistent Edge',
    excerpt: 'Track performance metrics, pinpoint recurring tactical errors, and optimize your trading playbook using our verified framework.',
    category: 'Risk Management',
    author: 'Aman Lohar',
    date: 'June 25, 2026',
    readTime: '6 min read',
    views: '10.3k',
    likesCount: 290,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    slug: 'build-objective-trading-journal',
    content: `
      What gets measured accurately gets systematically improved. A professional trading journal provides indisputable empirical proof of your edge.

      ### Essential Metrics to Log:
      1. Exact Entry, Stop-Loss, and Target prices.
      2. Setup classification and market context.
      3. Pre and post-trade chart screenshots.
      4. Psychological state evaluation (Calm, Hesitant, Overconfident).
    `
  }
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  
  // Interactive State
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_saved_posts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [copied, setCopied] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle');

  // Risk Calculator State
  const [accountSize, setAccountSize] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entryPrice, setEntryPrice] = useState(500);
  const [stopLossPrice, setStopLossPrice] = useState(480);
  const [targetPrice, setTargetPrice] = useState(540);

  // Calculated Metrics
  const totalRiskAmount = (accountSize * riskPercent) / 100;
  const riskPerShare = Math.abs(entryPrice - stopLossPrice);
  const calculatedPositionQty = riskPerShare > 0 ? Math.floor(totalRiskAmount / riskPerShare) : 0;
  const potentialProfitPerShare = Math.abs(targetPrice - entryPrice);
  const totalRewardAmount = calculatedPositionQty * potentialProfitPerShare;
  const riskRewardRatio = totalRiskAmount > 0 ? (totalRewardAmount / totalRiskAmount).toFixed(2) : '0.00';

  useEffect(() => {
    try {
      localStorage.setItem('ss_saved_posts', JSON.stringify(bookmarkedPosts));
    } catch (e) {}
  }, [bookmarkedPosts]);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribeStatus('loading');

    try {
      if (db) {
        await addDoc(collection(db, 'subscribers'), {
          email: newsletterEmail,
          subscribedAt: serverTimestamp(),
          source: 'Stock Scorcher Blog'
        });
      }
    } catch (err) {
      console.log('Firebase store fallback');
    }

    setTimeout(() => {
      setSubscribeStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 4000);
    }, 800);
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Stock Scorcher Blog",
    "url": "https://stockscorcher.com/blog",
    "description": "Stock Market & Crypto Trading insights, price action strategies, and risk management blueprints by Aman Lohar.",
    "publisher": {
      "@type": "Organization",
      "name": "Stock Scorcher",
      "logo": {
        "@type": "ImageObject",
        "url": "https://stockscorcher.com/logo.png"
      }
    },
    "author": {
      "@type": "Person",
      "name": "Aman Lohar"
    }
  };

  return (
    <>
      <Helmet>
        <title>Trading Insights & Market Analysis Blog | Stock Scorcher</title>
        <meta
          name="description"
          content="Master the stock market and crypto trading with expert price action strategies, risk management blueprints, and market insights by Aman Lohar."
        />
        <meta name="keywords" content="Stock Scorcher Blog, Stock Market Learning, Crypto Trading, Price Action, Aman Lohar, Trading Strategies, Risk Management" />
        <link rel="canonical" href="https://stockscorcher.com/blog" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Trading Insights & Market Analysis | Stock Scorcher" />
        <meta property="og:description" content="In-depth price action trading insights, risk management strategies, and crypto market guides by Aman Lohar." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200" />
        <meta property="og:url" content="https://stockscorcher.com/blog" />
        <meta property="og:site_name" content="Stock Scorcher" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stock Scorcher Blog | Aman Lohar" />
        <meta name="twitter:description" content="Master stock market & crypto trading with institutional setups." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200" />

        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <div className="min-h-screen bg-black text-[#ededed] font-sans selection:bg-[#EAB308] selection:text-black flex flex-col antialiased">
        
        {/* Ambient Glow & Grid Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at center, #ffffff 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.12),transparent_70%)] pointer-events-none blur-3xl z-0" />

        <main className="flex-grow relative z-10 pt-36 pb-28 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <section className="text-center pb-16 relative">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
              
              <motion.div variants={fadeUp} className="mb-6 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl shadow-lg">
                <Sparkles className="text-[#EAB308] w-3.5 h-3.5 animate-pulse" />
                <span className="text-xs font-bold tracking-[0.25em] text-neutral-300 uppercase">
                  Stock Scorcher Knowledge Hub
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-none">
                Market Analysis & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] to-amber-600">Trading Wisdom.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base sm:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light mb-10">
                Explore deep-dive technical articles, price action frameworks, and risk management principles curated by Aman Lohar.
              </motion.p>

              {/* Search Bar */}
              <motion.div variants={fadeUp} className="w-full max-w-xl relative mb-8">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-500 pointer-events-none">
                  <Search size={18} />
                </span>
                <input 
                  type="text"
                  placeholder="Search articles by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#EAB308] transition-colors shadow-xl"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer">
                    <X size={16} />
                  </button>
                )}
              </motion.div>

              {/* Categories Filter Tabs */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {BLOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                      selectedCategory === cat 
                        ? "bg-[#EAB308] text-black shadow-[0_0_20px_rgba(234,179,8,0.25)] scale-105" 
                        : "bg-[#080808] text-neutral-400 border border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>

            </motion.div>
          </section>

          {/* Featured Post */}
          {selectedCategory === 'All' && !searchQuery && (
            <section className="pb-16">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="group relative bg-[#060606] border border-white/10 hover:border-[#EAB308]/50 rounded-[2.5rem] overflow-hidden transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 shadow-2xl"
              >
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden z-10" />
                  <img 
                    src={FEATURED_POST.image} 
                    alt={FEATURED_POST.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-[#EAB308] text-black text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Flame size={14} /> Featured Analysis
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4 font-medium">
                      <span className="flex items-center gap-1.5 text-[#EAB308]">
                        <Tag size={13} />
                        {FEATURED_POST.category}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {FEATURED_POST.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 group-hover:text-[#EAB308] transition-colors">
                      {FEATURED_POST.title}
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed mb-8">
                      {FEATURED_POST.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{FEATURED_POST.author}</p>
                        <p className="text-[11px] text-neutral-500">{FEATURED_POST.date}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveArticle(FEATURED_POST)}
                      className="inline-flex items-center gap-2 bg-[#121212] hover:bg-[#EAB308] text-white hover:text-black font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/10 hover:border-[#EAB308] transition-all duration-300 cursor-pointer shadow-lg"
                    >
                      Read Article <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>
          )}

          {/* Blog Grid */}
          <section className="pb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Latest Articles <span className="text-xs ml-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono">{filteredPosts.length}</span>
              </h2>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-[#060606] border border-white/10 rounded-3xl">
                <p className="text-neutral-400 text-lg mb-4">No articles found matching your criteria.</p>
                <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="text-[#EAB308] font-bold text-sm hover:underline cursor-pointer">
                  Clear search and filters
                </button>
              </div>
            ) : (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
              >
                {filteredPosts.map((post) => {
                  const isLiked = likedPosts[post.id];
                  const isBookmarked = bookmarkedPosts[post.id];

                  return (
                    <motion.div 
                      key={post.id}
                      variants={fadeUp}
                      className="group relative bg-[#060606] border border-white/10 hover:border-white/30 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative h-52 w-full overflow-hidden border-b border-white/10">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-black/70 backdrop-blur-md text-white border border-white/20 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                              {post.category}
                            </span>
                          </div>

                          <div className="absolute top-4 right-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }}
                              className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                                isBookmarked ? 'bg-[#EAB308] text-black border-[#EAB308]' : 'bg-black/60 border-white/20 text-white hover:text-[#EAB308]'
                              }`}
                              title="Bookmark"
                            >
                              <Bookmark size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8">
                          <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {post.date}
                            </span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {post.readTime}
                            </span>
                          </div>

                          <h3 
                            onClick={() => setActiveArticle(post)}
                            className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-[#EAB308] transition-colors line-clamp-2 cursor-pointer"
                          >
                            {post.title}
                          </h3>

                          <p className="text-sm text-neutral-400 font-light leading-relaxed line-clamp-3 mb-6">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 sm:px-8 pb-8 pt-0 flex items-center justify-between border-t border-white/5 pt-5">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            isLiked ? 'text-red-400' : 'text-neutral-500 hover:text-white'
                          }`}
                        >
                          <ThumbsUp size={14} className={isLiked ? 'fill-red-400' : ''} />
                          <span>{post.likesCount + (isLiked ? 1 : 0)}</span>
                        </button>

                        <button 
                          onClick={() => setActiveArticle(post)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EAB308] hover:text-white transition-colors cursor-pointer"
                        >
                          Read Article <ArrowUpRight size={15} />
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>

          {/* Position Size & Risk Calculator Section */}
          <section className="pb-16">
            <div className="bg-[#060606] border border-white/10 rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAB308]/5 blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex items-center gap-3.5 mb-8 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30 flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Position Size & Risk Calculator</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light">Calculate precise share quantity and risk-to-reward ratio instantly.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Capital (₹)</label>
                  <input
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Risk Per Trade (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Entry Price (₹)</label>
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Stop Loss (₹)</label>
                  <input
                    type="number"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Target Price (₹)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Calculated Results */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black border border-white/10 p-6 rounded-2xl">
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold block mb-1">Total Risk</span>
                  <span className="text-xl sm:text-2xl font-black text-red-400">₹{totalRiskAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold block mb-1">Recommended Qty</span>
                  <span className="text-xl sm:text-2xl font-black text-[#EAB308]">{calculatedPositionQty} Qty</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold block mb-1">Risk-Reward</span>
                  <span className="text-xl sm:text-2xl font-black text-blue-400">1:{riskRewardRatio}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold block mb-1">Potential Profit</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">₹{totalRewardAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section>
            <div className="bg-gradient-to-r from-[#0d0d0d] via-[#121008] to-[#0d0d0d] border border-[#EAB308]/35 rounded-[2.5rem] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#EAB308]/10 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
                Never Miss a Market Setup with <span className="text-[#EAB308]">Stock Scorcher</span>
              </h3>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed mb-8">
                Join thousands of traders receiving exclusive weekly market breakdowns, risk strategies, and price action trade setups directly from Aman Lohar.
              </p>

              {subscribeStatus === 'success' ? (
                <div className="max-w-md mx-auto bg-[#EAB308]/10 border border-[#EAB308]/30 p-4 rounded-2xl text-[#EAB308] font-semibold text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} className="text-[#EAB308]" />
                  <span>Subscribed Successfully! Welcome to Stock Scorcher.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-5 py-3.5 rounded-xl text-sm outline-none transition-colors placeholder:text-neutral-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscribeStatus === 'loading'}
                    className="bg-[#EAB308] hover:bg-yellow-400 text-black font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.25)] whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                  >
                    {subscribeStatus === 'loading' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <span>Subscribe Free</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </section>

        </main>

        
      </div>

      {/* Article Modal Overlay */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 sm:p-12 my-auto text-left"
            >
              
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-8 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md z-20 pt-1">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer font-bold"
                >
                  <ChevronLeft size={16} /> Back to Articles
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(activeArticle.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      likedPosts[activeArticle.id] ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                    title="Like"
                  >
                    <ThumbsUp size={16} className={likedPosts[activeArticle.id] ? 'fill-red-400' : ''} />
                  </button>
                  <button
                    onClick={() => toggleBookmark(activeArticle.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      bookmarkedPosts[activeArticle.id] ? 'bg-[#EAB308] border-[#EAB308] text-black font-bold' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark size={16} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all relative cursor-pointer"
                    title="Share"
                  >
                    <Share2 size={16} />
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#EAB308] text-black font-bold text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <span className="inline-block bg-[#EAB308]/10 border border-[#EAB308]/30 text-[#EAB308] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
                  {activeArticle.category}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white mb-6 leading-tight">
                  {activeArticle.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-400">
                  <span className="flex items-center gap-1.5 text-white font-bold"><User size={15} className="text-[#EAB308]" /> {activeArticle.author}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5"><Calendar size={15} /> {activeArticle.date}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5"><Clock size={15} /> {activeArticle.readTime}</span>
                </div>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-invert max-w-none text-neutral-300 text-sm sm:text-base leading-relaxed space-y-5 mb-10 whitespace-pre-line font-light">
                {activeArticle.content}
              </div>

              <div className="bg-black border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EAB308] to-amber-600 p-0.5 flex-shrink-0">
                  <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center font-black text-white text-base">
                    AL
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                    <span>Written by Aman Lohar</span>
                    <Shield size={14} className="text-[#EAB308] fill-[#EAB308]/20" />
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 font-light">Founder & Lead Trader at Stock Scorcher. Specialized in price action trading, market structure, and retail risk management.</p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}