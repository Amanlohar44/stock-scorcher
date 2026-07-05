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
    <section className="bg-black py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-yellow-400 mb-12">
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-yellow-500 rounded-xl mb-4 overflow-hidden"
          >
            <button
              onClick={() =>
                setOpen(open === index ? null : index)
              }
              className="w-full text-left p-5 flex justify-between items-center bg-zinc-900"
            >
              <span className="font-semibold">{faq.question}</span>

              <span className="text-yellow-400 text-2xl">
                {open === index ? "-" : "+"}
              </span>
            </button>

            {open === index && (
              <div className="bg-zinc-800 p-5 text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}