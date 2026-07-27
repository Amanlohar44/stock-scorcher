import MembershipHero from "../components/membership/MembershipHero";
import PricingCards from "../components/membership/PricingCards";

export default function Membership() {
  return (
    <div className="min-h-screen bg-black text-white">
      

      <MembershipHero />

      <section id="pricing">
        <PricingCards />
      </section>

      
    </div>
  );
}