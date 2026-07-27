import React, { useState } from "react";
import { Crown, Check, ArrowRight, Tag, ShieldCheck, Zap } from "lucide-react";
import axios from "axios";
import { auth, db } from "../../firebase";
import { doc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Monthly",
    price: 999,
    duration: "/month",
    badge: "Most Popular",
    color: "yellow",
    description: "Ideal for active traders looking for short-term algorithmic precision and live terminal access.",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Yearly",
    price: 9999,
    duration: "/year",
    badge: "Save 17%",
    color: "green",
    description: "Maximum value for serious institutional and full-time professional traders seeking long-term edges.",
    thumbnail: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=600",
  },
];

const features = [
  "AI Buy / Sell Signals",
  "Real-time Paper Trading Terminal",
  "Advanced Portfolio Tracker",
  "Unlimited Custom Watchlists",
  "Private VIP Discord Community",
  "Priority 24/7 Technical Support",
  "Free Automated Platform Updates",
  "Instant Market Alert Notifications",
];

export default function PricingCards() {
  const navigate = useNavigate();

  const [couponInputs, setCouponInputs] = useState({});
  const [appliedCoupons, setAppliedCoupons] = useState({});
  const [couponMessages, setCouponMessages] = useState({});
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleApplyCoupon = async (planTitle) => {
    const code = (couponInputs[planTitle] || "").trim().toUpperCase();
    if (!code) {
      setCouponMessages({
        ...couponMessages,
        [planTitle]: { text: "Please enter a valid coupon code.", type: "error" },
      });
      return;
    }

    try {
      const couponsRef = collection(db, "coupons");
      const q = query(couponsRef, where("code", "==", code));
      const querySnapshot = await getDocs(q);

      let couponData = null;

      if (!querySnapshot.empty) {
        couponData = querySnapshot.docs[0].data();
      } else {
        const docRef = doc(db, "coupons", code);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          couponData = docSnap.data();
        }
      }

      if (!couponData) {
        setCouponMessages({
          ...couponMessages,
          [planTitle]: { text: "Invalid or expired coupon code.", type: "error" },
        });
        return;
      }

      const discountPercent = couponData.discountPercent || couponData.discount || couponData.percentage || 0; 
      const discountAmount = couponData.discountAmount || couponData.amount || 0;

      setAppliedCoupons({
        ...appliedCoupons,
        [planTitle]: { code, discountPercent, discountAmount },
      });
      setCouponMessages({
        ...couponMessages,
        [planTitle]: { text: "Coupon applied successfully!", type: "success" },
      });
    } catch (err) {
      console.error("Error applying coupon:", err);
      setCouponMessages({
        ...couponMessages,
        [planTitle]: { text: "Error verifying coupon. Try again.", type: "error" },
      });
    }
  };

  const getFinalPrice = (plan) => {
    let price = plan.price;
    const applied = appliedCoupons[plan.title];
    if (applied) {
      if (applied.discountPercent) {
        price = price - (price * applied.discountPercent) / 100;
      } else if (applied.discountAmount) {
        price = price - applied.discountAmount;
      }
    }
    return Math.max(0, Math.round(price));
  };

  const handleMembershipPayment = async (planTitle, originalPrice) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first to purchase a membership plan.");
      navigate("/login");
      return;
    }

    try {
      const finalAmount = getFinalPrice({ title: planTitle, price: originalPrice });
      setLoadingPlan(planTitle);

      const { data } = await axios.post(
        "https://stock-scorcher-backend.onrender.com/create-order",
        {
          amount: finalAmount,
        }
      );

      const options = {
        key: "rzp_live_TB6ROKtV9GwMGv",
        amount: data.amount,
        currency: data.currency,
        name: "Stock Scorcher",
        description: `${planTitle} Membership ${appliedCoupons[planTitle] ? `(Coupon: ${appliedCoupons[planTitle].code})` : ""}`,
        order_id: data.id,
        modal: {
          ondismiss: function () {
            document
              .querySelectorAll(".razorpay-container")
              .forEach((e) => e.remove());
            setLoadingPlan(null);
          },
        },
        handler: async function (response) {
          try {
            document
              .querySelectorAll(".razorpay-container")
              .forEach((e) => e.remove());

            const verify = await axios.post(
              "https://stock-scorcher-backend.onrender.com/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: auth.currentUser?.email,
                amount: finalAmount,
                originalPrice: originalPrice,
              }
            );

            if (verify.data.success) {
              const currentUser = auth.currentUser;

              if (currentUser) {
                const expiry = new Date();

                if (planTitle === "Monthly") {
                  expiry.setMonth(expiry.getMonth() + 1);
                } else {
                  expiry.setFullYear(expiry.getFullYear() + 1);
                }

                await setDoc(
                  doc(db, "memberships", currentUser.uid),
                  {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    plan: planTitle,
                    originalPrice: originalPrice,
                    paidAmount: finalAmount,
                    appliedCoupon: appliedCoupons[planTitle]?.code || null,
                    status: "active",
                    purchasedAt: new Date().toISOString(),
                    expiryDate: expiry.toISOString(),
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                  },
                  { merge: true }
                );

                await setDoc(
                  doc(db, "users", currentUser.uid),
                  {
                    premium: true,
                    membershipStatus: "active",
                    membershipPlan: planTitle,
                    membershipExpiry: expiry.toISOString(),
                  },
                  { merge: true }
                );
              }

              alert("🎉 Membership Activated Successfully!");
              navigate("/member-dashboard");
            } else {
              alert("Payment Verification Failed.");
            }
          } catch (err) {
            console.error(err);
            alert("Verification Error occurred.");
          } finally {
            setLoadingPlan(null);
          }
        },
        prefill: {
          name: auth.currentUser?.displayName || "Trader",
          email: auth.currentUser?.email || "",
        },
        theme: {
          color: "#facc15",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

      razor.on("payment.failed", function () {
        document
          .querySelectorAll(".razorpay-container")
          .forEach((e) => e.remove());
        setLoadingPlan(null);
      });

    } catch (err) {
      console.error(err);
      alert("Payment Initialization Failed.");
      setLoadingPlan(null);
    }
  };

  return (
    <section
      id="membership-pricing"
      className="relative overflow-hidden bg-[#030303] py-28 selection:bg-yellow-400 selection:text-black"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Crown size={15} />
            Institutional Access
          </div>

          <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            Secure Your Market Edge with <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Elite Membership
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            Unlock real-time algorithmic insights, advanced paper trading tools, and institutional-grade portfolio analytics.
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-2 items-stretch">
          {plans.map((plan) => {
            const finalPrice = getFinalPrice(plan);
            const applied = appliedCoupons[plan.title];
            const msg = couponMessages[plan.title];

            return (
              <div
                key={plan.title}
                className={`group relative overflow-hidden rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between ${
                  plan.color === "yellow"
                    ? "border-yellow-400/50 bg-gradient-to-b from-yellow-400/[0.08] to-black/40 shadow-[0_0_50px_rgba(250,204,21,0.12)] hover:border-yellow-400"
                    : "border-green-500/50 bg-gradient-to-b from-green-500/[0.08] to-black/40 shadow-[0_0_50px_rgba(34,197,94,0.12)] hover:border-green-500"
                }`}
              >
                {/* Thumbnail / Header Banner */}
                <div className="relative h-52 w-full overflow-hidden border-b border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-transparent z-10" />
                  <img 
                    src={plan.thumbnail} 
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider backdrop-blur-md border ${
                        plan.color === "yellow"
                          ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/40 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                          : "bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                </div>

                <div className="p-8 sm:p-10 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                          plan.color === "yellow"
                            ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                            : "bg-green-500 text-white shadow-lg shadow-green-500/20"
                        }`}
                      >
                        <Crown size={20} />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {plan.title} Plan
                      </h3>
                    </div>

                    <p className="text-sm text-zinc-400 mb-8 font-light leading-relaxed min-h-[44px]">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-white/10">
                      {applied ? (
                        <div className="flex items-baseline gap-3">
                          <span
                            className={`text-4xl sm:text-5xl font-black tracking-tight ${
                              plan.color === "yellow"
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}
                          >
                            ₹{finalPrice.toLocaleString()}
                          </span>
                          <span className="text-base text-zinc-500 line-through">
                            ₹{plan.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`text-4xl sm:text-5xl font-black tracking-tight ${
                            plan.color === "yellow"
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          ₹{plan.price.toLocaleString()}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-zinc-400">{plan.duration}</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      {features.map((item) => (
                        <div key={item} className="flex items-center gap-3.5">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
                            <Check size={13} className="text-green-400" />
                          </div>
                          <span className="text-sm text-zinc-300 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex flex-col gap-5">
                    <div>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
                            <Tag size={14} />
                          </span>
                          <input
                            type="text"
                            placeholder="Have a coupon code?"
                            disabled={applied}
                            value={couponInputs[plan.title] || ""}
                            onChange={(e) =>
                              setCouponInputs({
                                ...couponInputs,
                                [plan.title]: e.target.value,
                              })
                            }
                            className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3.5 py-3 text-xs text-white uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal outline-none focus:border-yellow-400 transition-colors"
                          />
                        </div>
                        {applied ? (
                          <button
                            onClick={() => {
                              setAppliedCoupons({
                                ...appliedCoupons,
                                [plan.title]: null,
                              });
                              setCouponMessages({
                                ...couponMessages,
                                [plan.title]: null,
                              });
                              setCouponInputs({
                                ...couponInputs,
                                [plan.title]: "",
                              });
                            }}
                            className="px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApplyCoupon(plan.title)}
                            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                      {msg && (
                        <p
                          className={`text-[11px] mt-2 font-semibold ${
                            msg.type === "error" ? "text-red-400" : "text-green-400"
                          }`}
                        >
                          {msg.text}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handleMembershipPayment(plan.title, plan.price)
                      }
                      disabled={loadingPlan === plan.title}
                      className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-base font-extrabold transition-all duration-300 shadow-xl cursor-pointer ${
                        plan.color === "yellow"
                          ? "bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-yellow-400/20"
                          : "bg-green-500 text-white hover:bg-green-400 hover:shadow-green-500/20"
                      } disabled:opacity-50`}
                    >
                      <Zap size={18} />
                      {loadingPlan === plan.title ? "Initiating Gateway..." : `Pay ₹${finalPrice.toLocaleString()}`}
                      <ArrowRight size={18} />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-medium">
                      <ShieldCheck size={14} className="text-zinc-400" />
                      Secure 256-Bit Encrypted Razorpay Checkout
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute bottom-0 left-0 h-1.5 w-full ${
                    plan.color === "yellow"
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}