import { useEffect, useState } from "react";
import { FaCrown, FaCalendarAlt, FaCreditCard, FaEnvelope } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";
import MemberStatCard from "../components/member/MemberStatCard";
import MemberFeatureCard from "../components/member/MemberFeatureCard";

export default function MemberDashboard() {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const membershipRef = doc(
          db,
          "memberships",
          user.uid
        );

        const membershipSnap = await getDoc(membershipRef);

        if (membershipSnap.exists()) {
          setMembership(membershipSnap.data());
        }

      } catch (error) {
        console.error("Membership Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, []);

  const user = auth.currentUser;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden">

      {/* Sidebar */}

     <MemberSidebar
  open={openSidebar}
  setOpen={setOpenSidebar}
/>

      {/* Main Content */}

      <div className="flex-1 min-w-0 w-full">

        <MemberTopbar
  toggleSidebar={() => setOpenSidebar(true)}
/>

        <main className="p-4 md:p-8">

          {/* Welcome */}

          <div className="mb-10">

            <p className="text-yellow-400 font-semibold">
              Welcome Back 👋
            </p>

            <h1 className="text-2xl md:text-4xl font-black mt-2 break-words">
              {user?.displayName || "Pro Member"} 👑
            </h1>

            <p className="text-gray-400 mt-2">
              Your AI-powered trading dashboard
            </p>

          </div>


          {/* Membership Card */}

          {loading ? (

            <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8 animate-pulse">
              <div className="h-6 bg-zinc-800 rounded w-48"></div>
              <div className="h-4 bg-zinc-800 rounded w-72 mt-4"></div>
            </div>

          ) : membership ? (

            <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-400/10 via-zinc-900 to-zinc-950 p-5 md:p-8">

              {/* Glow */}

              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-400/10 blur-3xl" />

              <div className="relative">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-black">

                        <FaCrown />

                      </div>

                      <div>

                        <p className="text-gray-400 text-sm">
                          Current Membership
                        </p>

                        <h2 className="text-2xl font-black text-white">
                          {membership.plan} Plan
                        </h2>

                      </div>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

                    <span className="text-green-400 font-bold uppercase">
                      {membership.status || "Active"}
                    </span>

                  </div>

                </div>


                {/* Membership Details */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

                  <div className="rounded-2xl bg-black/30 border border-white/5 p-5">

                    <div className="flex items-center gap-3 text-gray-400">

                      <FaEnvelope className="text-yellow-400" />

                      <span className="text-sm">
                        Email
                      </span>

                    </div>

                    <p className="mt-3 font-semibold truncate">
                      {membership.email || user?.email || "N/A"}
                    </p>

                  </div>


                  <div className="rounded-2xl bg-black/30 border border-white/5 p-5">

                    <div className="flex items-center gap-3 text-gray-400">

                      <FaCreditCard className="text-yellow-400" />

                      <span className="text-sm">
                        Amount
                      </span>

                    </div>

                    <p className="mt-3 font-semibold">
                      ₹{membership.amount || 0}
                    </p>

                  </div>


                  <div className="rounded-2xl bg-black/30 border border-white/5 p-5">

                    <div className="flex items-center gap-3 text-gray-400">

                      <FaCalendarAlt className="text-yellow-400" />

                      <span className="text-sm">
                        Purchased
                      </span>

                    </div>

                    <p className="mt-3 font-semibold">
                      {formatDate(membership.purchasedAt)}
                    </p>

                  </div>


                  <div className="rounded-2xl bg-black/30 border border-white/5 p-5">

                    <div className="flex items-center gap-3 text-gray-400">

                      <FaCalendarAlt className="text-yellow-400" />

                      <span className="text-sm">
                        Expiry
                      </span>

                    </div>

                    <p className="mt-3 font-semibold text-yellow-400">
                      {formatDate(membership.expiryDate)}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          ) : (

            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

              <h2 className="text-2xl font-bold text-red-400">
                Membership Not Found
              </h2>

              <p className="text-gray-400 mt-2">
                We couldn't find an active membership for your account.
              </p>

            </div>

          )}


          {/* Stats */}

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


          {/* Features */}

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
            />

            <MemberFeatureCard
              title="🤖 AI Analysis"
              desc="Get AI-powered stock analysis and Buy/Sell insights."
            />

            <MemberFeatureCard
              title="📄 Paper Trading"
              desc="Practice your trading strategies without risking real money."
            />

            <MemberFeatureCard
              title="⭐ Watchlist"
              desc="Save and monitor your favorite stocks in one place."
            />

          </div>


          {/* Payment ID */}

          {membership?.paymentId && (

            <div className="mt-10 rounded-2xl border border-white/10 bg-zinc-900 p-6">

              <p className="text-gray-400 text-sm">
                Payment ID
              </p>

              <p className="text-xs md:text-base text-yellow-400 mt-2 break-all">
                {membership.paymentId}
              </p>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}