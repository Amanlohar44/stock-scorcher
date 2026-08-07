import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Share2, Award, TrendingUp, 
  UserPlus, Image as ImageIcon, Send, Star, Zap,
  MoreHorizontal, MessageCircle, BarChart2, Flame
} from 'lucide-react';

// ==========================================
// MOCK DATA: COMMUNITY FEED & LEADERBOARD
// ==========================================
const CURRENT_USER = {
  name: "Aman Lohar",
  handle: "@amanlohar44",
  badge: "Elite Creator",
  avatar: "A",
  followers: 1240,
  following: 85,
  points: 4500
};

const LEADERBOARD = [
  { rank: 1, name: "Vikram Singh", handle: "@vikram_trades", roi: "+45.2%", badge: "Grandmaster" },
  { rank: 2, name: "Sneha Patel", handle: "@sneha_options", roi: "+38.7%", badge: "Pro" },
  { rank: 3, name: "Rahul Verma", handle: "@rahul_invests", roi: "+31.1%", badge: "Pro" },
  { rank: 4, name: "Aman Lohar", handle: "@amanlohar44", roi: "+28.4%", badge: "Elite Creator" },
  { rank: 5, name: "Priya Desai", handle: "@priya_swing", roi: "+22.9%", badge: "Verified" },
];

