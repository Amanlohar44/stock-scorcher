import WhatsAppButton from "../components/WhatsAppButton";
import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import Features from "../components/Features";
import Courses from "../components/Courses";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

import PremiumFeatures from "../components/membership/PremiumFeatures";
import PricingCards from "../components/membership/PricingCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

      <Navbar />

      <main>

        {/* Hero */}
        <section id="home">
          <Hero />
        </section>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

        {/* Why Choose */}
        <section id="features">
          <Features />
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

        {/* Courses */}
        <section id="courses">
          <Courses />
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

        {/* Premium Membership */}
        <section id="membership">
          <PremiumFeatures />
          <PricingCards />
        </section>

<div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

        {/* Testimonials */}
        <section id="testimonials">
          <Testimonials />
        </section>

<div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

        {/* Pricing */}
        <section id="pricing">
          <Pricing />
        </section>

<div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

        {/* FAQ */}
        <section id="faq">
          <Faq />
        </section>

<div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

        {/* Contact */}
        <section id="contact">
          <Contact />
        </section>

      </main>

      <WhatsAppButton />

      <Footer />

    </div>
  );
}