import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function Faq() {
  const faqs = [
    {
      question: "Is this course suitable for beginners?",
      answer:
        "Yes. Our course starts from the basics and gradually covers advanced concepts like chart patterns, risk management, and live market analysis.",
    },
    {
      question: "Will I get lifetime access?",
      answer:
        "Absolutely! Once you purchase the Premium Course, you'll receive lifetime access including all future updates at no extra cost.",
    },
    {
      question: "Will I receive PDF notes?",
      answer:
        "Yes. Every premium student gets professionally designed PDF notes and trading resources.",
    },
    {
      question: "Do you provide live classes?",
      answer:
        "Yes. Pro Mentorship students receive live sessions, Q&A support, portfolio reviews, and market discussions.",
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#030303] py-24">

      {/* Background Glow */}
      <div className="absolute inset-0">

        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[170px]" />

      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400">

            <HelpCircle size={18} />

            FAQ

          </div>

          <h2 className="mt-8 text-5xl md:text-6xl font-black text-white">

            Frequently Asked

            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">

              Questions

            </span>

          </h2>

          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-lg">

            Everything you need to know before joining Stock Scorcher Premium.

          </p>

        </div>

        <div className="mt-16 space-y-6">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-yellow-400/40"
            >

              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full items-center justify-between p-7 text-left"
              >

                <h3 className="text-lg md:text-xl font-bold text-white">

                  {faq.question}

                </h3>

                <ChevronDown
                  className={`text-yellow-400 transition-transform duration-300 ${
                    open === index ? "rotate-180" : ""
                  }`}
                  size={28}
                />

              </button>

              <div
                className={`grid transition-all duration-500 ${
                  open === index
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >

                <div className="overflow-hidden">

                  <p className="px-7 pb-7 text-zinc-400 leading-8">

                    {faq.answer}

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}