export default function Input({
  className = "",
  icon,
  ...props
}) {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400/70 transition-colors pointer-events-none text-base">
          {icon}
        </div>
      )}

      <input
        className={`
          h-14
          w-full
          rounded-2xl
          border
          border-yellow-500/25
          bg-zinc-950/90
          px-5
          ${icon ? "pl-12" : ""}
          text-white
          placeholder:text-zinc-500
          text-xs
          sm:text-sm
          font-medium
          backdrop-blur-2xl
          outline-none
          transition-all
          duration-300
          focus:border-yellow-400
          focus:ring-4
          focus:ring-yellow-400/15
          shadow-inner
          ${className}
        `}
        {...props}
      />
    </div>
  );
}