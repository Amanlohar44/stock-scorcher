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
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2 text-sm font-semibold text-yellow-400">
        <span>Course Progress</span>
        <span>{percentage}%</span>
      </div>

      <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}