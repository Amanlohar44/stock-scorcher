import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

export default function Contact() {
  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-yellow-400">
            Contact Us
          </h2>

          <p className="text-gray-400 mt-5 text-lg">
            Have questions? Get in touch with Stock Scorcher.
            We're always happy to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Email */}
          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 text-center hover:scale-105 transition duration-300">

            <div className="text-yellow-400 text-5xl mb-6 flex justify-center">
              <FaEnvelope />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Email
            </h3>

            <a
              href="mailto:stockscorcher@gmail.com"
              className="text-gray-300 hover:text-yellow-400"
            >
              stockscorcher@gmail.com
            </a>

          </div>

          {/* Phone */}
          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 text-center hover:scale-105 transition duration-300">

            <div className="text-yellow-400 text-5xl mb-6 flex justify-center">
              <FaPhoneAlt />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Phone
            </h3>

            <a
              href="tel:+917568216451"
              className="text-gray-300 hover:text-yellow-400"
            >
              +91 7568216451
            </a>

          </div>

          {/* Location */}
          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 text-center hover:scale-105 transition duration-300">

            <div className="text-yellow-400 text-5xl mb-6 flex justify-center">
              <FaMapMarkerAlt />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Location
            </h3>

            <p className="text-gray-300">
              Boheda, Chittorgarh
            </p>

            <p className="text-gray-400">
              Rajasthan, India
            </p>

          </div>

        </div>

        {/* WhatsApp CTA */}

        <div className="mt-16 text-center">

          <a
            href="https://wa.me/message/GWDVWEYHKZ63G1"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition"
          >
            <FaWhatsapp />
            Chat on WhatsApp
          </a>

        </div>

      </div>
    </section>
  );
}