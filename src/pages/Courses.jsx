import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import ModuleLoader from "../components/ModuleLoader";
import LessonList from "../components/LessonList";
import CoursePlayer from "../components/CoursePlayer";
import ProgressBar from "../components/ProgressBar";
import CertificateButton from "../components/CertificateButton";

export default function Courses() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // Day Wise Data
  const [days, setDays] = useState([]);

  // Current Selected Lesson
  const [currentLesson, setCurrentLesson] = useState(null);

  // Current Video URL
  const [currentVideo, setCurrentVideo] = useState("");

  // Show Player
  const [showPlayer, setShowPlayer] = useState(false);

  // Progress
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const purchaseRef = doc(db, "purchases", user.uid);
        const purchaseSnap = await getDoc(purchaseRef);

        if (!purchaseSnap.exists()) {
          alert("Please purchase course first");
          navigate("/dashboard");
          return;
        }

        const progressRef = doc(db, "progress", user.uid);
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
          const data = progressSnap.data();

          setCompletedLessons(
            data.completedLessons || []
          );

          setCurrentLesson(
            data.currentLesson ?? null
          );

        } else {

          await setDoc(progressRef, {
            completedLessons: [],
            currentLesson: null,
          });

        }

        setLoading(false);

      } catch (err) {
        console.log(err);
        navigate("/dashboard");
      }

    });

    return () => unsubscribe();

  }, [navigate]);

  const saveProgress = async (lessonId) => {

    const user = auth.currentUser;

    if (!user) return;

    let updated = [...completedLessons];

    if (!updated.includes(lessonId)) {
      updated.push(lessonId);
      setCompletedLessons(updated);
    }

    await updateDoc(
      doc(db, "progress", user.uid),
      {
        currentLesson: lessonId,
        completedLessons: updated,
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
        Loading...
      </div>
    );
  }
  return (
  <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

    <ModuleLoader
      setLessons={setDays}
      setCurrentVideo={setCurrentVideo}
      setCurrentLesson={setCurrentLesson}
    />

<div className="mb-6">
  <button
    onClick={() => navigate("/dashboard")}
    className="flex items-center gap-2 bg-zinc-800 hover:bg-yellow-400 hover:text-black transition px-5 py-3 rounded-xl font-semibold"
  >
    ← Back to Dashboard
  </button>
</div>

    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-8 text-center lg:text-left">
      📚 Stock Market Mastery
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* LEFT SIDE */}
      <div>

        <ProgressBar
          completedLessons={completedLessons}
          totalLessons={
            days.reduce(
              (total, day) => total + day.lessons.length,
              0
            )
          }
        />

        {showPlayer ? (
          <>
            <button
              onClick={() => {
                setShowPlayer(false);
                setCurrentVideo("");
                setCurrentLesson(null);
              }}
              className="mb-4 px-4 py-2 text-sm sm:text-base bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold"
            >
              ← Back to Course
            </button>

            <CoursePlayer
              currentVideo={currentVideo}
              currentLesson={currentLesson}
              completedLessons={completedLessons}
              onComplete={() => saveProgress(currentLesson)}
            />
          </>
        ) : (
          <div className="border-2 border-yellow-500 rounded-2xl h-[220px] sm:h-[300px] lg:h-[500px] flex items-center justify-center text-lg sm:text-2xl lg:text-3xl text-gray-400 text-center px-4">
            📚 Select any lesson from Day List
          </div>
        )}

      </div>

      {/* RIGHT SIDE */}
      <div>

        <LessonList
          lessons={days}
          setCurrentVideo={(video) => {
            setCurrentVideo(video);
          }}
          setCurrentLesson={(lessonId) => {
            setCurrentLesson(lessonId);
          }}
          setShowPlayer={setShowPlayer}
        />

        {days.length > 0 &&
          completedLessons.length ===
            days.reduce(
              (total, day) => total + day.lessons.length,
              0
            ) && (
            <div className="mt-4">
              <CertificateButton />
            </div>
          )}

      </div>

    </div>

  </div>
);
}