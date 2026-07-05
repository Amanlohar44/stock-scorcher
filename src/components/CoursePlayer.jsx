export default function CoursePlayer({
  currentVideo,
  currentLesson,
  completedLessons,
  onComplete,
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
    </div>
  );
}