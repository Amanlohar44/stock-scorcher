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
              y: -6,
              scale: 1.01,
            }
          : {}
      }
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border border-yellow-500/25
        bg-zinc-950/90
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        p-6 sm:p-8
        ${className}
      `}
    >
      {/* Background Ambient Glow */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}