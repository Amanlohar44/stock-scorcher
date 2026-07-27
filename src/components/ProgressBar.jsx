export default function ProgressBar({
  progress,
  completedLessons = [],
  totalLessons = 0,
}) {
  const percentage =
    progress !== undefined
      ? progress
      : totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  return (
    <div className="w-full bg-zinc-950 rounded-2xl p-5 border border-yellow-500/20 shadow-xl mb-6">
      <div className="flex justify-between items-center mb-3 text-xs sm:text-sm font-black tracking-wider uppercase text-yellow-400">
        <span>Course Progress</span>
        <span className="bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full text-yellow-300">
          {percentage}% Completed
        </span>
      </div>

      <div className="w-full bg-zinc-900 rounded-full h-3.5 p-0.5 border border-white/5 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}