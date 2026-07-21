import Background from "./Background";
import MouseGlow from "./MouseGlow";
import MarketTicker from "./MarketTicker";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";

import Container from "../ui/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#030303] text-white">

      {/* Background */}
      <Background />

      {/* Mouse Glow */}
      <MouseGlow />

      {/* Live Market */}
      <div className="pt-20">
  <MarketTicker />
</div>

      {/* Hero Content */}
      <Container>

        <div className="relative z-10 flex min-h-[78vh] flex-col items-center justify-between gap-16 py-20 lg:flex-row">

          <HeroLeft />

          <HeroRight />

        </div>

      </Container>

      {/* Bottom Fade Hide PNG Cut */}
<div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-72">
  <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303] to-transparent" />
  <div className="absolute bottom-0 left-0 h-24 w-full bg-[#030303]" />
</div>
    </section>
  );
}