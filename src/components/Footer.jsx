import React from "react";
import { Link } from "react-router-dom";
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
    <footer className="relative overflow-hidden border-t border-yellow-400/10 bg-[#030303] text-white selection:bg-yellow-400 selection:text-black">
      
      {/* Cinematic Background Glows & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
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
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          
          {/* 1. Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-3xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                STOCK SCORCHER
              </span>
            </h2>
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[10px] font-extrabold uppercase tracking-widest text-yellow-400">
              AI Trading Platform
            </span>
            <p className="text-sm leading-relaxed text-zinc-400 font-light">
              Empowering traders with advanced AI signals, practical chart patterns, price action strategies, and disciplined risk management.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold tracking-wide uppercase text-white border-l-2 border-yellow-400 pl-3">
              Explore Pages
            </h3>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link to="/" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Courses & Modules
                </Link>
              </li>
              
              <li>
                <Link to="/reviews" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Student Reviews ⭐
                </Link>
              </li>
              <li>
                <Link to="/blog" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Trading Blog 📝
                </Link>
              </li>
              <li>
                <Link to="/membership" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  VIP Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Support & Info */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold tracking-wide uppercase text-white border-l-2 border-yellow-400 pl-3">
              Support & Help
            </h3>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link to="/faq" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  FAQ / Help Center
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Verify Certificate 🎓
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" onClick={scrollToTop} className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Information */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold tracking-wide uppercase text-white border-l-2 border-yellow-400 pl-3">
              Get in Touch
            </h3>
            <div className="space-y-3 text-sm font-light">
              <a
                href="mailto:stockscorcher@gmail.com"
                className="flex items-center gap-3 text-zinc-400 transition-colors hover:text-yellow-400"
              >
                <FaEnvelope className="text-yellow-400 shrink-0" size={14} />
                <span className="truncate">stockscorcher@gmail.com</span>
              </a>

              <a
                href="tel:+917568216451"
                className="flex items-center gap-3 text-zinc-400 transition-colors hover:text-yellow-400"
              >
                <FaPhoneAlt className="text-yellow-400 shrink-0" size={14} />
                <span>+91 7568216451</span>
              </a>

              <div className="flex items-start gap-3 text-zinc-400">
                <FaMapMarkerAlt className="mt-1 text-yellow-400 shrink-0" size={14} />
                <span className="leading-snug">
                  Boheda, Chittorgarh <br />
                  Rajasthan, India
                </span>
              </div>
            </div>
          </div>

          {/* 5. Follow Us (Social Media) */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold tracking-wide uppercase text-white border-l-2 border-yellow-400 pl-3">
              Follow Us
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Join our active trading community across channels.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/stockscorcher_official?igsh=MTl0aXdpaG5sM3BhZQ=="
                target="_blank"
                rel="noreferrer"
                title="Instagram - Stock Scorcher"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg text-white transition-all hover:-translate-y-1 hover:bg-pink-500 hover:border-pink-500 shadow-lg cursor-pointer"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.instagram.com/amanlohar44?igsh=Yjc5MHF6NWM2YXY5"
                target="_blank"
                rel="noreferrer"
                title="Instagram - Aman Lohar"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg text-white transition-all hover:-translate-y-1 hover:bg-pink-500 hover:border-pink-500 shadow-lg cursor-pointer"
              >
                <FaInstagram />
              </a>

              <a
                href="https://youtube.com/@stockscorcherofficial?si=bYbEZLv8qku-y-Pq"
                target="_blank"
                rel="noreferrer"
                title="YouTube Channel"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg text-white transition-all hover:-translate-y-1 hover:bg-red-500 hover:border-red-500 shadow-lg cursor-pointer"
              >
                <FaYoutube />
              </a>

              <a
                href="https://t.me/stockscorcher"
                target="_blank"
                rel="noreferrer"
                title="Telegram Community"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg text-white transition-all hover:-translate-y-1 hover:bg-sky-500 hover:border-sky-500 shadow-lg cursor-pointer"
              >
                <FaTelegramPlane />
              </a>

              <a
                href="https://wa.me/message/GWDVWEYHKZ63G1"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp Support"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg text-white transition-all hover:-translate-y-1 hover:bg-green-500 hover:border-green-500 shadow-lg cursor-pointer"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://linktr.ee/stockscorcherofficial"
                target="_blank"
                rel="noreferrer"
                title="Linktree"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-lg text-white transition-all hover:-translate-y-1 hover:bg-yellow-400 hover:border-yellow-400 hover:text-black shadow-lg cursor-pointer"
              >
                <FaLink />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row text-xs">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-zinc-400">
              © {new Date().getFullYear()} <strong className="text-white font-bold">Stock Scorcher</strong>. All Rights Reserved.
            </p>
            <p className="text-zinc-500 font-medium">
              Learn • Analyze • Grow | Founded by <span className="text-yellow-400 font-semibold">Aman Lohar</span>
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-2.5 font-bold text-yellow-400 transition-all duration-300 hover:bg-yellow-400 hover:text-black cursor-pointer shadow-[0_0_20px_rgba(250,204,21,0.15)]"
          >
            Back to Top
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </button>
        </div>

      </div>
    </footer>
  );
}