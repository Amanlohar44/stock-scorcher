import { useEffect, useState } from "react";
import {
  FaCrown,
  FaCalendarAlt,
  FaCreditCard,
  FaEnvelope,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";
import MemberStatCard from "../components/member/MemberStatCard";
import MemberFeatureCard from "../components/member/MemberFeatureCard";

export default function MemberDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);

  // =========================
  // AUTH + MEMBERSHIP
  // =========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setMembership(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const membershipRef = doc(
          db,
          "memberships",
          currentUser.uid
        );

        const membershipSnap = await getDoc(membershipRef);

        if (membershipSnap.exists()) {
          setMembership(membershipSnap.data());
        } else {
          setMembership(null);
        }

      } catch (error) {
        console.error(
          "Membership Fetch Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      // Firestore Timestamp
      if (date?.toDate) {
        return date.toDate().toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
      }

      // JS Date / String / Number
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch {
      return "N/A";
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-center">

          <div className="h-12 w-12 mx-auto rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin" />

          <p className="mt-5 text-gray-400">
            Loading your member dashboard...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden">

      {/* =========================
          SIDEBAR
      ========================= */}

      <MemberSidebar
        open={openSidebar}
        setOpen={setOpenSidebar}
      />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="flex-1 min-w-0 w-full">

        {/* TOPBAR */}

        <MemberTopbar
          toggleSidebar={() =>
            setOpenSidebar(true)
          }
        />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">

          {/* =========================
              TOP ACTIONS
          ========================= */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>
              <p className="text-yellow-400 font-semibold">
                Welcome Back 👋
              </p>

              <h1 className="text-2xl md:text-4xl font-black mt-2 break-words">
                {user?.displayName ||
                  user?.email?.split("@")[0] ||
                  "Pro Member"}{" "}
                👑
              </h1>

              <p className="text-gray-400 mt-2">
                Your AI-powered trading dashboard
              </p>
            </div>

            {/* Website Button */}

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
            >
              <FaGlobe />

              Back to Website
            </button>

          </div>


          {/* =========================
              MEMBERSHIP CARD
          ========================= */}

          {membership ? (

            <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-400/10 via-zinc-900 to-zinc-950 p-5 md:p-8">

              {/* Glow */}

              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-400/10 blur-3xl" />

              <div className="relative">

                {/* Membership Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black text-xl">
                      <FaCrown />
                    </div>

                    <div>

                      <p className="text-gray-400 text-sm">
                        Current Membership
                      </p>

                      <h2 className="text-2xl md:text-3xl font-black">
                        {membership.plan ||
                          "Premium"}{" "}
                        Plan
                      </h2>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

                    <span className="text-green-400 font-bold uppercase">
                      {membership.status ||
                        "Active"}
                    </span>

                  </div>

                </div>


                {/* Membership Details */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

                  {/* Email */}

                  <div className="rounded-2xl bg-black/30 border border-white/5 p-5">

                    <div className="flex items-center gap-3 text-gray-400">

                      <FaEnvelope className="text-yellow-400" />

                      <span className="text-sm">
                        Email
                      </span>

                    </div>

                    <p className="mt-3 font-semibold truncate">
                      {membership.email ||
                        user?.email ||
                        "N/A"}
                    </p>

                  </div>


                  {/* Amount */}

                  <div className="rounded-2xl bg-black/30 border border-white/5 p-5">

                    <div className="flex items-center gap-3 text-gray-400">

                      <FaCreditCard className="text-yellow-400" />

                      <span className="text-sm">
                        Amount
                      </span>

                    </div>

                    <p className="mt-3 font-semibold">
                      ₹
                      {Number(
                        membership.amount || 0
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>


                  {/* Purchased */}

                  <div className="rounded-2xl bg-black/30 border border-white/5 p-5">

                    <div className="flex items-center gap-3 text-gray-400">

                      <FaCalendarAlt className="text-yellow-400" />

                      <span className="text-sm">
                        Purchased
                      </span>

                    </div>

                    <p className="mt-3 font-semibold">
                      {formatDate(
                        membership.purchasedAt
                      )}
                    </p>

                  </div>


                  {/* Expiry */}

                  <div className="rounded-2xl bg-black/30 border border-white/5 p-5">

                    <div className="flex items-center gap-3 text-gray-400">

                      <FaCalendarAlt className="text-yellow-400" />

                      <span className="text-sm">
                        Expiry
                      </span>

                    </div>

                    <p className="mt-3 font-semibold text-yellow-400">
                      {formatDate(
                        membership.expiryDate
                      )}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          ) : (

            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 md:p-8">

              <h2 className="text-2xl font-bold text-red-400">
                Membership Not Found
              </h2>

              <p className="text-gray-400 mt-2">
                We couldn't find an active
                membership for your account.
              </p>

              <button
                onClick={() =>
                  navigate("/membership")
                }
                className="mt-5 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
              >
                View Membership
              </button>

            </div>

          )}


          {/* =========================
              STATS
          ========================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10">

            <MemberStatCard
              title="Portfolio"
              value="₹0"
              color="text-green-400"
            />

            <MemberStatCard
              title="Profit"
              value="+0%"
              color="text-green-400"
            />

            <MemberStatCard
              title="Watchlist"
              value="0"
              color="text-yellow-400"
            />

            <MemberStatCard
              title="AI Signals"
              value="BUY"
              color="text-green-400"
            />

          </div>


          {/* =========================
              PREMIUM TOOLS
          ========================= */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold">
              Premium Trading Tools
            </h2>

            <p className="text-gray-400 mt-2">
              Explore your exclusive member features.
            </p>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            <MemberFeatureCard
              title="📈 Live Market"
              desc="Track live stock prices and real-time market charts."
              path="/stock-analysis"
            />

            <MemberFeatureCard
              title="🤖 AI Analysis"
              desc="Get AI-powered stock analysis and Buy/Sell insights."
              path="/stock-analysis"
            />

            <MemberFeatureCard
              title="📄 Paper Trading"
              desc="Practice your trading strategies without risking real money."
              path="/paper-trading"
            />

            <MemberFeatureCard
              title="⭐ Watchlist"
              desc="Save and monitor your favorite stocks in one place."
              path="/watchlist"
            />

          </div>


          {/* =========================
              PAYMENT ID
          ========================= */}

          {membership?.paymentId && (

            <div className="mt-10 rounded-2xl border border-white/10 bg-zinc-900 p-5 md:p-6">

              <p className="text-gray-400 text-sm">
                Payment ID
              </p>

              <p className="text-xs md:text-base text-yellow-400 mt-2 break-all">
                {membership.paymentId}
              </p>

            </div>

          )}


          {/* =========================
              ACCOUNT ACTIONS
          ========================= */}

          <div className="mt-10 flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:border-yellow-400/40"
            >
              <FaGlobe />

              Visit Stock Scorcher
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              <FaSignOutAlt />

              Logout
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}