import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, HelpCircle, Bot, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Faq() {
  const faqs = [
    {
      question: "Is this course suitable for beginners?",
      answer:
        "Yes. Our course starts from the absolute basics and gradually covers advanced concepts like chart patterns, risk management, and live market analysis.",
    },
    {
      question: "Will I get lifetime access?",
      answer:
        "Absolutely! Once you purchase the Premium Course, you'll receive lifetime access including all future updates at no extra cost.",
    },
    {
      question: "Will I receive PDF notes?",
      answer:
        "Yes. Every student gets professionally designed PDF notes, cheat sheets, and exclusive trading resources.",
    },
    {
      question: "Do you provide live classes & mentorship?",
      answer:
        "Yes. Pro Mentorship students receive live interactive sessions, Q&A support, portfolio reviews, and daily market discussions.",
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <>
      <Helmet>
        <title>FAQ | Stock Scorcher — Frequently Asked Questions</title>
        <meta name="description" content="Find answers to common questions about Stock Scorcher trading courses, memberships, live mentorship, and lifetime access." />
      </Helmet>

      <section className="relative overflow-hidden bg-black text-white py-28 selection:bg-yellow-400 selection:text-black">
        
        {/* Cinematic Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">

          {/* Header */}
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400 text-xs font-bold uppercase tracking-widest"
            >
              <HelpCircle size={16} />
              FAQ
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white"
            >
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Questions
              </span>
            </motion.h2>

            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-light">
              Everything you need to know before joining Stock Scorcher courses and VIP community.
            </p>
          </div>

          {/* FAQ Accordion List */}
          <div className="mt-16 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = open === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-3xl border transition-all duration-300 backdrop-blur-xl ${
                    isOpen 
                      ? "border-yellow-400/50 bg-[#060606] shadow-[0_0_30px_rgba(250,204,21,0.08)]" 
                      : "border-white/10 bg-[#060606] hover:border-yellow-400/30"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 sm:p-7 text-left cursor-pointer"
                  >
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight pr-4">
                      {faq.question}
                    </h3>

                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-yellow-400 transition-transform duration-300 ${isOpen ? "rotate-180 border-yellow-400/40 bg-yellow-400/10" : ""}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-7 sm:px-7 sm:pb-7 text-sm sm:text-base text-zinc-400 font-light leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* AI Assistant Banner Card inside FAQ */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-[2.5rem] border border-yellow-400/30 bg-gradient-to-r from-yellow-400/[0.08] via-[#060606] to-black p-8 sm:p-10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(250,204,21,0.1)]"
          >
            <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black shadow-lg shadow-yellow-400/20">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Still have questions? Ask AI 🤖
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-light">
                  Get instant answers regarding market strategies, courses, and technical analysis from our AI assistant.
                </p>
              </div>
            </div>

            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-black transition-all duration-300 shadow-[0_0_25px_rgba(250,204,21,0.25)] shrink-0 cursor-pointer"
            >
              Chat with AI <ArrowRight size={16} />
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  );
}