import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaCheckCircle, 
  FaStar, 
  FaBolt,
  FaCrown,
  FaTag
} from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";



const customEase = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const plansList = [
  {
    id: "basic",
    name: "Trading PDF & Cheat Sheets",
    price: 999,
    priceText: "₹999",
    badge: "Digital Asset",
    description: "Get instant digital access to professional price action cheat sheets, chart patterns, and trading strategy guides.",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
    theme: "text-white border-white/20 bg-[#050505] shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:border-white/40",
    buttonClass: "bg-white text-black hover:bg-neutral-200",
    features: [
      "Instant PDF Download Access",
      "High-Probability Setup Guides",
      "Risk Management Templates",
      "Lifetime Updates Included"
    ],
    isAvailable: true // ✅ Ab yeh active ho gaya hai PDF sell karne ke liye
  },
  {
    id: "premium",
    name: "Stock Scorcher Masterclass",
    price: 6999,
    priceText: "₹6999",
    badge: "Most Popular",
    description: "Complete institutional curriculum. Master naked charts, swing setups, and high-probability momentum execution.",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600",
    theme: "text-white border-[#EAB308]/40 bg-[#050505] shadow-[0_0_50px_rgba(234,179,8,0.12)] hover:border-[#EAB308]/70",
    buttonClass: "bg-[#EAB308] text-black hover:bg-white",
    features: [
      "Complete Recorded Masterclass",
      "Proprietary PDF Study Notes",
      "Lifetime Terminal Access",
      "Free Future Module Updates"
    ],
    isAvailable: true
  },
  {
    id: "pro-mentorship",
    name: "Pro Mentorship & Execution",
    price: 9999,
    priceText: "₹9999",
    badge: "Elite Access",
    description: "Direct strategic mentorship, live session insights, and professional portfolio audits with Aman Lohar.",
    thumbnail: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=600",
    theme: "text-white border-green-500/40 bg-[#050505] shadow-[0_0_50px_rgba(34,197,94,0.12)] hover:border-green-500/70",
    buttonClass: "bg-green-500 text-black hover:bg-white",
    features: [
      "Everything Included in Premium",
      "Live Mentorship & Q&A Calls",
      "Personalized Portfolio Review",
      "Priority VIP Support Channel"
    ],
    isAvailable: true
  }
];

