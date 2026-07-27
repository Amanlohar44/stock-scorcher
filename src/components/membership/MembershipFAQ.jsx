import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Do I need prior trading experience to use the membership tools?",
    answer: "No. Our platform provides clear algorithmic buy/sell signals and intuitive paper trading terminals suitable for both beginners and seasoned professionals."
  },
  {
    question: "How do I access the AI signals and watchlists after payment?",
    answer: "Once your secure Razorpay transaction is verified, your account is instantly upgraded, granting immediate access to your Member Dashboard and all live tools."
  },
  {
    question: "Can I apply admin coupon codes during checkout?",
    answer: "Yes! You can enter any active promotional coupon code directly in the pricing card input field before clicking 'Pay', and the discounted price will automatically apply."
  },
  {
    question: "What is the refund and cancellation policy?",
    answer: "Memberships grant immediate digital access to live algorithmic endpoints and virtual trading terminals. Hence, all subscription sales are final."
  }
];

export default function MembershipFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#030303] py-28 border-t border-white/5 selection:bg-yellow-400 selection:text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <HelpCircle size={14} />
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked <span className="text-yellow-400">Questions</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base font-light">
            Everything you need to know about our membership plans and platform features.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#070707] border border-white/10 rounded-2xl overflow-hidden transition-colors duration-300 hover:border-white/20"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex justify-between items-center p-6 text-left text-white font-bold text-base sm:text-lg cursor-pointer outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-yellow-400 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-zinc-400 text-sm font-light leading-relaxed border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}