export default function LessonList({
  lessons,
  currentLesson,
  setCurrentLesson,
  setCurrentVideo,
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-yellow-500">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6">
        Course Content
      </h2>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentLesson(index);
              setCurrentVideo(lesson.video);
            }}
            className={`w-full text-left p-4 rounded-lg transition ${
              currentLesson === index
                ? "bg-yellow-400 text-black font-bold"
                : "bg-black hover:bg-yellow-400 hover:text-black"
            }`}
          >
            ▶ {lesson.title}
          </button>
        ))}
      </div>
    </div>
  );
}