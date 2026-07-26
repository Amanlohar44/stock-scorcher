import { Helmet } from "react-helmet-async";
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
import AboutFounder from "../components/AboutFounder";
import PremiumFeatures from "../components/membership/PremiumFeatures";
import PricingCards from "../components/membership/PricingCards";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>
          Stock Scorcher | Learn Stock Market Trading & AI Analysis
        </title>

        <meta
          name="description"
          content="Learn Stock Market Trading with Stock Scorcher. AI Trading, Swing Trading, Price Action, Technical Analysis, Premium Courses and Mentorship."
        />

        <meta
          name="keywords"
          content="Stock Scorcher, Stock Market Course, Swing Trading, AI Trading, Technical Analysis"
        />

        <link
          rel="canonical"
          href="https://stockscorcher.com/"
        />
      </Helmet>

      <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

        <Navbar />

        <main>

          <section id="home">
            <Hero />
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

          <section id="about">
  <AboutFounder />
</section>

<div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />


          <section id="features">
            <Features />
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          <section id="courses">
            <Courses />
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          <section id="membership">
            <PremiumFeatures />
            <PricingCards />
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          <section id="testimonials">
            <Testimonials />
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          <section id="pricing">
            <Pricing />
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          <section id="faq">
            <Faq />
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

          <section id="contact">
            <Contact />
          </section>

        </main>

        <WhatsAppButton />

        <Footer />

      </div>
    </>
  );
}