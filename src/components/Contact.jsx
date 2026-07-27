import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      await emailjs.sendForm(
        "service_xm677ji",
        "template_9cjp8qk",
        form.current,
        "C2wjwKlKC0CZNk5xK"
      );

      setStatusMessage({ type: "success", text: "✅ Message Sent Successfully! We will get back to you soon." });
      form.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatusMessage({ 
        type: "error", 
        text: `Failed to send message: ${error?.text || error?.message || "Please try again later."}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Stock Scorcher — Get Support</title>
        <meta name="description" content="Reach out to the Stock Scorcher team for support regarding our trading courses, AI signals, and memberships." />
      </Helmet>

      <section
        id="contact"
        className="relative overflow-hidden bg-black text-white py-28 selection:bg-yellow-400 selection:text-black"
      >
        {/* Cinematic Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
            `,
            backgroundSize: "45px 45px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400 text-xs font-bold uppercase tracking-widest"
            >
              Get In Touch
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white"
            >
              Let's Build Your{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Trading Journey
              </span>
            </motion.h2>

            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-zinc-400 font-light">
              Have questions about our courses or memberships? Our team is always ready to assist you.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-12">
            
            {/* LEFT SIDE: Contact Info Cards (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">

              {/* Email */}
              <div className="group rounded-3xl border border-white/10 bg-[#060606] p-6 backdrop-blur-xl transition-all duration-300 hover:border-yellow-400/50 hover:bg-white/[0.02]">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black text-xl shadow-lg shadow-yellow-400/20 transition-transform group-hover:scale-105">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Email Us</h3>
                    <a
                      href="mailto:stockscorcher@gmail.com"
                      className="text-sm text-zinc-400 hover:text-yellow-400 transition-colors font-light"
                    >
                      stockscorcher@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="group rounded-3xl border border-white/10 bg-[#060606] p-6 backdrop-blur-xl transition-all duration-300 hover:border-yellow-400/50 hover:bg-white/[0.02]">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black text-xl shadow-lg shadow-yellow-400/20 transition-transform group-hover:scale-105">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Call Us</h3>
                    <a
                      href="tel:+917568216451"
                      className="text-sm text-zinc-400 hover:text-yellow-400 transition-colors font-light"
                    >
                      +91 7568216451
                    </a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="group rounded-3xl border border-white/10 bg-[#060606] p-6 backdrop-blur-xl transition-all duration-300 hover:border-yellow-400/50 hover:bg-white/[0.02]">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black text-xl shadow-lg shadow-yellow-400/20 transition-transform group-hover:scale-105">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Location</h3>
                    <p className="text-sm text-zinc-300 font-light">Boheda, Chittorgarh</p>
                    <p className="text-xs text-zinc-500">Rajasthan, India</p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: Contact Form (7 Cols) */}
            <div className="lg:col-span-7 rounded-[2.5rem] border border-white/10 bg-[#060606] p-8 sm:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Send us a Message
              </h3>
              
              <p className="mt-2 text-sm text-zinc-400 font-light">
                Fill out the form below and our team will get back to you shortly.
              </p>

              {statusMessage && (
                <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                  statusMessage.type === "success" 
                    ? "bg-green-500/10 border border-green-500/30 text-green-400" 
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}>
                  {statusMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form ref={form} onSubmit={sendEmail} className="mt-6 space-y-5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Aman Lohar"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="trader@example.com"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    required
                    placeholder="Write your message or inquiry here..."
                    className="w-full resize-none bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(250,204,21,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </button>

              </form>

            </div>

          </div>

          {/* WhatsApp Support CTA */}
          <div className="mt-16 rounded-[2.5rem] border border-green-500/30 bg-gradient-to-r from-green-500/[0.08] via-black to-yellow-400/[0.05] p-8 sm:p-10 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row text-center lg:text-left">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Need Instant Support? 💬
                </h3>
                <p className="mt-2 max-w-2xl text-sm sm:text-base text-zinc-400 font-light">
                  Chat directly with our support team on WhatsApp for quick answers regarding courses, memberships, and trading tools.
                </p>
              </div>

              <a
                href="https://wa.me/message/GWDVWEYHKZ63G1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-green-500 hover:bg-green-400 px-8 py-4 text-sm font-extrabold text-white transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] shrink-0 cursor-pointer"
              >
                <FaWhatsapp size={20} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}