export default function Courses() {
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const [couponInputs, setCouponInputs] = useState({});
  const [appliedCoupons, setAppliedCoupons] = useState({});
  const [couponMessages, setCouponMessages] = useState({});

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async (plan) => {
    const code = (couponInputs[plan.id] || "").trim().toUpperCase();
    if (!code) {
      setCouponMessages({ ...couponMessages, [plan.id]: { text: "Please enter a coupon code", type: "error" } });
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
        setCouponMessages({ ...couponMessages, [plan.id]: { text: "Invalid coupon code", type: "error" } });
        return;
      }

      const discountPercent = couponData.discountPercent || couponData.discount || couponData.percentage || 0; 
      const discountAmount = couponData.discountAmount || couponData.amount || 0;

      setAppliedCoupons({ ...appliedCoupons, [plan.id]: { code, discountPercent, discountAmount } });
      setCouponMessages({ ...couponMessages, [plan.id]: { text: `Coupon applied successfully!`, type: "success" } });
    } catch (err) {
      console.error("Error applying coupon:", err);
      setCouponMessages({ ...couponMessages, [plan.id]: { text: "Error verifying coupon", type: "error" } });
    }
  };

  const getFinalPrice = (plan) => {
    let price = plan.price;
    const applied = appliedCoupons[plan.id];
    if (applied) {
      if (applied.discountPercent) {
        price = price - (price * applied.discountPercent) / 100;
      } else if (applied.discountAmount) {
        price = price - applied.discountAmount;
      }
    }
    return Math.max(0, Math.round(price));
  };

  const handleBuyNow = async (plan) => {
    if (!plan.isAvailable) {
      alert("This plan is coming soon!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Please login first to purchase.");
      navigate("/login");
      return;
    }

    setLoadingPlanId(plan.id);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      setLoadingPlanId(null);
      return;
    }

    const finalAmount = getFinalPrice(plan);

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: finalAmount * 100,
      currency: "INR",
      name: "Stock Scorcher",
      description: `${plan.name} ${appliedCoupons[plan.id] ? `(Coupon: ${appliedCoupons[plan.id].code})` : ""}`,
      image: "/founder.png",
      handler: async function (response) {
        try {
          const purchaseRef = doc(db, "purchases", user.uid);
          await setDoc(purchaseRef, {
            planId: plan.id,
            planName: plan.name,
            originalPrice: plan.price,
            finalPaidPrice: finalAmount,
            appliedCoupon: appliedCoupons[plan.id]?.code || null,
            paymentId: response.razorpay_payment_id,
            purchasedAt: new Date().toISOString(),
            status: "active"
          });

          alert("Payment Successful! Access granted.");
          navigate("/dashboard");
        } catch (err) {
          console.error("Error saving purchase:", err);
          alert("Payment received, but error saving database record.");
        }
      },
      prefill: {
        name: user.displayName || "Trader",
        email: user.email || "",
      },
      theme: {
        color: plan.id === "premium" ? "#EAB308" : plan.id === "pro-mentorship" ? "#22c55e" : "#ffffff",
      },
    };

    const paymentModal = new window.Razorpay(options);
    paymentModal.open();
    setLoadingPlanId(null);
  };

  return (
    <>
      <Helmet>
        <title>Institutional Masterclasses & PDFs | Stock Scorcher</title>
        <meta name="description" content="Unlock elite trading PDFs, masterclasses, and pro mentorship curated by Aman Lohar." />
      </Helmet>

      <div className="min-h-screen bg-black text-[#ededed] font-sans selection:bg-[#EAB308] selection:text-black flex flex-col antialiased">
        

        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, #ffffff 1px, transparent 1px)`,
            backgroundSize: "28px 28px"
          }}
        />

        <main className="flex-grow relative z-10 pt-36 pb-28 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          <section className="text-center pb-20 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.12),transparent_70%)] pointer-events-none blur-2xl" />
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div variants={fadeUp} className="mb-6 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl shadow-lg">
                <FaStar className="text-[#EAB308] w-3.5 h-3.5 animate-pulse" />
                <span className="text-xs font-bold tracking-[0.25em] text-neutral-300 uppercase">
                  Stock Scorcher Academy
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-none">
                Master the Markets with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] to-amber-600">Precision.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base sm:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light">
                Choose your structured learning path, unlock professional PDF bundles, and gain institutional frameworks.
              </motion.p>
            </motion.div>
          </section>

          <section className="pb-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
            >
              {plansList.map((plan) => {
                const finalPrice = getFinalPrice(plan);
                const applied = appliedCoupons[plan.id];
                const msg = couponMessages[plan.id];

                return (
                  <motion.div 
                    key={plan.id} 
                    variants={fadeUp} 
                    className={`relative flex flex-col rounded-[2.5rem] overflow-hidden border ${plan.theme} transition-all duration-500 justify-between group`}
                  >
                    <div className="relative h-52 w-full overflow-hidden border-b border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-transparent z-10" />
                      <img 
                        src={plan.thumbnail} 
                        alt={plan.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      />
                      <div className="absolute top-4 right-4 z-20">
                        <span className={`text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border backdrop-blur-md ${
                          plan.id === "premium" 
                            ? 'bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/40 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                            : plan.id === "pro-mentorship" 
                            ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                            : 'bg-white/20 text-white border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        }`}>
                          {plan.badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 sm:p-10 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-lg">
                            <FaCrown className={
                              plan.id === "premium" ? "text-[#EAB308]" : 
                              plan.id === "pro-mentorship" ? "text-green-500" : "text-white"
                            } />
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            {plan.name}
                          </h3>
                        </div>

                        <p className="text-sm text-neutral-400 mb-8 font-light leading-relaxed min-h-[48px]">
                          {plan.description}
                        </p>

                        <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-white/10">
                          {applied ? (
                            <div className="flex items-baseline gap-3">
                              <span className={`text-4xl sm:text-5xl font-black tracking-tight ${plan.id === "premium" ? "text-[#EAB308]" : plan.id === "pro-mentorship" ? "text-green-500" : "text-white"}`}>
                                ₹{finalPrice.toLocaleString()}
                              </span>
                              <span className="text-base text-neutral-500 line-through">₹{plan.price.toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${
                              plan.id === "premium" ? "text-[#EAB308]" : 
                              plan.id === "pro-mentorship" ? "text-green-500" : "text-white"
                            }`}>
                              {plan.priceText}
                            </span>
                          )}
                          <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">One-Time</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3.5 text-sm text-neutral-300">
                              <FaCheckCircle className={`mt-0.5 shrink-0 ${
                                plan.id === "premium" ? "text-[#EAB308]" : 
                                plan.id === "pro-mentorship" ? "text-green-500" : "text-white"
                              }`} />
                              <span className="leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <div className="mb-6">
                          <div className="flex gap-2">
                            <div className="relative flex-grow">
                              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500 text-xs pointer-events-none">
                                <FaTag />
                              </span>
                              <input 
                                type="text"
                                placeholder="Enter Coupon Code"
                                disabled={applied}
                                value={couponInputs[plan.id] || ""}
                                onChange={(e) => setCouponInputs({ ...couponInputs, [plan.id]: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3.5 py-3 text-xs text-white uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal outline-none focus:border-[#EAB308] transition-colors"
                              />
                            </div>
                            {applied ? (
                              <button 
                                onClick={() => {
                                  setAppliedCoupons({ ...appliedCoupons, [plan.id]: null });
                                  setCouponMessages({ ...couponMessages, [plan.id]: null });
                                  setCouponInputs({ ...couponInputs, [plan.id]: "" });
                                }}
                                className="px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors"
                              >
                                Remove
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleApplyCoupon(plan)}
                                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                          {msg && (
                            <p className={`text-[11px] mt-2 font-semibold ${msg.type === "error" ? "text-red-400" : "text-green-400"}`}>
                              {msg.text}
                            </p>
                          )}
                        </div>

                        <button 
                          onClick={() => handleBuyNow(plan)}
                          disabled={loadingPlanId === plan.id}
                          className={`w-full py-4 rounded-xl font-extrabold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2.5 ${plan.buttonClass} disabled:opacity-50 cursor-pointer shadow-lg`}
                        >
                          <FaBolt /> 
                          {loadingPlanId === plan.id ? "Processing Securely..." : `Pay ₹${finalPrice.toLocaleString()}`}
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          </section>

        </main>

        
      </div>
    </>
  );
}