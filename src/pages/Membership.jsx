import Navbar from "../components/NavbarOld";
import Footer from "../components/Footer";

import MembershipHero from "../components/membership/MembershipHero";
import PricingCards from "../components/membership/PricingCards";

export default function Membership() {
  return (
    <div className="bg-black text-white min-h-screen">

      <Navbar />

      <MembershipHero />

      <section id="pricing">
  <PricingCards />
</section>

      <Footer />

    </div>
  );
}