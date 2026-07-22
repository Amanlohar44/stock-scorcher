import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import {
  Crown,
  GraduationCap,
  ArrowRight,
  X,
  LockKeyhole,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Dashboard popup
  const [showDashboardChoice, setShowDashboardChoice] = useState(false);

  // Dashboard checking
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  // --------------------------------
  // LOGIN
  // --------------------------------

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // --------------------------------
      // EMAIL VERIFICATION
      // --------------------------------

      if (!user.emailVerified) {
        await sendEmailVerification(user);

        alert(
          "⚠️ Your email is not verified yet.\n\n" +
            "📧 A new verification email has been sent.\n\n" +
            "👉 Please check your Primary, Promotions, Spam or Inbox tabs.\n\n" +
            "If you're using Gmail, the email may appear in the Promotions tab."
        );

        setLoading(false);
        return;
      }

      // --------------------------------
      // CHECK PURCHASES
      // --------------------------------

      setCheckingPurchase(true);

      const [courseSnap, membershipSnap] =
        await Promise.all([
          getDoc(
            doc(db, "purchases", user.uid)
          ),

          getDoc(
            doc(db, "memberships", user.uid)
          ),
        ]);

      // --------------------------------
      // COURSE PURCHASE CHECK
      // --------------------------------

      const courseData = courseSnap.exists()
        ? courseSnap.data()
        : null;

      const hasCourse =
        courseData?.purchased === true &&
        courseData?.paymentStatus === "paid";

      // --------------------------------
      // MEMBERSHIP CHECK
      // --------------------------------

      const membershipData =
        membershipSnap.exists()
          ? membershipSnap.data()
          : null;

      let hasMembership = false;

      if (
        membershipData?.status === "active"
      ) {
        // Check membership expiry
        if (membershipData?.expiryDate) {
          const expiryDate = new Date(
            membershipData.expiryDate
          );

          const now = new Date();

          hasMembership =
            expiryDate > now;
        } else {
          hasMembership = true;
        }
      }

      // --------------------------------
      // BOTH COURSE + MEMBERSHIP
      // --------------------------------

      if (hasCourse && hasMembership) {
        setCheckingPurchase(false);
        setLoading(false);

        setShowDashboardChoice(true);

        return;
      }

      // --------------------------------
      // ONLY COURSE
      // --------------------------------

      if (hasCourse && !hasMembership) {
        alert("✅ Login Successful");

        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      // --------------------------------
      // ONLY MEMBERSHIP
      // --------------------------------

      if (!hasCourse && hasMembership) {
        alert("👑 Login Successful");

        navigate("/member-dashboard", {
          replace: true,
        });

        return;
      }

      // --------------------------------
      // NOTHING PURCHASED
      // --------------------------------

      alert(
        "✅ Login Successful\n\n" +
          "You don't have an active course or membership yet."
      );

      navigate("/membership", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      alert(error.message);
    } finally {
      setLoading(false);
      setCheckingPurchase(false);
    }
  };

  // --------------------------------
  // FORGOT PASSWORD
  // --------------------------------

  const handleForgotPassword =
    async () => {
      if (!email) {
        alert(
          "Please enter your email first."
        );

        return;
      }

      try {
        setForgotLoading(true);

        await sendPasswordResetEmail(
          auth,
          email
        );

        alert(
          "✅ Password reset email sent.\n\n" +
            "Please check your inbox."
        );
      } catch (error) {
        console.error(
          "Password Reset Error:",
          error
        );

        alert(error.message);
      } finally {
        setForgotLoading(false);
      }
    };

  // --------------------------------
  // CLOSE POPUP
  // --------------------------------

  const closeDashboardChoice =
    () => {
      setShowDashboardChoice(false);
    };

  // --------------------------------
  // LOADING TEXT
  // --------------------------------

  const getLoginButtonText =
    () => {
      if (loading) {
        if (checkingPurchase) {
          return "Checking Your Access...";
        }

        return "Logging In...";
      }

      return "Login";
    };

  return (
    <>
      {/* =================================
          LOGIN PAGE
      ================================= */}

      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">

        <div className="bg-zinc-900 border border-yellow-400/40 p-8 md:p-10 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(250,204,21,0.08)]">

          {/* Logo / Heading */}

          <div className="text-center mb-8">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-black shadow-lg shadow-yellow-400/20">

              <LockKeyhole
                size={30}
              />

            </div>

            <h1 className="text-3xl font-black text-yellow-400">

              Welcome Back

            </h1>

            <p className="text-gray-400 mt-2">

              Login to your Stock Scorcher account

            </p>

          </div>

          {/* Email */}

          <div className="mb-4">

            <label className="block text-sm font-semibold text-gray-300 mb-2">

              Email Address

            </label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              className="w-full p-3.5 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-yellow-400 transition disabled:opacity-50"
            />

          </div>

          {/* Password */}

          <div className="mb-4">

            <label className="block text-sm font-semibold text-gray-300 mb-2">

              Password

            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleLogin();
                }
              }}
              className="w-full p-3.5 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-yellow-400 transition disabled:opacity-50"
            />

          </div>

          {/* Login Button */}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3.5 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getLoginButtonText()}
          </button>

          {/* Forgot Password */}

          <button
            onClick={
              handleForgotPassword
            }
            disabled={
              forgotLoading ||
              loading
            }
            className="w-full mt-4 text-yellow-400 hover:text-yellow-300 hover:underline transition disabled:opacity-50"
          >
            {forgotLoading
              ? "Sending Reset Email..."
              : "Forgot Password?"}
          </button>

          {/* Signup */}

          <p className="text-center text-gray-400 mt-6">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>


      {/* =================================
          DASHBOARD CHOICE MODAL
      ================================= */}

      {showDashboardChoice && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6">

          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-yellow-400/20 bg-zinc-950 shadow-[0_0_80px_rgba(250,204,21,0.15)]">

            {/* Close Button */}

            <button
              onClick={
                closeDashboardChoice
              }
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-400"
            >
              <X size={20} />
            </button>


            {/* Header */}

            <div className="border-b border-white/10 px-6 py-8 text-center md:px-10">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-black shadow-lg shadow-yellow-400/20">

                <Crown
                  size={32}
                />

              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white">

                Welcome Back! 👋

              </h2>

              <p className="mt-3 text-gray-400">

                You have access to both your
                Course and Premium Membership.

              </p>

              <p className="mt-1 text-sm text-gray-500">

                Choose which dashboard you want to open.

              </p>

            </div>


            {/* Dashboard Options */}

            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 md:p-8">

              {/* COURSE DASHBOARD */}

              <button
                onClick={() => {
                  setShowDashboardChoice(
                    false
                  );

                  navigate(
                    "/dashboard",
                    {
                      replace: true,
                    }
                  );
                }}
                className="group relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-orange-500/5 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(250,204,21,0.15)]"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-400 text-black">

                    <GraduationCap
                      size={28}
                    />

                  </div>

                  <ArrowRight
                    size={22}
                    className="text-yellow-400 transition-transform group-hover:translate-x-1"
                  />

                </div>

                <h3 className="mt-6 text-xl font-black text-white">

                  Course Dashboard

                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">

                  Access your purchased trading course,
                  lessons, recorded videos and learning resources.

                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-yellow-400">

                  Open Course

                  <ArrowRight
                    size={16}
                  />

                </div>

              </button>


              {/* MEMBER DASHBOARD */}

              <button
                onClick={() => {
                  setShowDashboardChoice(
                    false
                  );

                  navigate(
                    "/member-dashboard",
                    {
                      replace: true,
                    }
                  );
                }}
                className="group relative overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:shadow-[0_0_35px_rgba(34,197,94,0.15)]"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500 text-white">

                    <Crown
                      size={28}
                    />

                  </div>

                  <ArrowRight
                    size={22}
                    className="text-green-400 transition-transform group-hover:translate-x-1"
                  />

                </div>

                <h3 className="mt-6 text-xl font-black text-white">

                  Member Dashboard

                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">

                  Access AI stock analysis,
                  paper trading, portfolio,
                  watchlist and premium tools.

                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-400">

                  Open Member Area

                  <ArrowRight
                    size={16}
                  />

                </div>

              </button>

            </div>


            {/* Footer */}

            <div className="border-t border-white/10 px-6 py-4 text-center">

              <p className="text-xs text-gray-500">

                You can switch between your dashboards anytime from the website navigation.

              </p>

            </div>

          </div>

        </div>

      )}

    </>
  );
}