export default function ProgressBar({
  completedLessons,
  totalLessons,
}) {
  const percentage = Math.round(
    (completedLessons.length / totalLessons) * 100
  );

  return (
    <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 mb-8">
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold text-yellow-400">
          Course Progress
        </h2>

        <span className="text-white font-bold">
          {percentage}%
        </span>
      </div>

      <div className="w-full bg-zinc-700 rounded-full h-4">
        <div
          className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>

      <p className="text-gray-300 mt-3">
        {completedLessons.length} / {totalLessons} Lessons Completed
      </p>
    </div>
  );
}