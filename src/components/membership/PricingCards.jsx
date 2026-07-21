import { Crown, Check, ArrowRight } from "lucide-react";
import axios from "axios";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Monthly",
    price: "₹999",
    duration: "/month",
    badge: "Most Popular",
    color: "yellow",
  },
  {
    title: "Yearly",
    price: "₹9999",
    duration: "/year",
    badge: "Save 17%",
    color: "green",
  },
];

const features = [
  "AI Buy / Sell Signals",
  "Paper Trading",
  "Portfolio Tracker",
  "Unlimited Watchlist",
  "Premium Community",
  "Priority Support",
  "Future Updates",
  "Lifetime Learning Resources",
];

export default function PricingCards() {
  const navigate = useNavigate();

  const handleMembershipPayment = async (plan, amount) => {
    try {
      const { data } = await axios.post(
        "https://stock-scorcher-backend.onrender.com/create-order",
        { amount }
      );

      const options = {
        key: "rzp_live_TB6ROKtV9GwMGv",

        amount: data.amount,
        currency: data.currency,
        name: "Stock Scorcher",
        description: `${plan} Membership`,
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
            const verify = await axios.post(
              "https://stock-scorcher-backend.onrender.com/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                email: auth.currentUser?.email,
                amount,
              }
            );

            if (verify.data.success) {
              const user = auth.currentUser;

              if (user) {
                const expiry = new Date();

                if (plan === "Monthly") {
                  expiry.setMonth(expiry.getMonth() + 1);
                } else {
                  expiry.setFullYear(expiry.getFullYear() + 1);
                }

                await setDoc(
                  doc(db, "memberships", user.uid),
                  {
                    uid: user.uid,
                    email: user.email,

                    plan,
                    amount,

                    status: "active",

                    purchasedAt: new Date().toISOString(),

                    expiryDate: expiry.toISOString(),

                    paymentId: response.razorpay_payment_id,

                    orderId: response.razorpay_order_id,
                  },
                  { merge: true }
                );
              }

              alert("🎉 Membership Activated");

              navigate("/member-dashboard");
            } else {
              alert("Verification Failed");
            }
          } catch (err) {
            console.log(err);
            alert("Verification Error");
          }
        },

        prefill: {
          name: auth.currentUser?.displayName || "Member",
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
      });
    } catch (err) {
      console.log(err);

      alert("Payment Failed");
    }
  };
    return (
    <section
      id="membership-pricing"
      className="relative overflow-hidden bg-[#030303] py-28"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#030303]" />

        <div className="absolute -top-40 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[170px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400">
            <Crown size={18} />
            Premium Membership
          </div>

          <h2 className="mt-8 text-5xl md:text-6xl font-black">
            Choose Your

            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Membership Plan
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Unlock AI-powered trading tools, premium features,
            smart alerts and exclusive member benefits.
          </p>

        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {plans.map((plan) => (

            <div
              key={plan.title}
              className={`group relative overflow-hidden rounded-[32px] border p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 ${
                plan.color === "yellow"
                  ? "border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-white/5 hover:shadow-[0_0_60px_rgba(250,204,21,.25)]"
                  : "border-green-500/50 bg-gradient-to-b from-green-500/10 to-white/5 hover:shadow-[0_0_60px_rgba(34,197,94,.20)]"
              }`}
            >

              {/* Badge */}

              <div
                className={`absolute right-6 top-6 rounded-full px-4 py-2 text-sm font-bold ${
                  plan.color === "yellow"
                    ? "bg-yellow-400 text-black"
                    : "bg-green-500 text-white"
                }`}
              >
                {plan.badge}
              </div>

              {/* Icon */}

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                  plan.color === "yellow"
                    ? "bg-yellow-400 text-black"
                    : "bg-green-500 text-white"
                }`}
              >
                <Crown size={30} />
              </div>

              <h3 className="mt-8 text-3xl font-black text-white">
                {plan.title}
              </h3>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-black text-white">
                  {plan.price}
                </span>

                <span className="pb-2 text-zinc-400">
                  {plan.duration}
                </span>
              </div>

              <div className="my-8 h-px bg-white/10" />

              <div className="space-y-4">

                {features.map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <Check
                      size={18}
                      className="text-green-400"
                    />

                    <span className="text-zinc-300">
                      {item}
                    </span>

                  </div>

                ))}
              </div>
                            {/* Button */}
              <button
                onClick={() =>
                  handleMembershipPayment(
                    plan.title,
                    plan.title === "Monthly" ? 999 : 9999
                  )
                }
                className={`mt-10 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold transition-all duration-300 ${
                  plan.color === "yellow"
                    ? "bg-yellow-400 text-black hover:scale-[1.03] hover:bg-yellow-300"
                    : "bg-green-500 text-white hover:scale-[1.03] hover:bg-green-400"
                }`}
              >
                Join Now
                <ArrowRight size={20} />
              </button>

              {/* Bottom Glow */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-full ${
                  plan.color === "yellow"
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
              />

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}