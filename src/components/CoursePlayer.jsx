export default function CoursePlayer({
  currentVideo,
  currentLesson,
  completedLessons = [],
  onComplete,
}) {
  const isCompleted = completedLessons?.includes(currentLesson);

  return (
    <div className="space-y-6 w-full">

      {/* Video Container */}
      <div className="rounded-3xl overflow-hidden border border-yellow-500/30 bg-zinc-950 shadow-2xl">
        <div className="bg-zinc-900/90 border-b border-white/5 p-4 sm:p-5 flex items-center justify-between">
          <h2 className="text-yellow-400 text-xs sm:text-sm font-black tracking-wider uppercase flex items-center gap-2">
            <span>▶</span> Watch Lesson
          </h2>
          {currentLesson && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 uppercase tracking-widest">
              Active Lesson
            </span>
          )}
        </div>

        {currentVideo ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              src={currentVideo}
              title="Course Video"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center bg-black/80 p-6 text-center">
            <p className="text-xs sm:text-sm font-semibold text-zinc-400 tracking-wide">
              Select any lesson from the Day List to start watching.
            </p>
          </div>
        )}
      </div>

      {/* Completion Button */}
      <button
        type="button"
        disabled={!currentLesson || isCompleted}
        onClick={onComplete}
        className={`w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl ${
          isCompleted
            ? "bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-yellow-400/20 active:scale-95 cursor-pointer"
        } disabled:opacity-50`}
      >
        {isCompleted
          ? "✅ Lesson Completed"
          : "✅ Mark as Complete"}
      </button>

    </div>
  );
}