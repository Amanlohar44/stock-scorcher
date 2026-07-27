import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function MemberFeatureCard({
  title,
  desc,
  path,
  icon,
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => path && navigate(path)}
      className="group w-full text-left bg-zinc-950 border border-yellow-500/20 rounded-3xl p-6 md:p-8 transition-all duration-300 hover:border-yellow-400/60 hover:bg-zinc-900 hover:-translate-y-1 shadow-xl cursor-pointer flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          {icon && (
            <div className="h-12 w-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl font-bold shadow-lg">
              {icon}
            </div>
          )}
          <h2 className="text-xl md:text-2xl text-white font-black group-hover:text-yellow-400 transition tracking-tight">
            {title}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 transition-all group-hover:bg-yellow-400 group-hover:text-black shadow-lg">
          <FaArrowRight />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-black text-yellow-400 tracking-wider uppercase">
        <span>Launch Tool</span>
        <FaArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}