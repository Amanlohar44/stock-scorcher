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

  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-yellow-500">
        <iframe
          width="100%"
          height="450"
          src={currentVideo}
          title="Course Video"
          allow="autoplay"
          allowFullScreen
        ></iframe>
      </div>

      <button
        disabled={isCompleted}
        onClick={onComplete}
        className={`mt-5 w-full py-3 rounded-xl font-bold transition ${
          isCompleted
            ? "bg-green-600 text-white cursor-not-allowed"
            : "bg-yellow-400 text-black hover:bg-yellow-300"
        }`}
      >
        {isCompleted ? "✅ Lesson Completed" : "✅ Mark as Completed"}
      </button>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <button
          onClick={onPrevious}
          disabled={currentLesson === 0}
          className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold"
        >
          ⬅ Previous Lesson
        </button>

        <button
          onClick={onNext}
          disabled={currentLesson === totalLessons - 1}
          className="bg-yellow-400 text-black hover:bg-yellow-300 disabled:bg-zinc-700 disabled:text-gray-400 disabled:cursor-not-allowed py-3 rounded-xl font-bold"
        >
          Next Lesson ➡
        </button>
      </div>
    </div>
  );
}