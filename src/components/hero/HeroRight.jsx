import { motion } from "framer-motion";
import {

} from "lucide-react";

import hero from "../../assets/hero.png";
import GlassPanel from "../ui/GlassPanel";

export default function HeroRight() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-1 items-center justify-center"
    >
      {/* Blue Glow */}
      <div className="absolute h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[150px]" />

      {/* Gold Glow */}
      <div className="absolute h-[350px] w-[350px] rounded-full bg-yellow-400/15 blur-[120px]" />

      {/* Hero Image */}
      <motion.img
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        src={hero}
        alt="Stock Scorcher"
        className="relative z-10 -mt-12 h-auto w-[340px] sm:w-[470px] lg:w-[650px] object-contain"
      />




    </motion.div>
  );
}