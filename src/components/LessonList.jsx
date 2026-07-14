import { useState } from "react";

export default function LessonList({
  lessons,
  setCurrentVideo,
  setCurrentLesson,
  setShowPlayer,
}) {
  const [openDay, setOpenDay] = useState(0);

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-yellow-500">

      <h2 className="text-3xl font-bold text-yellow-400 mb-6">
        📚 My Course
      </h2>

      {lessons.map((dayData, dayIndex) => (

        <div
          key={dayIndex}
          className="mb-5 border border-zinc-700 rounded-xl overflow-hidden"
        >

          <button
            onClick={() =>
              setOpenDay(openDay === dayIndex ? -1 : dayIndex)
            }
            className="w-full flex justify-between items-center bg-black p-4 hover:bg-zinc-800 transition"
          >

            <span className="text-xl font-bold text-yellow-400">
              📁 Day {dayData.day}
            </span>

            <span className="text-2xl">
              {openDay === dayIndex ? "−" : "+"}
            </span>

          </button>

          {openDay === dayIndex && (

            <div className="p-4 space-y-3 bg-zinc-900">

              {dayData.lessons.map((lesson, lessonIndex) => (

                <div
                  key={lesson.id}
                  className="bg-black border border-zinc-700 rounded-lg p-4"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h3 className="font-bold text-white">
                        🎥 {lesson.title}
                      </h3>

                    </div>

                    <button
                      onClick={() => {
  console.log("Lesson:", lesson);
  console.log("Video:", lesson.video);

  setCurrentVideo(lesson.video);
  setCurrentLesson(lesson.id);
  setShowPlayer(true);
}}
                      className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-300"
                    >
                      Watch
                    </button>

                  </div>

                  {lesson.pdf && (

                    <div className="mt-4 flex gap-3">

                      <a
                        href={lesson.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        👁 View PDF
                      </a>

                      <a
                        href={lesson.pdf}
                        download
                        className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        ⬇ Download
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
  );
}