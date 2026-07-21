import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

export default function Contact() {
  const form = useRef();

  const [loading, setLoading] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await emailjs.sendForm(
  "service_xm677ji",
  "template_9cjp8qk",
  form.current,
  "C2wjwKlKC0CZNk5xK"
);

      alert("✅ Message Sent Successfully!");

      form.current.reset();
    } catch (error) {
  console.error("EmailJS Error:", error);

  alert(
    `Failed: ${error?.text || error?.message || JSON.stringify(error)}`
  );
}
    setLoading(false);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#030303] py-28"
    >
      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -top-40 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[170px]" />

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

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-2 text-yellow-400">

            Contact Us

          </div>

          <h2 className="mt-8 text-5xl md:text-6xl font-black text-white">

            Let's Build Your

            <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">

              Trading Journey

            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">

            Have questions about our courses or membership?
            Our team is always ready to help you.

          </p>

        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          {/* LEFT SIDE */}

<div className="space-y-6">

  {/* Email */}

  <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all duration-300 hover:border-yellow-400 hover:-translate-y-2">

    <div className="flex items-center gap-5">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-black text-2xl">

        <FaEnvelope />

      </div>

      <div>

        <h3 className="text-2xl font-bold text-white">

          Email

        </h3>

        <a
          href="mailto:stockscorcher@gmail.com"
          className="text-zinc-400 hover:text-yellow-400"
        >
          stockscorcher@gmail.com
        </a>

      </div>

    </div>

  </div>

  {/* Phone */}

  <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all duration-300 hover:border-yellow-400 hover:-translate-y-2">

    <div className="flex items-center gap-5">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-black text-2xl">

        <FaPhoneAlt />

      </div>

      <div>

        <h3 className="text-2xl font-bold text-white">

          Phone

        </h3>

        <a
          href="tel:+917568216451"
          className="text-zinc-400 hover:text-yellow-400"
        >
          +91 7568216451
        </a>

      </div>

    </div>

  </div>

  {/* Location */}

  <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all duration-300 hover:border-yellow-400 hover:-translate-y-2">

    <div className="flex items-center gap-5">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-black text-2xl">

        <FaMapMarkerAlt />

      </div>

      <div>

        <h3 className="text-2xl font-bold text-white">

          Location

        </h3>

        <p className="text-zinc-300">

          Boheda, Chittorgarh

        </p>

        <p className="text-zinc-500">

          Rajasthan, India

        </p>

      </div>

    </div>

  </div>

</div>

{/* RIGHT SIDE */}

<div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

  <h3 className="text-3xl font-black text-white">

    Send us a Message

  </h3>

  <p className="mt-3 text-zinc-400">

    Fill out the form below and we'll get back to you as soon as possible.

  </p>

  <form
    ref={form}
    onSubmit={sendEmail}
    className="mt-8 space-y-6"
  >
    {/* Name */}

<div>

  <label className="mb-2 block text-sm font-semibold text-zinc-300">
    Full Name
  </label>

  <input
    type="text"
    name="name"
    required
    placeholder="Enter your full name"
    className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition-all duration-300 focus:border-yellow-400"
  />

</div>

{/* Email */}

<div>

  <label className="mb-2 block text-sm font-semibold text-zinc-300">
    Email Address
  </label>

  <input
    type="email"
    name="email"
    required
    placeholder="Enter your email"
    className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition-all duration-300 focus:border-yellow-400"
  />

</div>

{/* Message */}

<div>

  <label className="mb-2 block text-sm font-semibold text-zinc-300">
    Message
  </label>

  <textarea
    rows={6}
    name="message"
    required
    placeholder="Write your message..."
    className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition-all duration-300 focus:border-yellow-400"
  />

</div>

{/* Button */}

<button
  type="submit"
  disabled={loading}
  className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 py-4 text-lg font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(250,204,21,.35)] disabled:opacity-60"
>
  {loading ? "Sending..." : "Send Message 🚀"}
</button>

</form>

</div>

</div>

{/* WhatsApp CTA */}

<div className="mt-20 rounded-[32px] border border-green-500/20 bg-gradient-to-r from-green-500/10 via-transparent to-yellow-400/10 p-10 backdrop-blur-xl">

  <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">

    <div>

      <h3 className="text-4xl font-black text-white">
        Need Instant Support?
      </h3>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
        Chat directly with our team on WhatsApp and get quick answers regarding
        courses, memberships and trading support.
      </p>

    </div>

    <a
      href="https://wa.me/message/GWDVWEYHKZ63G1"
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-2xl bg-green-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,.35)]"
    >
      <FaWhatsapp size={24} />

      Chat on WhatsApp

    </a>

  </div>

</div>

</div>

</section>
);
}