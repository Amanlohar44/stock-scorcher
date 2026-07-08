export default function CoursePlayer({
  currentVideo,
  currentLesson,
  completedLessons,
  onComplete,
  onNext,
  onPrevious,
  totalLessons,
}) {
  const isCompleted = completedLessons.includes(currentLesson);

  const progress =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  return (
    <div className="space-y-6">

      {/* Video Player */}
      <div className="rounded-2xl overflow-hidden border-2 border-yellow-500 shadow-xl">

        <div className="bg-zinc-900 px-5 py-3 flex justify-between items-center">
          <h2 className="text-yellow-400 font-bold text-lg">
            📚 Lesson {currentLesson + 1} / {totalLessons}
          </h2>

          <span className="text-green-400 font-bold">
            {progress}% Completed
          </span>
        </div>

        <div className="aspect-video">
          <iframe
            src={currentVideo}
            title="Course Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

      </div>

      {/* Complete Button */}
      <button
        disabled={isCompleted}
        onClick={onComplete}
        className={`w-full py-4 rounded-xl text-lg font-bold transition ${
          isCompleted
            ? "bg-green-600 text-white cursor-not-allowed"
            : "bg-yellow-400 text-black hover:bg-yellow-300"
        }`}
      >
        {isCompleted
          ? "✅ Lesson Completed"
          : "✅ Mark as Completed"}
      </button>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4">

        <button
          onClick={onPrevious}
          disabled={currentLesson === 0}
          className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold"
        >
          ⬅ Previous Lesson
        </button>

        <button
          onClick={onNext}
          disabled={
            currentLesson === totalLessons - 1 || !isCompleted
          }
          className="bg-yellow-400 text-black hover:bg-yellow-300 disabled:bg-zinc-700 disabled:text-gray-400 disabled:cursor-not-allowed py-4 rounded-xl font-bold"
        >
          {isCompleted
            ? "Next Lesson ➡"
            : "Complete Lesson First"}
        </button>

      </div>

      {/* Completion Card */}
      {progress === 100 && (
        <div className="bg-green-900 border border-green-500 rounded-xl p-6 text-center">

          <h2 className="text-3xl font-bold text-green-400">
            🎉 Congratulations!
          </h2>

          <p className="text-gray-300 mt-3">
            You have successfully completed this course.
          </p>

        </div>
      )}

    </div>
  );
}