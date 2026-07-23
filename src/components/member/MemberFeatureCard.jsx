import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function MemberFeatureCard({
  title,
  desc,
  path,
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => path && navigate(path)}
      className="group w-full text-left bg-zinc-900 border border-yellow-500/20 rounded-2xl p-6 transition-all duration-300 hover:border-yellow-400/50 hover:bg-yellow-400/5 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-xl md:text-2xl text-yellow-400 font-bold">
            {title}
          </h2>

          <p className="text-gray-400 mt-3 leading-7">
            {desc}
          </p>
        </div>

        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 transition group-hover:bg-yellow-400 group-hover:text-black">
          <FaArrowRight />
        </div>

      </div>

      <p className="mt-5 text-sm font-semibold text-yellow-400">
        Open Tool →
      </p>

    </button>
  );
}