import { useState } from "react";
import {
  FaComments,
  FaCrown,
  FaBullhorn,
  FaVideo,
  FaThumbsUp,
  FaReply,
  FaPlus,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function Community() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("discussions");
  const [newPostText, setNewPostText] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Aman Lohar (Founder)",
      role: "Founder & Chief Trader",
      badge: "Elite Admin",
      time: "2 hours ago",
      content: "🚀 Live Institutional Masterclass scheduled for this Saturday at 7:00 PM IST. We will deep-dive into order flow imbalances and Q3 sector rotation strategies. Check your email for the private Zoom link.",
      likes: 42,
      comments: 12,
      isPinned: true,
    },
    {
      id: 2,
      author: "Vikram Malhotra",
      role: "Pro Member",
      badge: "Verified Trader",
      time: "4 hours ago",
      content: "Noticed heavy institutional accumulation in PSU Banks today. The breakout on SBI is testing key resistance with 3x average volume. Anyone else tracking this setup?",
      likes: 19,
      comments: 5,
      isPinned: false,
    },
    {
      id: 3,
      author: "Neha Sharma",
      role: "Pro Member",
      badge: "Verified Investor",
      time: "Yesterday",
      content: "The StockScorcher AI Scanner flagged Polycab earlier this week. Absolute game changer for swing traders. Thanks for the phenomenal tool setup!",
      likes: 27,
      comments: 8,
      isPinned: false,
    },
  ]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: "You (Pro Member)",
      role: "Elite Member",
      badge: "Verified Investor",
      time: "Just now",
      content: newPostText,
      likes: 0,
      comments: 0,
      isPinned: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
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
                <FaCrown className="text-yellow-400" /> Private Investor Network
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Elite Community & Founder Wire 💬
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl">
                Connect with serious traders, discuss high-probability setups, and access exclusive live masterclasses directly from the founders.
              </p>
            </div>
          </div>

          {/* TABS & ANNOUNCEMENTS BANNER */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              {[
                { id: "discussions", label: "💬 Member Discussions", icon: <FaComments /> },
                { id: "founder", label: "📢 Founder Wire", icon: <FaBullhorn /> },
                { id: "sessions", label: "🎥 Live Masterclasses", icon: <FaVideo /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> 1,420 Pro Traders Online
            </div>
          </div>

          {/* CREATE POST BOX */}
          <div className="rounded-3xl border border-yellow-500/30 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-300">Share a trade setup or market insight with the elite circle:</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="What's your market thesis today? (e.g., Analyzing breakout patterns in IT sector)..."
                rows="3"
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs md:text-sm text-white outline-none focus:border-yellow-400 transition resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Strictly verified elite members only</span>
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xs hover:bg-yellow-300 transition cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <FaPlus /> Publish Discussion
                </button>
              </div>
            </form>
          </div>

          {/* POSTS FEED */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`rounded-3xl border ${
                  post.isPinned ? "border-yellow-400/50 bg-gradient-to-br from-yellow-400/5 via-zinc-950 to-zinc-950" : "border-yellow-500/20 bg-zinc-950"
                } p-6 md:p-8 shadow-xl space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-black">
                      {post.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm md:text-base font-black text-white">{post.author}</h4>
                        <span className="text-[10px] font-bold bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded-md">
                          {post.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">{post.role} • {post.time}</p>
                    </div>
                  </div>

                  {post.isPinned && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full flex items-center gap-1">
                      <FaCrown /> Pinned Announcement
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed pl-2 border-l-2 border-yellow-400/40">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-xs font-bold text-zinc-400">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 hover:text-yellow-400 transition cursor-pointer"
                  >
                    <FaThumbsUp /> {post.likes} Upvotes
                  </button>
                  <button className="flex items-center gap-2 hover:text-yellow-400 transition cursor-pointer">
                    <FaReply /> {post.comments} Comments
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