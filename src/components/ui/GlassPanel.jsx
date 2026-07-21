import { motion } from "framer-motion";

export default function GlassPanel({
  children,
  className = "",
  hover = true,
}) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -6,
              scale: 1.015,
            }
          : {}
      }
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-[30px]
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl
        shadow-[0_20px_80px_rgba(0,0,0,.45)]
        ${className}
      `}
    >
      {/* Animated Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-blue-500/5 opacity-70 transition duration-500 group-hover:opacity-100" />

      {/* Top Shine */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Left Glow */}
      <div className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

      {/* Right Glow */}
      <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}