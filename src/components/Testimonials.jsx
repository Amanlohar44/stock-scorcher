import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MessageSquareQuote, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const initialReviews = [
    {
      name: "Manish Patel",
      role: "Professional Trader",
      image: "MP",
      profit: "+189%",
      rating: 5,
      text: "Stock Scorcher completely changed my trading mindset. The AI signals and premium strategies helped me become a confident trader.",
    },
    {
      name: "Priya Verma",
      role: "Beginner Trader",
      image: "P",
      profit: "+92%",
      rating: 5,
      text: "Started from zero knowledge. The recorded classes and mentorship made everything simple and practical.",
    },
    {
      name: "Amit Patel",
      role: "Investor",
      image: "A",
      profit: "+176%",
      rating: 5,
      text: "Portfolio tracking and premium community are amazing. Worth every rupee for serious traders.",
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

  return (
    <section className="relative overflow-hidden bg-black py-28 selection:bg-yellow-400 selection:text-black">

      {/* Cinematic Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400 text-xs font-bold uppercase tracking-widest"
          >
            <MessageSquareQuote size={16} /> Community Wall
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight"
          >
            Student{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Success Stories
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-light"
          >
            Thousands of traders trust Stock Scorcher to improve their trading journey and achieve consistent profitability.
          </motion.p>
        </div>

        {/* Reviews Cards Grid (Showing strictly latest 3 reviews) */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 3).map((review, index) => (
            <motion.div
              key={review.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-[2.5rem] border border-white/10 bg-[#060606] p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/50 hover:shadow-[0_0_40px_rgba(250,204,21,0.08)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-lg font-black text-black shadow-lg shadow-yellow-400/20 uppercase">
                      {review.image || (review.name ? review.name.charAt(0) : "U")}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-white text-base">
                        {review.name}
                      </h3>
                      <p className="text-xs text-yellow-400 font-medium">
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
                <span className="text-yellow-400">★ Verified</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA to view all reviews / submit review */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            to="/reviews"
            className="inline-flex items-center gap-3 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 hover:bg-yellow-400 px-8 py-4 text-sm font-extrabold text-yellow-400 hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(250,204,21,0.15)] cursor-pointer"
          >
            View All Reviews & Submit Yours <ArrowRight size={18} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}