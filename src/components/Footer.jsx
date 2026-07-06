import {
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-yellow-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-yellow-400">
              Stock Scorcher
            </h2>

            <p className="text-gray-400 mt-4 leading-7">
              Learn Stock Market, Swing Trading, Price Action,
              Candlestick Patterns and Risk Management with practical
              strategies designed for beginners and professionals.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5">
              Contact
            </h3>

            <div className="space-y-3">

              <a
                href="mailto:stockscorcher@gmail.com"
                className="block text-gray-400 hover:text-yellow-400 transition"
              >
                📧 stockscorcher@gmail.com
              </a>

              <a
                href="tel:+917568216451"
                className="block text-gray-400 hover:text-yellow-400 transition"
              >
                📞 +91 7568216451
              </a>

              <p className="text-gray-400">
                📍 Boheda, Chittorgarh (Rajasthan)
              </p>

            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5">
              Follow Us
            </h3>

            <div className="flex flex-wrap gap-4 text-2xl">

              <a
                href="https://www.instagram.com/stockscorcherofficial?igsh=Nm0ycHdta2Nhc2Qx"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-500 transition"
                title="Official Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.instagram.com/amanlohar44?igsh=Yjc5MHF6NWM2YXY5"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-500 transition"
                title="Aman Lohar"
              >
                <FaInstagram />
              </a>

              <a
                href="https://youtube.com/@stockscorcherofficial?si=bYbEZLv8qku-y-Pq"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-500 transition"
                title="YouTube"
              >
                <FaYoutube />
              </a>

              <a
                href="https://t.me/stockscorcher"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 transition"
                title="Telegram"
              >
                <FaTelegramPlane />
              </a>

              <a
                href="https://wa.me/message/GWDVWEYHKZ63G1"
                target="_blank"
                rel="noreferrer"
                className="hover:text-green-500 transition"
                title="WhatsApp"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://linktr.ee/stockscorcherofficial"
                target="_blank"
                rel="noreferrer"
                className="hover:text-yellow-400 transition"
                title="Linktree"
              >
                <FaLink />
              </a>

            </div>
          </div>

        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-gray-500">
          © {new Date().getFullYear()} Stock Scorcher. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}