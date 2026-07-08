import axios from "axios";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  const handlePayment = async (amount) => {
    try {
      console.log("🔥 Creating Order...");

     const { data } = await axios.post(
  "https://stock-scorcher-backend.onrender.com/create-order",
  { amount }
);

      const options = {
        key: "rzp_test_TAvTfgBmQvdADz",
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

        handler: async function (response)  {
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
  course: amount,
  purchased: true,
  paymentStatus: "paid",
  paymentId: response.razorpay_payment_id,
  orderId: response.razorpay_order_id,
  purchasedAt: new Date().toISOString(),
},
                  { merge: true }
                );
              }

              alert("🎉 Payment Successful!");

setTimeout(() => {
  navigate("/dashboard");
}, 1000);
            } else {
              alert("❌ Verification Failed");
            }
          } catch (err) {
            console.error(err);
            alert("Verification Error");
          }
        },

        prefill: {
          name: "Student",
          email: "student@gmail.com",
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
      console.error(err);
      alert("Payment Failed");
    }
  };

  return (
    <section className="bg-[#0b0b0f] py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-yellow-400 mb-10 md:mb-14">
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Basic */}
<div className="bg-zinc-900 border border-gray-700 rounded-2xl p-6 md:p-8 text-center">
  <h3 className="text-2xl md:text-3xl font-bold mb-4">
    Basic
  </h3>

  <p className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
    ₹999
  </p>

  <ul className="space-y-3 text-gray-300 mb-8">
    <li>✔ Beginner Friendly</li>
    <li>✔ Basic Learning</li>
    <li>✔ Coming Soon</li>
  </ul>

  <button
    disabled
    className="w-full bg-gray-600 text-white py-3 rounded-xl cursor-not-allowed"
  >
    Coming Soon
  </button>
</div>

          {/* Premium */}
<div className="bg-yellow-400 text-black rounded-2xl p-6 md:p-8 text-center lg:scale-105 shadow-xl">
  <p className="font-bold mb-2 text-sm md:text-base">
    🔥 MOST POPULAR
  </p>

  <h3 className="text-2xl md:text-3xl font-bold mb-4">
    Premium
  </h3>

  <p className="text-4xl md:text-5xl font-bold mb-6">
    ₹6999
  </p>

  <ul className="space-y-3 mb-8">
    <li>✔ Complete Recorded Course</li>
    <li>✔ PDF Notes</li>
    <li>✔ Lifetime Access</li>
    <li>✔ Free Future Updates</li>
  </ul>

  <button
    onClick={() => handlePayment(6999)}
    className="w-full bg-black text-yellow-400 py-3 rounded-xl font-bold hover:bg-zinc-900 transition"
  >
    Buy Now
  </button>
</div>

         {/* Pro */}
<div className="bg-zinc-900 border border-gray-700 rounded-2xl p-6 md:p-8 text-center">
  <h3 className="text-2xl md:text-3xl font-bold mb-4">
    Pro Mentorship
  </h3>

  <p className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
    ₹9999
  </p>

  <ul className="space-y-3 text-gray-300 mb-8">
    <li>✔ Everything in Premium</li>
    <li>✔ Live Mentorship</li>
    <li>✔ Portfolio Review</li>
    <li>✔ Priority Support</li>
  </ul>

  <button
    onClick={() => handlePayment(9999)}
    className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
  >
    Buy Now
  </button>
</div>
        </div>
      </div>
    </section>
  );
}