import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <motion.div
        whileHover={{ rotate: 8, scale: 1.08 }}
        transition={{ duration: 0.25 }}
        className="flex h-11 w-11 items-center justify-center"
      >
        <img
  src={logo}
  alt="Stock Scorcher"
  className="h-12 w-12 object-contain"
/>
      </motion.div>

      <div className="leading-tight">
        <h1 className="text-lg font-black tracking-wide text-white">
          STOCK SCORCHER
        </h1>

        <p className="text-xs text-zinc-400">
          AI Trading Platform
        </p>
      </div>
    </Link>
  );
}