import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { KeyRound, Mail, ArrowLeft, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePasswordReset = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      alert("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (error) {
      console.error("Password Reset Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | Stock Scorcher</title>
        <meta name="description" content="Reset your Stock Scorcher account password securely." />
      </Helmet>

      <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 py-16 selection:bg-yellow-400 selection:text-black overflow-hidden">
        
        {/* Cinematic Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[160px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 bg-[#060606] border border-white/10 p-8 sm:p-10 rounded-[2.5rem] w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20">
              <KeyRound size={28} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white">
              Reset <span className="text-yellow-400">Password</span>
            </h1>

            <p className="text-zinc-400 text-sm mt-2 font-light">
              Enter your account email and we'll send you a secure reset link.
            </p>
          </div>

          {submitted ? (
            <div className="bg-yellow-400/10 border border-yellow-400/30 p-6 rounded-2xl text-center space-y-4">
              <CheckCircle2 size={40} className="text-yellow-400 mx-auto" />
              <h3 className="text-white font-bold text-lg">Check Your Inbox</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                We have sent a password reset link to <strong className="text-white">{email}</strong>. Please check your inbox or spam folder.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-yellow-400 text-black py-3 rounded-xl font-bold text-sm mt-4 hover:bg-yellow-300 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="trader@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(250,204,21,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          {!submitted && (
            <div className="text-center mt-8">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-yellow-400 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          )}

          {/* Security Footer Note */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-medium">
            <ShieldCheck size={14} className="text-zinc-400" />
            Secured with 256-Bit Firebase Encryption
          </div>

        </motion.div>
      </div>
    </>
  );
}