import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = true,
}) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -8,
              scale: 1.02,
            }
          : {}
      }
      transition={{
        duration: 0.3,
      }}
      className={`
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/10
        bg-white/5
        backdrop-blur-2xl
        shadow-[0_10px_60px_rgba(0,0,0,.45)]
        ${className}
      `}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-blue-500/5" />

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/5" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

    </motion.div>
  );
}