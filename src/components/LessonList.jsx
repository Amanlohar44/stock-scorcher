export default function LessonList({
  lessons,
  currentLesson,
  setCurrentLesson,
  setCurrentVideo,
  completedLessons,
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-yellow-500">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6">
        📚 Course Content
      </h2>

      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const unlocked =
            index === 0 || completedLessons.includes(index - 1);

          const completed = completedLessons.includes(index);

          return (
            <button
              key={lesson.id || index}
              disabled={!unlocked}
              onClick={() => {
                if (!unlocked) return;

                setCurrentLesson(index);
                setCurrentVideo(lesson.video);
              }}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition ${
                currentLesson === index
                  ? "bg-yellow-400 text-black font-bold"
                  : unlocked
                  ? "bg-black hover:bg-yellow-400 hover:text-black"
                  : "bg-zinc-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>
                {unlocked ? "▶" : "🔒"} {lesson.title}
              </span>

              {completed && (
                <span className="text-green-500 font-bold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}