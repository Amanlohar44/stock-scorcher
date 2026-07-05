import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Courses from "../components/Courses";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing"; // ✅ Ye line honi chahiye

export default function Home() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <Courses />
      <Testimonials />
      <Pricing />   {/* ✅ Ye line honi chahiye */}
    </div>
  );
}