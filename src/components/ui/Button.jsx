import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-yellow-400 text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(250,204,21,.35)]",

    secondary:
      "border border-yellow-400 bg-transparent text-yellow-400 hover:bg-yellow-400 hover:text-black",

    ghost:
      "bg-zinc-900 text-white hover:bg-zinc-800",

    danger:
      "bg-red-600 text-white hover:bg-red-500",
  };

  const sizes = {
    sm: "h-10 px-5 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}