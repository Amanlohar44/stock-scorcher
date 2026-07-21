import { motion } from "framer-motion";

export default function Badge({
  children,
  color = "gold",
  className = "",
}) {
  const colors = {
    gold: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    green: "border-green-500/20 bg-green-500/10 text-green-300",
    red: "border-red-500/20 bg-red-500/10 text-red-300",
    white: "border-white/10 bg-white/5 text-white",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-xl ${colors[color]} ${className}`}
    >
      {children}
    </motion.div>
  );
}