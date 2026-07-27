import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

export default function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-3 group focus:outline-none"
      aria-label="Stock Scorcher Home"
    >
      <motion.div
        whileHover={{ rotate: 8, scale: 1.08 }}
        transition={{ duration: 0.25 }}
        className="flex h-11 w-11 items-center justify-center shrink-0"
      >
        <img
          src={logo}
          alt="Stock Scorcher Logo"
          className="h-11 w-11 object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]"
        />
      </motion.div>

      <div className="leading-tight">
        <span className="block text-base sm:text-lg font-black tracking-wider bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
          STOCK SCORCHER
        </span>
        <span className="block text-[10px] sm:text-xs font-semibold text-zinc-400 tracking-widest uppercase">
          AI Trading Platform
        </span>
      </div>
    </Link>
  );
}