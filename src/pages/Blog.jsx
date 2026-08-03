import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, Calendar, User, Clock, ArrowUpRight, Tag, Sparkles, 
  X, Share2, ThumbsUp, Bookmark, ChevronLeft, Calculator, CheckCircle2, 
  Loader2, Flame, Eye, Shield, TrendingUp, Layers, MessageSquare, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase Imports
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc, increment, where } from 'firebase/firestore';
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

// Helper to convert standard YouTube links to embed links safely
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
};

// Smart Content Renderer (Handles both Plain Text and HTML safely)
const renderContent = (content) => {
  if (!content) return null;
  const hasHTML = /<[a-z][\s\S]*>/i.test(content);
  if (hasHTML) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <div className="whitespace-pre-line">{content}</div>;
};

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  
  // 🔥 Load More State
  const [visibleCount, setVisibleCount] = useState(6);
  
  const urlChecked = useRef(false);

  // Interactive State
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_liked_posts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [bookmarkedPosts, setBookmarkedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_saved_posts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [viewedPosts, setViewedPosts] = useState(new Set());
  const [copied, setCopied] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle');

  // Comments State
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  const [submittingComment, setSubmittingComment] = useState(false);

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

  useEffect(() => {
    try {
      localStorage.setItem('ss_liked_posts', JSON.stringify(likedPosts));
    } catch (e) {}
  }, [likedPosts]);

  // Fetch blogs from Firestore
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot?.docs?.map(doc => {
          const data = doc?.data();
          return {
            id: doc?.id,
            title: data?.title || 'Untitled Article',
            excerpt: data?.description || 'No description available.',
            content: data?.description || 'No content provided.',
            category: data?.category || 'Uncategorized',
            image: data?.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
            videoUrl: data?.videoUrl || null,
            author: 'Aman Lohar',
            date: data?.createdAt?.seconds 
              ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
              : 'Recent',
            readTime: '5 min read',
            views: data?.views || 0,
            likesCount: data?.likesCount || 0,
          };
        });
        setBlogPosts(fetchedPosts || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setFetchError(err?.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Fetch Comments for active article
  useEffect(() => {
    if (activeArticle) {
      const fetchComments = async () => {
        setLoadingComments(true);
        try {
          const q = query(collection(db, 'comments'), where('postId', '==', activeArticle.id));
          const snapshot = await getDocs(q);
          const fetchedComments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dateObj: doc.data().createdAt?.seconds ? new Date(doc.data().createdAt.seconds * 1000) : new Date(),
            displayDate: doc.data().createdAt?.seconds 
              ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
              : 'Just now'
          }));
          
          fetchedComments.sort((a, b) => b.dateObj - a.dateObj);
          setComments(fetchedComments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        } finally {
          setLoadingComments(false);
        }
      };
      fetchComments();
    } else {
      setComments([]);
    }
  }, [activeArticle?.id]);

  // Deep Linking logic
  useEffect(() => {
    if (blogPosts.length > 0 && !urlChecked.current) {
      urlChecked.current = true;
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      if (articleId) {
        const targetPost = blogPosts.find(p => p.id === articleId);
        if (targetPost) {
          handleOpenArticle(targetPost, true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogPosts]);

  // Reset Load More count when search or category changes
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, searchQuery]);

  const { featuredPost, gridPosts, trendingPosts } = useMemo(() => {
    if (!blogPosts || blogPosts?.length === 0) return { featuredPost: null, gridPosts: [], trendingPosts: [] };
    
    const sortedByViews = [...blogPosts].sort((a, b) => (b.views || 0) - (a.views || 0));
    
    return {
      featuredPost: blogPosts[0],
      gridPosts: blogPosts?.slice(1),
      trendingPosts: sortedByViews.slice(0, 3)
    };
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    return gridPosts?.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post?.category === selectedCategory;
      const matchesSearch =
        post?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        post?.excerpt?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        post?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [gridPosts, selectedCategory, searchQuery]);

  // Slice for Load More Pagination
  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const relatedPosts = useMemo(() => {
    if (!activeArticle) return [];
    return blogPosts
      .filter(p => p.category === activeArticle.category && p.id !== activeArticle.id)
      .slice(0, 2); 
  }, [activeArticle, blogPosts]);

  const toggleLike = async (postId) => {
    const isCurrentlyLiked = likedPosts[postId];
    
    setLikedPosts((prev) => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setBlogPosts((prevPosts) => 
      prevPosts.map((post) => 
        post.id === postId 
          ? { ...post, likesCount: Math.max(0, (post.likesCount || 0) + (isCurrentlyLiked ? -1 : 1)) }
          : post
      )
    );

    if (activeArticle?.id === postId) {
      setActiveArticle((prev) => ({ ...prev, likesCount: Math.max(0, (prev.likesCount || 0) + (isCurrentlyLiked ? -1 : 1)) }));
    }

    try {
      const postRef = doc(db, 'blogs', postId);
      await updateDoc(postRef, {
        likesCount: increment(isCurrentlyLiked ? -1 : 1)
      });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev?.[postId] }));
  };

  const handleShare = () => {
    if (navigator?.clipboard) {
      const shareUrl = `${window.location.origin}${window.location.pathname}?article=${activeArticle?.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenArticle = async (post, isInitialLoad = false) => {
    const isFirstViewInSession = !viewedPosts.has(post.id);
    
    if (!isInitialLoad) {
      window.history.pushState({}, '', `?article=${post.id}`);
    }

    if (isFirstViewInSession) {
      setViewedPosts((prev) => new Set(prev).add(post.id));
      
      const updatedPost = { ...post, views: (post.views || 0) + 1 };
      setActiveArticle(updatedPost);
      
      setBlogPosts((prevPosts) => 
        prevPosts.map(p => p.id === post.id ? updatedPost : p)
      );

      try {
        const postRef = doc(db, 'blogs', post.id);
        await updateDoc(postRef, { views: increment(1) });
      } catch (error) {
        console.error("Error updating views:", error);
      }
    } else {
      setActiveArticle(post);
    }
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.text.trim() || !activeArticle) return;

    setSubmittingComment(true);
    try {
      const commentData = {
        postId: activeArticle.id,
        authorName: newComment.name.trim(),
        text: newComment.text.trim(),
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      
      setComments(prev => [{
        id: docRef.id,
        ...commentData,
        displayDate: 'Just now',
        dateObj: new Date()
      }, ...prev]);
      
      setNewComment({ name: '', text: '' });
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubscribe = async (e) => {
    e?.preventDefault();
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
      console.log('Firebase store fallback', err);
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
                  onChange={(e) => setSearchQuery(e?.target?.value)}
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
                {BLOG_CATEGORIES?.map((cat) => (
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

          {/* Dynamic Rendering Area Based on Fetch State */}
          {loading ? (
            <section className="pb-16 flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#EAB308] animate-spin mb-6" />
              <h3 className="text-white text-xl font-bold tracking-widest uppercase mb-2">Decrypting Markets</h3>
              <p className="text-neutral-500 font-light text-sm">Fetching the latest insights...</p>
            </section>
          ) : fetchError ? (
            <section className="pb-16 flex flex-col items-center justify-center py-20 text-center">
              <p className="text-red-400 mb-4">{fetchError}</p>
              <button onClick={() => window.location.reload()} className="text-[#EAB308] underline text-sm font-bold">Try Again</button>
            </section>
          ) : blogPosts?.length === 0 ? (
            <section className="pb-16">
              <div className="flex flex-col items-center justify-center py-24 bg-[#060606] border border-white/10 rounded-[2.5rem] shadow-2xl mx-auto text-center p-8">
                  <div className="w-20 h-20 bg-[#EAB308]/10 rounded-full flex items-center justify-center mb-6">
                      <Search className="text-[#EAB308] w-10 h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">No Insights Found</h3>
                  <p className="text-neutral-400 font-light max-w-md mx-auto mb-8">We haven't published any articles yet. Check back soon for deep-dive market analysis and trading wisdom.</p>
              </div>
            </section>
          ) : (
            <>
              {/* Featured Post */}
              {selectedCategory === 'All' && !searchQuery && featuredPost && (
                <section className="pb-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="group relative bg-[#060606] border border-white/10 hover:border-[#EAB308]/50 rounded-[2.5rem] overflow-hidden transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 shadow-2xl"
                  >
                    <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-[#121212]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden z-10" />
                      <img 
                        src={featuredPost?.image} 
                        alt={featuredPost?.title}
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
                            {featuredPost?.category}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {featuredPost?.readTime}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1.5">
                            <Eye size={13} />
                            {featuredPost?.views} Views
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 group-hover:text-[#EAB308] transition-colors">
                          {featuredPost?.title}
                        </h2>

                        <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed mb-8 line-clamp-3 md:line-clamp-4">
                          {featuredPost?.excerpt?.replace(/<[^>]+>/g, '') || ''} {/* Strips HTML if excerpt has it */}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <div 
                          onClick={() => handleOpenArticle(featuredPost)}
                          className="flex items-center gap-3 cursor-pointer group/author"
                        >
                          <div className="w-9 h-9 rounded-full bg-white/10 group-hover/author:bg-[#EAB308] group-hover/author:text-black flex items-center justify-center text-xs font-bold text-white transition-colors">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover/author:text-[#EAB308] transition-colors">{featuredPost?.author}</p>
                            <p className="text-[11px] text-neutral-500">{featuredPost?.date}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleOpenArticle(featuredPost)}
                          className="inline-flex items-center gap-2 bg-[#121212] hover:bg-[#EAB308] text-white hover:text-black font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/10 hover:border-[#EAB308] transition-all duration-300 cursor-pointer shadow-lg"
                        >
                          Read Article <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </section>
              )}

              {/* Trending Posts Section */}
              {selectedCategory === 'All' && !searchQuery && trendingPosts?.length > 1 && (
                <section className="pb-16">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-[#EAB308]" size={20} />
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Trending Now</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {trendingPosts.map((post, idx) => (
                      <div 
                        key={post.id}
                        onClick={() => handleOpenArticle(post)}
                        className="group flex items-center gap-4 bg-[#080808] border border-white/10 hover:border-white/30 p-3 rounded-2xl cursor-pointer transition-all hover:bg-[#121212]"
                      >
                        <div className="font-black text-4xl text-white/5 group-hover:text-[#EAB308]/20 transition-colors w-8 text-center">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white text-sm font-bold line-clamp-2 group-hover:text-[#EAB308] transition-colors">{post.title}</h4>
                          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1 mt-1">
                            <Eye size={10} /> {post.views} Views
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Blog Grid */}
              <section className="pb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <Layers size={22} className="text-[#EAB308]" />
                    Latest Articles <span className="text-xs ml-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono">{filteredPosts?.length || 0}</span>
                  </h2>
                </div>

                {filteredPosts?.length === 0 ? (
                  <div className="text-center py-20 bg-[#060606] border border-white/10 rounded-3xl">
                    <p className="text-neutral-400 text-lg mb-4">No articles found matching your criteria.</p>
                    <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="text-[#EAB308] font-bold text-sm hover:underline cursor-pointer">
                      Clear search and filters
                    </button>
                  </div>
                ) : (
                  <>
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
                    >
                      {displayedPosts?.map((post) => {
                        const isLiked = likedPosts?.[post?.id];
                        const isBookmarked = bookmarkedPosts?.[post?.id];

                        return (
                          <motion.div 
                            key={post?.id}
                            variants={fadeUp}
                            className="group relative bg-[#060606] border border-white/10 hover:border-white/30 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between shadow-xl"
                          >
                            <div>
                              {/* Thumbnail */}
                              <div className="relative h-52 w-full overflow-hidden border-b border-white/10 bg-[#121212]">
                                <img 
                                  src={post?.image} 
                                  alt={post?.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                                />
                                <div className="absolute top-4 left-4">
                                  <span className="bg-black/70 backdrop-blur-md text-white border border-white/20 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    {post?.category}
                                  </span>
                                </div>

                                <div className="absolute top-4 right-4">
                                  <button
                                    onClick={(e) => { e?.stopPropagation(); toggleBookmark(post?.id); }}
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
                                    {post?.date}
                                  </span>
                                  <span>&bull;</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {post?.readTime}
                                  </span>
                                </div>

                                <h3 
                                  onClick={() => handleOpenArticle(post)}
                                  className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-[#EAB308] transition-colors line-clamp-2 cursor-pointer"
                                >
                                  {post?.title}
                                </h3>

                                <p className="text-sm text-neutral-400 font-light leading-relaxed line-clamp-3 mb-6">
                                  {post?.excerpt?.replace(/<[^>]+>/g, '') || ''}
                                </p>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 sm:px-8 pb-8 pt-0 flex items-center justify-between border-t border-white/5 pt-5">
                              <button
                                onClick={() => toggleLike(post?.id)}
                                className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                                  isLiked ? 'text-red-400' : 'text-neutral-500 hover:text-white'
                                }`}
                              >
                                <ThumbsUp size={14} className={isLiked ? 'fill-red-400' : ''} />
                                <span>{post?.likesCount || 0}</span>
                              </button>

                              <button 
                                onClick={() => handleOpenArticle(post)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EAB308] hover:text-white transition-colors cursor-pointer"
                              >
                                Read Article <ArrowUpRight size={15} />
                              </button>
                            </div>

                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* 🔥 LOAD MORE BUTTON 🔥 */}
                    {visibleCount < filteredPosts?.length && (
                      <motion.div variants={fadeUp} className="flex justify-center mt-12">
                        <button
                          onClick={() => setVisibleCount(prev => prev + 6)}
                          className="bg-transparent border border-[#EAB308]/50 text-[#EAB308] hover:bg-[#EAB308] hover:text-black font-bold text-sm px-8 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.1)] cursor-pointer"
                        >
                          Load More Articles
                        </button>
                      </motion.div>
                    )}
                  </>
                )}
              </section>
            </>
          )}

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
                    onChange={(e) => setAccountSize(Number(e?.target?.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Risk Per Trade (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e?.target?.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Entry Price (₹)</label>
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e?.target?.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Stop Loss (₹)</label>
                  <input
                    type="number"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(Number(e?.target?.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Target Price (₹)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e?.target?.value))}
                    className="w-full bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Calculated Results */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black border border-white/10 p-6 rounded-2xl">
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold block mb-1">Total Risk</span>
                  <span className="text-xl sm:text-2xl font-black text-red-400">₹{totalRiskAmount?.toLocaleString()}</span>
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
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">₹{totalRewardAmount?.toLocaleString()}</span>
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
                    onChange={(e) => setNewsletterEmail(e?.target?.value)}
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
                  onClick={handleCloseArticle}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer font-bold"
                >
                  <ChevronLeft size={16} /> Back to Articles
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(activeArticle?.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                      likedPosts?.[activeArticle?.id] ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                    title="Like"
                  >
                    <ThumbsUp size={16} className={likedPosts?.[activeArticle?.id] ? 'fill-red-400' : ''} />
                    <span className="text-xs font-bold">{activeArticle?.likesCount || 0}</span>
                  </button>
                  <button
                    onClick={() => toggleBookmark(activeArticle?.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      bookmarkedPosts?.[activeArticle?.id] ? 'bg-[#EAB308] border-[#EAB308] text-black font-bold' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark size={16} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all relative cursor-pointer"
                    title="Share Link"
                  >
                    <Share2 size={16} />
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#EAB308] text-black font-bold text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                        Link Copied!
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleCloseArticle}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <span className="inline-block bg-[#EAB308]/10 border border-[#EAB308]/30 text-[#EAB308] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
                  {activeArticle?.category}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white mb-6 leading-tight">
                  {activeArticle?.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-400">
                  <span className="flex items-center gap-1.5 text-white font-bold"><User size={15} className="text-[#EAB308]" /> {activeArticle?.author}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5"><Calendar size={15} /> {activeArticle?.date}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5"><Clock size={15} /> {activeArticle?.readTime}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5"><Eye size={15} /> {activeArticle?.views || 0} Views</span>
                </div>
              </div>

              {activeArticle?.videoUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10 bg-[#121212]">
                  <iframe
                    src={getYouTubeEmbedUrl(activeArticle?.videoUrl)}
                    title={activeArticle?.title || 'YouTube video'}
                    className="w-full h-full border-0 absolute top-0 left-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10 bg-[#121212]">
                  <img
                    src={activeArticle?.image}
                    alt={activeArticle?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Enhanced Content Renderer */}
              <div className="prose prose-invert max-w-none text-neutral-300 text-sm sm:text-base leading-relaxed space-y-5 mb-10 font-light">
                {renderContent(activeArticle?.content)}
              </div>

              <div className="bg-black border border-white/10 rounded-2xl p-6 flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EAB308] to-amber-600 p-0.5 flex-shrink-0">
                  <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center font-black text-white text-base">
                    AL
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                    <span>Written by {activeArticle?.author}</span>
                    <Shield size={14} className="text-[#EAB308] fill-[#EAB308]/20" />
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 font-light">Founder & Lead Trader at Stock Scorcher. Specialized in price action trading, market structure, and retail risk management.</p>
                </div>
              </div>

              {/* Discussion & Comments Section */}
              <div className="pt-10 border-t border-white/10 mb-10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#EAB308]" /> 
                  Community Discussion
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-neutral-400 font-normal">{comments.length}</span>
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="bg-[#121212] border border-white/10 p-5 rounded-2xl mb-8">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={newComment.name}
                      onChange={(e) => setNewComment({...newComment, name: e.target.value})}
                      className="bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3 rounded-xl text-sm outline-none transition-colors sm:w-1/3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Share your thoughts on this analysis..."
                      value={newComment.text}
                      onChange={(e) => setNewComment({...newComment, text: e.target.value})}
                      className="bg-black border border-white/10 focus:border-[#EAB308] text-white px-4 py-3 rounded-xl text-sm outline-none transition-colors flex-1"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.name.trim() || !newComment.text.trim()}
                      className="bg-[#EAB308] hover:bg-yellow-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {submittingComment ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      Post Comment
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-5">
                  {loadingComments ? (
                    <div className="flex items-center gap-3 text-neutral-500 text-sm py-4">
                      <Loader2 size={16} className="animate-spin" /> Loading discussion...
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8 bg-[#121212] border border-white/5 rounded-2xl">
                      <MessageSquare size={24} className="text-neutral-600 mx-auto mb-2" />
                      <p className="text-neutral-400 text-sm font-light">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4 p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#EAB308] font-bold flex-shrink-0 border border-white/10">
                          {comment.authorName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-white text-sm font-bold">{comment.authorName}</h5>
                            <span className="text-[10px] text-neutral-500">{comment.displayDate}</span>
                          </div>
                          <p className="text-neutral-300 text-sm font-light leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Related Posts Section */}
              {relatedPosts?.length > 0 && (
                <div className="pt-8 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-6">Read Next in {activeArticle?.category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {relatedPosts.map((relatedPost) => (
                      <div 
                        key={relatedPost.id}
                        onClick={() => handleOpenArticle(relatedPost)}
                        className="group flex gap-4 bg-[#121212] border border-white/5 hover:border-white/20 p-3 rounded-2xl cursor-pointer transition-all"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black">
                          <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-white text-sm font-bold line-clamp-2 group-hover:text-[#EAB308] transition-colors mb-1.5">{relatedPost.title}</h4>
                          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
                            <Eye size={10} /> {relatedPost.views} Views
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}