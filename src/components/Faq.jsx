import { useState } from "react";

export default function Faq() {
  const faqs = [
    {
      question: "Is this course suitable for beginners?",
      answer:
        "Yes. We start from the basics and gradually move to advanced trading concepts.",
    },
    {
      question: "Will I get lifetime access?",
      answer:
        "Yes, all premium students get lifetime access to course videos and updates.",
    },
    {
      question: "Will I receive PDF notes?",
      answer:
        "Yes, detailed PDF notes are included with every premium course.",
    },
    {
      question: "Do you provide live classes?",
      answer:
        "Yes, Premium students get access to live Q&A and mentoring sessions.",
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <section className="bg-black py-14 md:py-20 px-5 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-yellow-400 mb-10 md:mb-12">
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-yellow-500 rounded-xl mb-5 overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === index ? null : index)}
              className="w-full flex justify-between items-center text-left bg-zinc-900 p-4 md:p-5 transition lg:hover:bg-zinc-800"
            >
              <span className="font-semibold text-sm md:text-lg pr-4">
                {faq.question}
              </span>

              <span className="text-yellow-400 text-xl sm:text-2xl font-bold">
                {open === index ? "−" : "+"}
              </span>
            </button>

            {open === index && (
              <div className="bg-zinc-800 text-gray-300 p-4 md:p-5 text-sm md:text-base leading-7">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}