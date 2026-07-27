import React from "react";
import { Helmet } from "react-helmet-async";
import { FileText, AlertTriangle, ShieldAlert, CheckCircle, Scale } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Stock Scorcher</title>
        <meta name="description" content="Read the Terms and Conditions of Stock Scorcher. Review our educational disclaimers, membership rules, and usage policies." />
      </Helmet>

      <div className="relative min-h-screen bg-black text-white pt-28 pb-20 px-6 selection:bg-yellow-400 selection:text-black">
        
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400 text-xs font-bold uppercase tracking-widest"
            >
              <Scale size={16} /> User Agreement
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-white"
            >
              Terms &{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Conditions
              </span>
            </motion.h1>
            <p className="mt-3 text-sm text-zinc-400 font-light">
              Please read these terms carefully before using Stock Scorcher platform.
            </p>
          </div>

          {/* Content Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] border border-white/10 bg-[#060606] p-8 sm:p-12 backdrop-blur-xl space-y-8 text-zinc-300 font-light leading-relaxed"
          >
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="text-yellow-400" size={20} /> 1. Agreement to Terms
              </h2>
              <p>
                By accessing or using <strong className="text-white font-semibold">Stock Scorcher</strong>, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our platform, courses, or premium services.
              </p>
            </section>

            <section className="space-y-3 p-6 rounded-2xl bg-yellow-400/[0.05] border border-yellow-400/20">
              <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <AlertTriangle size={20} /> 2. Important Financial & Educational Disclaimer
              </h2>
              <p className="text-sm text-zinc-300">
                Stock Scorcher is an educational platform designed to provide learning materials, chart pattern analysis tools, and paper trading simulations. <strong className="text-white">We are not SEBI-registered financial advisors.</strong> All content, courses, AI signals, and resources provided are strictly for educational and informational purposes only and should not be construed as professional financial advice. Stock and crypto trading involve substantial risk of loss.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="text-yellow-400" size={20} /> 3. Purchases & Access
              </h2>
              <p>
                When you purchase a course or VIP membership on Stock Scorcher, you receive lifetime access (or as specified by the membership tier) for personal use only. Sharing your account credentials or distributing course PDF notes publicly will result in immediate termination of your account without refund.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-yellow-400" size={20} /> 4. Limitation of Liability
              </h2>
              <p>
                Stock Scorcher and its mentors shall not be held liable for any financial losses, trading losses, or damages arising directly or indirectly from the use of our educational content, software tools, or signal insights.
              </p>
            </section>

          </motion.div>

        </div>
      </div>
    </>
  );
}