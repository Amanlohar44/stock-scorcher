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
        rounded-3xl
        border border-yellow-500/25
        bg-zinc-950/80
        backdrop-blur-3xl
        shadow-[0_20px_80px_rgba(0,0,0,0.5)]
        ${className}
      `}
    >
      {/* Animated Gold/Yellow Gradient Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/5 opacity-60 transition duration-500 group-hover:opacity-100 pointer-events-none" />

      {/* Top Shine Highlight */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent pointer-events-none" />

      {/* Ambient Glow Effects */}
      <div className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}