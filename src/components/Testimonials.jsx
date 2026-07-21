import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Rahul Sharma",
      role: "Swing Trader",
      image: "R",
      profit: "+148%",
      text: "Stock Scorcher completely changed my trading mindset. The AI signals and premium strategies helped me become a confident trader.",
    },
    {
      name: "Priya Verma",
      role: "Beginner Trader",
      image: "P",
      profit: "+92%",
      text: "Started from zero knowledge. The recorded classes and mentorship made everything simple and practical.",
    },
    {
      name: "Amit Patel",
      role: "Investor",
      image: "A",
      profit: "+176%",
      text: "Portfolio tracking and premium community are amazing. Worth every rupee for serious traders.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#030303] py-28">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <h2 className="text-center text-5xl md:text-6xl font-black text-white">
          Student
          <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Success Stories
          </span>
        </h2>

        <p className="mt-6 text-center max-w-2xl mx-auto text-lg text-zinc-400">
          Thousands of traders trust Stock Scorcher to improve their trading journey.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-yellow-400 hover:shadow-[0_0_45px_rgba(250,204,21,.2)]"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-xl font-black text-black">
                    {review.image}
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      {review.name}
                    </h3>

                    <p className="text-sm text-zinc-400">
                      {review.role}
                    </p>
                  </div>

                </div>

                <div className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-bold text-green-400">
                  {review.profit}
                </div>

              </div>

              <div className="mt-6 flex gap-1">

                {[1,2,3,4,5].map((star)=>(
                  <Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="mt-6 leading-8 text-zinc-300">
                "{review.text}"
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}