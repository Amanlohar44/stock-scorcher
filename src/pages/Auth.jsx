import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Loader2, KeyRound, CheckCircle2, Crown, GraduationCap, ArrowRight, X } from "lucide-react";
import "./Auth.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const navigate = useNavigate();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [showDashboardChoice, setShowDashboardChoice] = useState(false);

  // Signup States
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSubmitted, setResetSubmitted] = useState(false);

  // --------------------------------
  // ACCESS VERIFICATION LOGIC
  // --------------------------------
  const verifyAndRedirectUser = async (user) => {
    setCheckingPurchase(true);
    
    const [courseSnap, membershipSnap] = await Promise.all([
      getDoc(doc(db, "purchases", user.uid)),
      getDoc(doc(db, "memberships", user.uid)),
    ]);

    const courseData = courseSnap.exists() ? courseSnap.data() : null;
    const hasCourse = courseData?.purchased === true && courseData?.paymentStatus === "paid";

    const membershipData = membershipSnap.exists() ? membershipSnap.data() : null;
    let hasMembership = false;

    if (membershipData?.status === "active") {
      if (membershipData?.expiryDate) {
        const expiryDate = new Date(membershipData.expiryDate);
        const now = new Date();
        hasMembership = expiryDate > now;
      } else {
        hasMembership = true;
      }
    }

    setCheckingPurchase(false);
    setLoading(false);

    // 1. BOTH COURSE + MEMBERSHIP
    if (hasCourse && hasMembership) {
      setShowDashboardChoice(true);
      return;
    }

    // 2. ONLY COURSE
    if (hasCourse && !hasMembership) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // 3. ONLY MEMBERSHIP
    if (!hasCourse && hasMembership) {
      navigate("/member-dashboard", { replace: true });
      return;
    }

    // 4. NOTHING PURCHASED (Go to Home Page)
    navigate("/", { replace: true });
  };

  // --------------------------------
  // GOOGLE AUTH HANDLER
  // --------------------------------
  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || "Trader",
          email: user.email,
          role: "student",
          createdAt: serverTimestamp(),
        });
      }

      localStorage.setItem("stock_scorcher_logged_in", "true");
      localStorage.setItem("stock_scorcher_user_email", user.email);

      await verifyAndRedirectUser(user);
    } catch (error) {
      console.error("Google Auth Error:", error);
      alert("❌ Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  // --------------------------------
  // EMAIL LOGIN HANDLER
  // --------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        alert(
          "⚠️ Email not verified yet.\n\n" +
          "📧 A fresh verification link has been sent.\n\n" +
          "📂 Please check your Spam, Junk, or Promotions folder if you don't see it in Primary."
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("stock_scorcher_logged_in", "true");
      localStorage.setItem("stock_scorcher_user_email", user.email);

      await verifyAndRedirectUser(user);
    } catch (error) {
      alert("❌ Incorrect email or password.");
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !signupEmail.trim() || !signupPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      alert("❌ Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.trim(), signupPassword);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name.trim() });
      await sendEmailVerification(user);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name.trim(),
        email: user.email,
        role: "student",
        createdAt: serverTimestamp(),
      });
      alert(
        "🎉 Account created successfully!\n\n" +
        "📧 A verification email has been sent.\n\n" +
        "⚠️ Note: If you don't see it in your Inbox, please check your Spam or Promotions folder!"
      );
      setIsRightPanelActive(false);
    } catch (error) {
      alert("❌ Failed to create account: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    if (e) e.preventDefault();
    if (!forgotEmail) { alert("Please enter your email."); return; }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, forgotEmail);
      setResetSubmitted(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Secure Portal | Stock Scorcher</title></Helmet>

      <div className="auth-main-wrapper">
        {showForgot ? (
          <div className="auth-forgot-box">
            <div className="auth-forgot-header">
              <div className="auth-forgot-icon"><KeyRound size={24} /></div>
              <h2>Reset Password</h2>
            </div>
            {resetSubmitted ? (
              <div className="auth-forgot-success">
                <CheckCircle2 size={36} className="text-yellow-400 mx-auto" />
                <p>Reset link sent to {forgotEmail}</p>
                <button onClick={() => { setResetSubmitted(false); setShowForgot(false); }} className="auth-submit-btn">Back to Login</button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="auth-forgot-form">
                <input type="email" placeholder="Enter your registered email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="auth-input-field" />
                <button type="submit" disabled={loading} className="auth-submit-btn">Send Reset Link</button>
                <button type="button" onClick={() => setShowForgot(false)} className="auth-back-link">Back to Login</button>
              </form>
            )}
          </div>
        ) : (
          <div className={`auth-slider-container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
            
            {/* Sign Up Form */}
            <div className="auth-form-container auth-signup-container">
              <form onSubmit={handleSignup} className="auth-inner-form">
                <h1>Create Account</h1>
                
                <button type="button" onClick={handleGoogleAuth} disabled={loading} className="auth-google-btn">
                  <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" width="16" height="16"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.6 3.6 1.7 7.4l3.7 2.9C6.3 7.3 8.9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.4 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.7 6.4C.6 8.6 0 10.2 0 12s.6 3.4 1.7 5.6l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.3-6.6-5.3L1.7 15C3.6 18.8 7.5 23 12 23z"/></svg>
                  Sign up with Google
                </button>
                <span className="auth-divider">or use email</span>

                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="auth-input-field" />
                <input type="email" placeholder="Email Address" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="auth-input-field" />
                <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="auth-input-field" />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-input-field" />
                <button type="submit" disabled={loading} className="auth-submit-btn">
                  {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Sign Up"}
                </button>

                <button type="button" onClick={() => setIsRightPanelActive(false)} className="mobile-switch-link">
                  Already have an account? Sign In
                </button>
              </form>
            </div>

            {/* Sign In Form */}
            <div className="auth-form-container auth-signin-container">
              <form onSubmit={handleLogin} className="auth-inner-form">
                <h1>Sign in</h1>

                <button type="button" onClick={handleGoogleAuth} disabled={loading} className="auth-google-btn">
                  <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" width="16" height="16"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.6 3.6 1.7 7.4l3.7 2.9C6.3 7.3 8.9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.4 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.7 6.4C.6 8.6 0 10.2 0 12s.6 3.4 1.7 5.6l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.3-6.6-5.3L1.7 15C3.6 18.8 7.5 23 12 23z"/></svg>
                  Sign in with Google
                </button>
                <span className="auth-divider">or use account</span>

                <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="auth-input-field" />
                <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="auth-input-field" />
                <button type="button" onClick={() => setShowForgot(true)} className="auth-forgot-pass-btn">Forgot your password?</button>
                <button type="submit" disabled={loading} className="auth-submit-btn">
                  {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : (checkingPurchase ? "Verifying Access..." : "Sign In")}
                </button>

                <button type="button" onClick={() => setIsRightPanelActive(true)} className="mobile-switch-link">
                  Don't have an account? Sign Up
                </button>
              </form>
            </div>

            {/* Sliding Overlay */}
            <div className="auth-overlay-container">
              <div className="auth-overlay">
                <div className="auth-overlay-panel auth-overlay-left">
                  <h1>Welcome Back!</h1>
                  <p>To keep connected with us please login with your personal info</p>
                  <button className="auth-ghost-btn" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
                </div>
                <div className="auth-overlay-panel auth-overlay-right">
                  <h1>Hello There!</h1>
                  <p>Enter your personal details and start journey with us</p>
                  <button className="auth-ghost-btn" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ================= DASHBOARD CHOICE MODAL ================= */}
      <AnimatePresence>
        {showDashboardChoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-2xl px-4 py-6 font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[3.5rem] border border-yellow-500/30 bg-gradient-to-b from-[#0e0e0e] to-[#030303] shadow-[0_0_120px_rgba(250,204,21,0.2)]"
            >
              <button
                onClick={() => setShowDashboardChoice(false)}
                className="absolute right-6 top-6 z-25 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="border-b border-white/10 px-6 py-10 text-center md:px-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black shadow-lg shadow-yellow-400/30">
                  <Crown size={30} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Select Workspace 🚀</h2>
                <p className="mt-2 text-zinc-400 text-sm font-medium">
                  You have active access to both <span className="text-yellow-400 font-bold">Course Modules</span> & <span className="text-green-400 font-bold">VIP Membership</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 md:p-8">
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDashboardChoice(false);
                    navigate("/dashboard", { replace: true });
                  }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-yellow-500/30 bg-gradient-to-br from-yellow-400/[0.08] to-black p-6 text-left cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black font-bold shadow-lg">
                        <GraduationCap size={24} />
                      </div>
                      <ArrowRight size={20} className="text-yellow-400 transition-transform group-hover:translate-x-1.5" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">Course Dashboard</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
                      Access your purchased trading course, video modules, and learning materials.
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    Open Course Area <ArrowRight size={14} />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDashboardChoice(false);
                    navigate("/member-dashboard", { replace: true });
                  }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-green-500/30 bg-gradient-to-br from-green-500/[0.08] to-black p-6 text-left cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white font-bold shadow-lg">
                        <Crown size={24} />
                      </div>
                      <ArrowRight size={20} className="text-green-400 transition-transform group-hover:translate-x-1.5" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">Member Dashboard</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
                      Access AI stock signals, paper trading terminal, and VIP intelligence tools.
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider">
                    Open Member Area <ArrowRight size={14} />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}