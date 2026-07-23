import axios from "axios";
import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Check,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";

export default function Pricing() {
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "AL35") {
      setDiscount(35);
      alert("🎉 Coupon Applied Successfully");
    } else {
      setDiscount(0);
      alert("❌ Invalid Coupon");
    }
  };

  const getFinalPrice = (price) => {
    return Math.round(price - (price * discount) / 100);
  };

  const handlePayment = async (amount) => {
    try {
      const finalAmount = getFinalPrice(amount);

      const { data } = await axios.post(
        "https://stock-scorcher-backend.onrender.com/create-order",
        {
          amount: finalAmount,
          coupon,
        }
      );

      const options = {
        key: "rzp_live_TB6ROKtV9GwMGv",

        amount: data.amount,

        currency: data.currency,

        name: "Stock Scorcher",

        description: "Course Purchase",

        order_id: data.id,

        modal: {
          ondismiss: function () {
            document
              .querySelectorAll(".razorpay-container")
              .forEach((e) => e.remove());
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

    coupon,

    originalPrice: amount,

    discount,
  }
);

            if (verify.data.success) {
              const user = auth.currentUser;

              if (user) {
                await setDoc(
  doc(db, "purchases", user.uid),
  {
    uid: user.uid,
    email: user.email,

    originalPrice: amount,
    paidAmount: finalAmount,

    coupon,
    discount,

    purchased: true,
    paymentStatus: "paid",

    paymentId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,

    purchasedAt: new Date().toISOString(),
  },
  { merge: true }
);
              }

              alert("🎉 Payment Successful");

              navigate("/payment-success");
            } else {
              alert("Verification Failed");
            }
          } catch (err) {
            console.log(err);
          }
        },

        prefill: {
          name:
            auth.currentUser?.displayName ||
            "Student",

          email:
            auth.currentUser?.email || "",
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
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#030303] py-28"
    >
      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-[#030303]" />

        <div className="absolute -top-44 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[180px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[180px]" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400">

            <Sparkles size={16} />

            Course Plans

          </div>

          <h2 className="mt-8 text-5xl md:text-6xl font-black text-white">

            Choose Your

            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">

              Learning Plan

            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">

            Learn Stock Market from beginner to professional with recorded
            courses, mentorship and lifetime support.

          </p>

          <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-center">

            <input
              type="text"
              value={coupon}
              onChange={(e) =>
                setCoupon(e.target.value)
              }
              placeholder="Enter Coupon Code"
              className="w-72 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-white outline-none focus:border-yellow-400"
            />

            <button
              onClick={applyCoupon}
              className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300"
            >
              Apply Coupon
            </button>

          </div>

          {discount > 0 && (
            <p className="mt-4 text-green-400 font-bold text-lg">

              🎉 Coupon Applied ({discount}% OFF)

            </p>
          )}

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
                    {/* ========================= */}
          {/* Basic Plan */}
          {/* ========================= */}

          <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-zinc-500 hover:shadow-[0_0_45px_rgba(255,255,255,.08)]">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-white">
              <Star size={30} />
            </div>

            <h3 className="mt-8 text-3xl font-black text-white">
              Basic
            </h3>

            <div className="mt-6 flex items-end gap-2">

              <span className="text-5xl font-black text-white">
                ₹999
              </span>

              <span className="pb-2 text-zinc-400">
                One Time
              </span>

            </div>

            <div className="my-8 h-px bg-white/10" />

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Beginner Friendly
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Basic Learning
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Coming Soon
                </span>
              </div>

            </div>

            <button
              disabled
              className="mt-10 w-full rounded-2xl bg-zinc-700 py-4 text-lg font-bold text-white cursor-not-allowed"
            >
              Coming Soon
            </button>

          </div>

          {/* ========================= */}
          {/* Premium Plan */}
          {/* ========================= */}

          <div className="group relative overflow-hidden rounded-[32px] border border-yellow-400 bg-gradient-to-b from-yellow-400/15 to-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_0_70px_rgba(250,204,21,.35)]">

            <div className="absolute right-6 top-6 rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
              🔥 MOST POPULAR
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-black">
              <Crown size={30} />
            </div>

            <h3 className="mt-8 text-3xl font-black text-white">
              Premium
            </h3>

            <div className="mt-6">

              {discount > 0 && (
                <div className="text-zinc-500 line-through text-2xl">
                  ₹6999
                </div>
              )}

              <div className="flex items-end gap-2">

                <span className="text-5xl font-black text-yellow-400">
                  ₹{getFinalPrice(6999)}
                </span>

                <span className="pb-2 text-zinc-400">
                  One Time
                </span>

              </div>

              {discount > 0 && (
                <div className="mt-2 text-green-400 font-bold">
                  🎉 You Save ₹{6999 - getFinalPrice(6999)}
                </div>
              )}

            </div>

            <div className="my-8 h-px bg-white/10" />

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Complete Recorded Course
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  PDF Notes
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Lifetime Access
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Free Future Updates
                </span>
              </div>

            </div>

            <button
              onClick={() => handlePayment(6999)}
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-4 text-lg font-bold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-yellow-300"
            >
              Buy Now
              <ArrowRight size={20} />
            </button>

          </div>
                    {/* ========================= */}
          {/* Pro Plan */}
          {/* ========================= */}

          <div className="group relative overflow-hidden rounded-[32px] border border-green-500/40 bg-gradient-to-b from-green-500/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_60px_rgba(34,197,94,.20)]">

            <div className="absolute right-6 top-6 rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white">
              BEST VALUE
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-white">
              <Crown size={30} />
            </div>

            <h3 className="mt-8 text-3xl font-black text-white">
              Pro Mentorship
            </h3>

            <div className="mt-6">

              {discount > 0 && (
                <div className="text-zinc-500 line-through text-2xl">
                  ₹9999
                </div>
              )}

              <div className="flex items-end gap-2">

                <span className="text-5xl font-black text-green-400">
                  ₹{getFinalPrice(9999)}
                </span>

                <span className="pb-2 text-zinc-400">
                  One Time
                </span>

              </div>

              {discount > 0 && (
                <div className="mt-2 text-green-400 font-bold">
                  🎉 You Save ₹{9999 - getFinalPrice(9999)}
                </div>
              )}

            </div>

            <div className="my-8 h-px bg-white/10" />

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Everything in Premium
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Live Mentorship
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Portfolio Review
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Check size={18} className="text-green-400" />
                <span className="text-zinc-300">
                  Priority Support
                </span>
              </div>

            </div>

            <button
              onClick={() => handlePayment(9999)}
              className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-green-400"
            >
              Buy Now
              <ArrowRight size={20} />
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}