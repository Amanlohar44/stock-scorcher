export default function CoursePlayer({
  currentVideo,
  currentLesson,
  completedLessons,
  onComplete,
}) {
  const isCompleted = completedLessons.includes(currentLesson);

  return (
    <div className="space-y-6">

      {/* Video */}

      <div className="rounded-2xl overflow-hidden border-2 border-yellow-500">

        <div className="bg-zinc-900 p-4">

          <h2 className="text-yellow-400 text-xl font-bold">
            ▶ Watch Lesson
          </h2>
          

        </div>

        

        {currentVideo ? (

          <div className="aspect-video">

            <iframe
              src={currentVideo}
              title="Course Video"
              className="w-full h-full"
              allowFullScreen
            />

          </div>

        ) : (

          <div className="aspect-video flex items-center justify-center bg-black">

            <p className="text-2xl text-gray-400">
              Select any lesson from Day List
            </p>

          </div>

        )}

      </div>

      <button
        disabled={isCompleted}
        onClick={onComplete}
        className={`w-full py-4 rounded-xl font-bold text-lg ${
          isCompleted
            ? "bg-green-600 cursor-not-allowed"
            : "bg-yellow-400 text-black hover:bg-yellow-300"
        }`}
      >
        {isCompleted
          ? "✅ Lesson Completed"
          : "✅ Mark Complete"}
      </button>

    </div>
  );
  
}