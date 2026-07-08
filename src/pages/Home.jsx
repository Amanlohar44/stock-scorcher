import WhatsAppButton from "../components/WhatsAppButton";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Courses from "../components/Courses";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-black text-white">

      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="courses">
        <Courses />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      {/* IMPORTANT */}
      <section id="pricing">
        <Pricing />
      </section>

      <section id="faq">
        <Faq />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <WhatsAppButton />

      <Footer />

    </div>
  );
}