const INITIAL_POSTS = [
  {
    id: 1,
    author: { name: "Vikram Singh", handle: "@vikram_trades", avatar: "V", badge: "Grandmaster" },
    time: "2 hours ago",
    content: "Bank Nifty is forming a classic ascending triangle on the 15m timeframe. If it crosses 48,200 with volume, we might see a fast 300-point rally. Keep your stoploss tight at 48,050. What do you guys think? 🚀📊",
    tags: ["#BankNifty", "#OptionsTrading", "#Breakout"],
    likes: 342,
    comments: 45,
    shares: 12,
    isLiked: false
  },
  {
    id: 2,
    author: { name: "Sneha Patel", handle: "@sneha_options", avatar: "S", badge: "Pro" },
    time: "4 hours ago",
    content: "Just booked 40% ROI on my Reliance calls! The AI Screener from StockScorcher accurately predicted this momentum shift yesterday. Consistency is key, folks.",
    tags: ["#Reliance", "#Profits", "#ScorcherAI"],
    likes: 512,
    comments: 89,
    shares: 24,
    isLiked: true
  },
  {
    id: 3,
    author: { name: "Market Wizard", handle: "@wizard_tech", avatar: "M", badge: "Verified" },
    time: "5 hours ago",
    content: "FIIs have been net buyers for the last 3 sessions. IT sector is looking severely oversold. Accumulating TCS and INFY at these levels for a swing trade.",
    tags: ["#FII", "#SwingTrading", "#ITsector"],
    likes: 215,
    comments: 28,
    shares: 8,
    isLiked: false
  }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('Feed');
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: { name: CURRENT_USER.name, handle: CURRENT_USER.handle, avatar: CURRENT_USER.avatar, badge: CURRENT_USER.badge },
      time: "Just now",
      content: newPostText,
      tags: [],
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Grandmaster': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Elite Creator': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Pro': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <MessageCircle className="text-red-600" size={32} />
          Trader's Community
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
          Connect with top traders, share your analysis, and climb the leaderboard.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR: PROFILE & NAVIGATION */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          
          {/* Mini Profile Card */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden text-center">
            <div className="h-24 bg-gradient-to-r from-red-600 to-red-800 relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-black rounded-2xl border-4 border-white dark:border-zinc-900 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                {CURRENT_USER.avatar}
              </div>
            </div>
            <div className="pt-14 pb-6 px-6">
              <h2 className="font-bold text-lg">{CURRENT_USER.name}</h2>
              <p className="text-sm text-zinc-500 mb-3">{CURRENT_USER.handle}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(CURRENT_USER.badge)}`}>
                {CURRENT_USER.badge}
              </span>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="text-xl font-black text-zinc-900 dark:text-white">{CURRENT_USER.followers}</p>
                  <p className="text-xs font-medium text-zinc-500 uppercase">Followers</p>
                </div>
                <div>
                  <p className="text-xl font-black text-zinc-900 dark:text-white">{CURRENT_USER.points}</p>
                  <p className="text-xs font-medium text-zinc-500 uppercase">Points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4 space-y-2">
            {['Feed', 'Trending', 'Following'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-500' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {tab === 'Feed' && <MessageSquare size={18} />}
                {tab === 'Trending' && <Flame size={18} />}
                {tab === 'Following' && <UserPlus size={18} />}
                {tab}
              </button>
            ))}
          </div>

        </div>

        {/* MIDDLE COLUMN: MAIN FEED */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Create Post Input */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 sm:p-6">
            <form onSubmit={handlePostSubmit}>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {CURRENT_USER.avatar}
                </div>
                <textarea 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share your market views, charts, or setups..."
                  className="w-full bg-transparent border-none resize-none focus:outline-none min-h-[80px] text-zinc-900 dark:text-white placeholder-zinc-400 text-lg"
                />
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex gap-2">
                  <button type="button" className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <ImageIcon size={20} />
                  </button>
                  <button type="button" className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <BarChart2 size={20} />
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 hover:bg-red-700 shadow-lg shadow-red-600/20"
                >
                  <Send size={16} /> Post
                </button>
              </div>
            </form>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map(post => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 sm:p-6"
                >
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 shrink-0 bg-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-inner">
                        {post.author.avatar}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-zinc-900 dark:text-white">{post.author.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeColor(post.author.badge)}`}>
                            {post.author.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium">{post.author.handle} • {post.time}</p>
                      </div>
                    </div>
                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Engagement Buttons */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 text-sm font-bold transition-colors group ${
                        post.isLiked ? 'text-red-600' : 'text-zinc-500 hover:text-red-600'
                      }`}
                    >
                      <Heart 
                        size={18} 
                        className={`group-hover:scale-110 transition-transform ${post.isLiked ? 'fill-current' : ''}`} 
                      /> 
                      {post.likes}
                    </button>
                    
                    <button className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-600 transition-colors group">
                      <MessageSquare size={18} className="group-hover:scale-110 transition-transform" /> 
                      {post.comments}
                    </button>
                    
                    <button className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-600 transition-colors group">
                      <Share2 size={18} className="group-hover:scale-110 transition-transform" /> 
                      {post.shares}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT SIDEBAR: LEADERBOARD & TRENDING */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Leaderboard Widget */}
          <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-900 dark:to-zinc-950 text-white rounded-2xl shadow-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all"></div>
            
            <h3 className="font-bold flex items-center gap-2 mb-5">
              <Award className="text-yellow-400" size={20} /> Top Traders (Weekly)
            </h3>
            
            <div className="space-y-4">
              {LEADERBOARD.map((user) => (
                <div key={user.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-black ${
                      user.rank === 1 ? 'text-yellow-400' : 
                      user.rank === 2 ? 'text-zinc-300' : 
                      user.rank === 3 ? 'text-amber-600' : 'text-zinc-600'
                    }`}>
                      #{user.rank}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-zinc-400">{user.handle}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                    {user.roi}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
              View Full Ranking
            </button>
          </div>

          {/* Trending Topics */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="text-red-600" size={18} /> Trending Tags
            </h3>
            <div className="space-y-3">
              {[
                { tag: '#BankNiftyExpiry', posts: '1.2k posts' },
                { tag: '#ScorcherAI', posts: '850 posts' },
                { tag: '#RelianceBreakout', posts: '540 posts' },
                { tag: '#OptionSelling', posts: '420 posts' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center cursor-pointer group">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-red-600 transition-colors">
                    {item.tag}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">{item.posts}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}