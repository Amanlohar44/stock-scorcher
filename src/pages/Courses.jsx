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
import CoursePlayer from "../components/CoursePlayer";
import LessonList from "../components/LessonList";
import ProgressBar from "../components/ProgressBar";
import ModuleLoader from "../components/ModuleLoader";
import CertificateButton from "../components/CertificateButton";

export default function Courses() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [lessons, setLessons] = useState([]);

const [currentVideo, setCurrentVideo] = useState("");



  const [completedLessons, setCompletedLessons] = useState([]);
const [currentLesson, setCurrentLesson] = useState(0);

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
          alert("Please purchase the course first.");
          navigate("/dashboard");
          return;
        }

        const progressRef = doc(db, "progress", user.uid);
const progressSnap = await getDoc(progressRef);

if (progressSnap.exists()) {
  const data = progressSnap.data();

  setCompletedLessons(data.completedLessons || []);

  const lessonIndex = data.currentLesson || 0;

  setCurrentLesson(lessonIndex);
  if (lessons.length > lessonIndex) {
  setCurrentVideo(lessons[lessonIndex].video);
}
} else {
  await setDoc(progressRef, {
    completedLessons: [],
    currentLesson: 0,
  });
}

        setLoading(false);
      } catch (error) {
        console.log(error);
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

const saveProgress = async (lessonIndex) => {
  const user = auth.currentUser;

  if (!user) return;

  let updatedLessons = [...completedLessons];

  if (!updatedLessons.includes(lessonIndex)) {
    updatedLessons.push(lessonIndex);
    setCompletedLessons(updatedLessons);
  }

  await updateDoc(doc(db, "progress", user.uid), {
    currentLesson: lessonIndex,
    completedLessons: updatedLessons,
  });
};

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">

      <ModuleLoader
  setLessons={setLessons}
  setCurrentVideo={setCurrentVideo}
  setCurrentLesson={setCurrentLesson}
/>

      <h1 className="text-5xl font-bold text-yellow-400 mb-10">
        📚 Stock Market Mastery
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* Video Player */}
        <div>
  <ProgressBar
    completedLessons={completedLessons}
    totalLessons={lessons.length}
  />

 <CoursePlayer
  currentVideo={currentVideo}
  currentLesson={currentLesson}
  completedLessons={completedLessons}
  totalLessons={lessons.length}
  onPrevious={() => {
    if (currentLesson > 0) {
      const prev = currentLesson - 1;
      setCurrentLesson(prev);
      setCurrentVideo(lessons[prev].video);
      saveProgress(prev);
    }
  }}
  onNext={() => {
    if (currentLesson < lessons.length - 1) {
      const next = currentLesson + 1;
      setCurrentLesson(next);
      setCurrentVideo(lessons[next].video);
      saveProgress(next);
    }
  }}
  onComplete={async () => {
    if (completedLessons.includes(currentLesson)) return;

    const updatedLessons = [...completedLessons, currentLesson];

    setCompletedLessons(updatedLessons);

    const user = auth.currentUser;

    await updateDoc(doc(db, "progress", user.uid), {
      completedLessons: updatedLessons,
      currentLesson: currentLesson,
    });
  }}
/>
</div>

       {/* Lesson List */}
<div>

  <LessonList
    lessons={lessons}
    currentLesson={currentLesson}
    completedLessons={completedLessons}
    setCurrentLesson={(index) => {
      setCurrentLesson(index);
      saveProgress(index);
    }}
    setCurrentVideo={setCurrentVideo}
  />

  {lessons[currentLesson]?.pdf && (
  <a
    href={lessons[currentLesson].pdf}
    target="_blank"
    rel="noreferrer"
    className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-xl font-bold flex justify-center hover:bg-yellow-300 transition"
  >
    📄 Download PDF Notes
  </a>
)}
{lessons.length > 0 &&
 completedLessons.length === lessons.length && (
  <div className="mt-4">
    <CertificateButton />
  </div>
)}
</div>
      </div>
    </div>
  );
}