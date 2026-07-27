import { motion } from "framer-motion";

export default function Badge({
  children,
  color = "gold",
  className = "",
}) {
  const colors = {
    gold: "border-yellow-500/30 bg-yellow-400/10 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    green: "border-green-500/30 bg-green-500/10 text-green-400",
    red: "border-red-500/30 bg-red-500/10 text-red-400",
    white: "border-white/10 bg-white/5 text-white",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs sm:text-sm font-black uppercase tracking-wider backdrop-blur-xl transition-colors ${colors[color] || colors.gold} ${className}`}
    >
      {children}
    </motion.div>
  );
}