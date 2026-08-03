import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  UserPlus,
  Mail,
  LockKeyhole,
  ShieldCheck,
  Loader2,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      // Save user's display name
      await updateProfile(user, {
        displayName: name.trim(),
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name.trim(),
        email: user.email,
        role: "student",
        isPremium: false,
        createdAt: serverTimestamp(),
      });

      // Make sure navbar doesn't consider user logged in yet
      localStorage.removeItem("stock_scorcher_logged_in");
      localStorage.removeItem("stock_scorcher_user_email");

      alert(
        "🎉 Account created successfully!\n\n" +
          "📧 A verification email has been sent to your email address.\n\n" +
          "Please verify your email before logging in."
      );

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signup Error:", error);

      let errorMessage = "❌ Failed to create account. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "⚠️ This email is already registered.\n\nPlease login instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "❌ Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "⚠️ Password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "🌐 Network error. Please check your internet connection.";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | Stock Scorcher</title>
        <meta
          name="description"
          content="Create your Stock Scorcher account and start learning stock market trading."
        />
      </Helmet>

      <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 py-16 selection:bg-yellow-400 selection:text-black overflow-hidden">

        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[160px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 bg-[#060606] border border-white/10 p-8 sm:p-10 rounded-[2.5rem] w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >

          {/* Header */}
          <div className="text-center mb-8">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20">
              <UserPlus size={28} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white">
              Create <span className="text-yellow-400">Account</span>
            </h1>

            <p className="text-zinc-400 text-sm mt-2 font-light">
              Join the Stock Scorcher trading community
            </p>
          </div>

          <form onSubmit={handleSignup}>

            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="email"
                  placeholder="trader@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 placeholder:text-zinc-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-400 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors disabled:opacity-50 placeholder:text-zinc-600"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-400 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(250,204,21,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </form>

          {/* Login Link */}
          <p className="text-center text-zinc-400 text-sm mt-8 font-light">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-400 font-bold hover:underline"
            >
              Login
            </Link>
          </p>

          {/* Verification Note */}
          <div className="mt-6 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={17}
                className="text-yellow-400 mt-0.5 shrink-0"
              />

              <p className="text-[11px] leading-relaxed text-zinc-400">
                After creating your account, you'll receive a verification
                email. Please verify your email before logging in.
              </p>
            </div>
          </div>

          {/* Security */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-medium">
            <ShieldCheck size={14} className="text-zinc-400" />
            Secured with Firebase Authentication
          </div>

        </motion.div>
      </div>
    </>
  );
}