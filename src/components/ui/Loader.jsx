import { Loader2 } from "lucide-react";

export default function Loader({
  size = 32,
  className = "",
  text = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 ${className}`}>
      <Loader2
        size={size}
        className="animate-spin text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]"
      />
      {text && (
        <p className="text-xs font-black tracking-widest text-zinc-400 uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}