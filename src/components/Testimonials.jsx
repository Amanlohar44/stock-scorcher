export default function Testimonials() {
  const reviews = [
    {
      name: "Rahul Sharma",
      role: "Swing Trader",
      text: "Stock Scorcher completely changed my trading mindset. The strategies are practical and easy to understand.",
    },
    {
      name: "Priya Verma",
      role: "Beginner Trader",
      text: "I started from zero and now I confidently analyze charts. Highly recommended for beginners!",
    },
    {
      name: "Amit Patel",
      role: "Investor",
      text: "Best stock market course I've ever taken. The risk management lessons alone are worth it.",
    },
  ];

  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-yellow-400 mb-14">
          Student Reviews
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 hover:scale-105 transition duration-300"
            >
              <div className="text-yellow-400 text-3xl mb-4">★★★★★</div>

              <p className="text-gray-300 mb-6 italic">
                "{review.text}"
              </p>

              <h3 className="text-xl font-bold text-white">
                {review.name}
              </h3>

              <p className="text-yellow-400">
                {review.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}