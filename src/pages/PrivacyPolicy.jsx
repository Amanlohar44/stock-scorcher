import React from "react";
import { Helmet } from "react-helmet-async";
import { ShieldCheck, Lock, Eye, Database, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Stock Scorcher</title>
        <meta name="description" content="Read the Privacy Policy of Stock Scorcher to understand how we collect, use, and protect your personal and financial data." />
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
              <ShieldCheck size={16} /> Legal & Compliance
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-white"
            >
              Privacy{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>
            <p className="mt-3 text-sm text-zinc-400 font-light">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
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
                <Eye className="text-yellow-400" size={20} /> 1. Introduction
              </h2>
              <p>
                Welcome to <strong className="text-white font-semibold">Stock Scorcher</strong> ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="text-yellow-400" size={20} /> 2. Information We Collect
              </h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-400 text-sm">
                <li><strong className="text-zinc-200">Identity Data:</strong> Includes first name, last name, username or similar identifier.</li>
                <li><strong className="text-zinc-200">Contact Data:</strong> Includes email address, telephone numbers, and billing address.</li>
                <li><strong className="text-zinc-200">Transaction Data:</strong> Includes details about payments to and from you and other details of courses or memberships you have purchased.</li>
                <li><strong className="text-zinc-200">Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting, and operating system.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="text-yellow-400" size={20} /> 3. Data Security
              </h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. All transactions and sensitive data are processed through secure 256-bit encrypted channels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="text-yellow-400" size={20} /> 4. Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at: <br />
                <a href="mailto:stockscorcher@gmail.com" className="text-yellow-400 font-medium hover:underline">stockscorcher@gmail.com</a>
              </p>
            </section>

          </motion.div>

        </div>
      </div>
    </>
  );
}