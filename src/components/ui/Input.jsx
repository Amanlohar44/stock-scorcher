export default function Input({
  className = "",
  icon,
  ...props
}) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
          {icon}
        </div>
      )}

      <input
        className={`
          h-14
          w-full
          rounded-2xl
          border
          border-white/10
          bg-white/5
          px-5
          ${icon ? "pl-12" : ""}
          text-white
          placeholder:text-zinc-500
          backdrop-blur-xl
          outline-none
          transition-all
          duration-300
          focus:border-yellow-400
          focus:ring-2
          focus:ring-yellow-400/20
          ${className}
        `}
        {...props}
      />
    </div>
  );
}