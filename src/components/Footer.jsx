import {
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
  FaWhatsapp,
  FaLink,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-yellow-400/10 bg-[#030303]">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -top-40 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[180px]" />

        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[180px]" />

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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <h2 className="text-4xl font-black">

              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">

                STOCK SCORCHER

              </span>

            </h2>

            <p className="mt-2 text-zinc-500">

              AI Trading Platform

            </p>

            <p className="mt-6 leading-8 text-zinc-400">

              Learn Stock Market, Swing Trading, Price Action,
              Candlestick Patterns and Risk Management with
              practical strategies designed for beginners and professionals.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-2xl font-bold text-white">

              Quick Links

            </h3>

            <div className="mt-7 space-y-4">

              <a href="#home" className="block text-zinc-400 hover:text-yellow-400 transition">
                Home
              </a>

              <a href="#features" className="block text-zinc-400 hover:text-yellow-400 transition">
                Features
              </a>

              <a href="#membership" className="block text-zinc-400 hover:text-yellow-400 transition">
                Membership
              </a>

              <a href="#courses" className="block text-zinc-400 hover:text-yellow-400 transition">
                Courses
              </a>

              <a href="#faq" className="block text-zinc-400 hover:text-yellow-400 transition">
                FAQ
              </a>

              <a href="#contact" className="block text-zinc-400 hover:text-yellow-400 transition">
                Contact
              </a>

            </div>

          </div>

                    {/* Contact */}

          <div>

            <h3 className="text-2xl font-bold text-white">

              Contact

            </h3>

            <div className="mt-7 space-y-5">

              <a
                href="mailto:stockscorcher@gmail.com"
                className="flex items-center gap-3 text-zinc-400 transition hover:text-yellow-400"
              >

                <FaEnvelope className="text-yellow-400" />

                stockscorcher@gmail.com

              </a>

              <a
                href="tel:+917568216451"
                className="flex items-center gap-3 text-zinc-400 transition hover:text-yellow-400"
              >

                <FaPhoneAlt className="text-yellow-400" />

                +91 7568216451

              </a>

              <div className="flex items-start gap-3 text-zinc-400">

                <FaMapMarkerAlt className="mt-1 text-yellow-400" />

                <div>

                  Boheda, Chittorgarh

                  <br />

                  Rajasthan, India

                </div>

              </div>

            </div>

          </div>

          {/* Follow Us */}

          <div>

            <h3 className="text-2xl font-bold text-white">

              Follow Us

            </h3>

            <p className="mt-4 text-zinc-400">

              Join our growing trading community.

            </p>

            <div className="mt-7 flex flex-wrap gap-4">

              <a
                href="https://www.instagram.com/stockscorcher_official?igsh=MTl0aXdpaG5sM3BhZQ=="
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl text-white transition-all hover:-translate-y-1 hover:bg-pink-500"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.instagram.com/amanlohar44?igsh=Yjc5MHF6NWM2YXY5"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl text-white transition-all hover:-translate-y-1 hover:bg-pink-500"
              >
                <FaInstagram />
              </a>

              <a
                href="https://youtube.com/@stockscorcherofficial?si=bYbEZLv8qku-y-Pq"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl text-white transition-all hover:-translate-y-1 hover:bg-red-500"
              >
                <FaYoutube />
              </a>

              <a
                href="https://t.me/stockscorcher"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl text-white transition-all hover:-translate-y-1 hover:bg-sky-500"
              >
                <FaTelegramPlane />
              </a>

              <a
                href="https://wa.me/message/GWDVWEYHKZ63G1"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl text-white transition-all hover:-translate-y-1 hover:bg-green-500"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://linktr.ee/stockscorcherofficial"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl text-white transition-all hover:-translate-y-1 hover:bg-yellow-400 hover:text-black"
              >
                <FaLink />
              </a>

            </div>

          </div>

        </div>

                {/* Bottom */}

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">

          <div>

            <p className="text-zinc-500 text-center md:text-left">

              © {new Date().getFullYear()} Stock Scorcher. All Rights Reserved.

            </p>

            <p className="mt-2 text-sm text-zinc-600 text-center md:text-left">

              Built with ❤️ for the Trading Community.

            </p>

          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 font-semibold text-yellow-400 transition-all duration-300 hover:bg-yellow-400 hover:text-black"
          >

            Back to Top

            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />

          </button>

        </div>

      </div>

    </footer>
  );
}