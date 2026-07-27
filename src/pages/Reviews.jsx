import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Star, MessageSquareQuote, CheckCircle2, User, Send, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Reviews() {
  const initialReviews = [
    {
      id: 1,
      name: "Manish Patel",
      role: "Professional Trader",
      image: "MP",
      profit: "+189%",
      rating: 5,
      comment: "Stock Scorcher completely changed my trading mindset. The AI signals and premium strategies helped me become a confident trader.",
      date: "26 July 2026"
    },
    {
      id: 2,
      name: "Priya Verma",
      role: "Beginner Trader",
      image: "P",
      profit: "+92%",
      rating: 5,
      comment: "Started from zero knowledge. The recorded classes and mentorship made everything simple and practical.",
      date: "24 July 2026"
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Investor",
      image: "A",
      profit: "+176%",
      rating: 5,
      comment: "Portfolio tracking and premium community are amazing. Worth every rupee for serious traders.",
      date: "20 July 2026"
    },
  ];

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("stock_scorcher_all_reviews");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialReviews;
      }
    }
    return initialReviews;
  });

  const [formData, setFormData] = useState({
    name: "",
    role: "Professional Trader",
    profit: "+120%",
    rating: 5,
    comment: ""
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem("stock_scorcher_all_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    // Generate initials for avatar box (e.g. "Rahul Sharma" -> "RS")
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newReview = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      image: initials || "U",
      profit: formData.profit,
      rating: Number(formData.rating),
      comment: formData.comment,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    setFormData({ name: "", role: "Professional Trader", profit: "+120%", rating: 5, comment: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const totalReviewsCount = reviews.length;
  const averageRating = (
    reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) / totalReviewsCount
  ).toFixed(1);

  return (
    <>
      <Helmet>
        <title>Student Success Stories & Reviews | Stock Scorcher</title>
        <meta name="description" content="Read real success stories and reviews from traders learning at Stock Scorcher. Submit your review live." />
      </Helmet>

      <div className="relative min-h-screen bg-black text-white pt-28 pb-20 px-6 selection:bg-yellow-400 selection:text-black">
        
        {/* Cinematic Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-16">
          
          {/* Header */}
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400 text-xs font-bold uppercase tracking-widest"
            >
              <MessageSquareQuote size={16} /> Community Wall
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white"
            >
              Student{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Success Stories
              </span>
            </motion.h1>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-light">
              Thousands of traders trust Stock Scorcher to improve their trading journey. Read their stories or add yours below.
            </p>

            {/* Stats Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-3xl border border-white/10 bg-[#060606] backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-yellow-400">{averageRating}</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
              <div className="text-xs text-zinc-400">
                Based on <strong className="text-white font-bold">{totalReviewsCount} Verified Student Reviews</strong>
              </div>
            </motion.div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left: Review Submission Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 rounded-[2.5rem] border border-white/10 bg-[#060606] p-8 backdrop-blur-xl sticky top-28 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Add Your Success Story
                  </h3>
                  <p className="text-xs text-zinc-400">Published instantly</p>
                </div>
              </div>

              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center gap-3 text-yellow-400 text-xs font-bold shadow-lg"
                >
                  <CheckCircle2 size={18} /> Success story posted live successfully!
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Role / Category</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="Professional Trader">Professional Trader</option>
                    <option value="Beginner Trader">Beginner Trader</option>
                    <option value="Investor">Investor</option>
                    <option value="VIP Member">VIP Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Profit Tag (e.g. +150%)</label>
                  <input
                    type="text"
                    required
                    placeholder="+150%"
                    value={formData.profit}
                    onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5 Stars)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Your Experience *</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Share your journey with Stock Scorcher..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(250,204,21,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={16} /> Publish Success Story
                </button>
              </form>
            </motion.div>

            {/* Right: Reviews List Grid matching Testimonials styling */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-[2.5rem] border border-white/10 bg-[#060606] p-8 backdrop-blur-xl transition-all duration-500 hover:border-yellow-400/50 hover:shadow-[0_0_40px_rgba(250,204,21,0.08)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-lg font-black text-black shadow-lg shadow-yellow-400/20 uppercase">
                            {review.image || (review.name ? review.name.charAt(0) : "U")}
                          </div>

                          <div>
                            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                              {review.name}
                              <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                                <ShieldCheck size={12} /> Verified
                              </span>
                            </h3>
                            <p className="text-xs text-yellow-400 font-medium mt-0.5">
                              {review.role}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs font-extrabold text-green-400">
                          {review.profit || "+100%"}
                        </div>
                      </div>

                      <div className="mt-6 flex gap-1 text-yellow-400">
                        {[...Array(Number(review.rating) || 5)].map((_, star) => (
                          <Star key={star} size={16} fill="currentColor" />
                        ))}
                      </div>

                      <p className="mt-5 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                        "{review.comment || review.text}"
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-600 font-medium">
                      <span>Verified Stock Scorcher Student</span>
                      <span className="text-yellow-400">★ {review.date || "Verified"}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}