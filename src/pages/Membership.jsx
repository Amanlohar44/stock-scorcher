import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import MembershipHero from "../components/membership/MembershipHero";
import PricingCards from "../components/membership/PricingCards";

export default function Membership() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <MembershipHero />

      <section id="pricing">
        <PricingCards />
      </section>

      <Footer />
    </div>
  );
}