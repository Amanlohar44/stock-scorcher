import { useState } from "react";

export default function LessonList({
  lessons = [],
  setCurrentVideo,
  setCurrentLesson,
  setShowPlayer,
}) {
  const [openDay, setOpenDay] = useState(0);

  if (!lessons || lessons.length === 0) {
    return (
      <div className="bg-zinc-950 rounded-3xl p-6 md:p-8 border border-yellow-500/20 text-center">
        <p className="text-zinc-400 text-xs sm:text-sm font-semibold">No lessons available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 rounded-3xl p-6 md:p-8 border border-yellow-500/30 shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 mb-6 tracking-tight flex items-center gap-3">
        <span>📚</span> My Course Curriculum
      </h2>

      <div className="space-y-4">
        {lessons.map((dayData, dayIndex) => (
          <div
            key={dayIndex}
            className="border border-yellow-500/20 rounded-2xl overflow-hidden bg-zinc-900/40 transition-all duration-300"
          >
            <button
              type="button"
              onClick={() =>
                setOpenDay(openDay === dayIndex ? -1 : dayIndex)
              }
              className="w-full flex justify-between items-center bg-zinc-900/90 p-4 sm:p-5 hover:bg-zinc-900 transition cursor-pointer"
            >
              <span className="text-base sm:text-lg font-black text-yellow-400 tracking-wide">
                📁 Day {dayData.day}
              </span>

              <span className="text-xl sm:text-2xl font-black text-yellow-400 bg-yellow-400/10 h-8 w-8 rounded-xl flex items-center justify-center border border-yellow-400/30">
                {openDay === dayIndex ? "−" : "+"}
              </span>
            </button>

            {openDay === dayIndex && (
              <div className="p-4 sm:p-5 space-y-4 bg-zinc-950/80 border-t border-white/5">
                {dayData.lessons?.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-zinc-900/80 border border-yellow-500/15 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-md transition hover:border-yellow-400/40"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
                          <span className="text-yellow-400">🎥</span> {lesson.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentVideo(lesson.video);
                          setCurrentLesson(lesson.id);
                          setShowPlayer(true);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-400/20 active:scale-95 cursor-pointer shrink-0"
                      >
                        Watch
                      </button>
                    </div>

                    {lesson.pdf && (
                      <div className="flex flex-wrap gap-3 pt-3 border-t border-white/5">
                        <a
                          href={lesson.pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>👁</span> View PDF Notes
                        </a>

                        <a
                          href={lesson.pdf}
                          download
                          className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>⬇</span> Download PDF
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}