import React from "react";
import { motion } from "framer-motion";
import hero from "../../assets/hero.png";

export default function HeroRight() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-1 items-center justify-center"
    >
      {/* Blue Cinematic Glow */}
      <div className="absolute h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[150px] pointer-events-none" />

      {/* Gold Cinematic Glow */}
      <div className="absolute h-[350px] w-[350px] rounded-full bg-yellow-400/15 blur-[120px] pointer-events-none" />

      {/* Floating Hero Image / Dashboard Preview */}
      <motion.img
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        src={hero}
        alt="Stock Scorcher AI Trading Platform Dashboard"
        className="relative z-10 -mt-12 h-auto w-[340px] sm:w-[470px] lg:w-[650px] object-contain drop-shadow-[0_25px_50px_rgba(250,204,21,0.15)]"
      />

    </motion.div>
  );
}