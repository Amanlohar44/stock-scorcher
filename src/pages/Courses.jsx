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

export default function Courses() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const lessons = [
    {
      title: "Module 1 - Introduction",
      video:
        "https://drive.google.com/file/d/1vsIznJKZ3KoXmWopUdB2dTC0ysUkWWOI/preview",
    },
    {
      title: "Module 2 - Candlestick Patterns",
      video:
        "https://drive.google.com/file/d/1vsIznJKZ3KoXmWopUdB2dTC0ysUkWWOI/preview",
    },
    {
      title: "Module 3 - Support & Resistance",
      video:
        "https://drive.google.com/file/d/1vsIznJKZ3KoXmWopUdB2dTC0ysUkWWOI/preview",
    },
    {
      title: "Module 4 - Risk Management",
      video:
        "https://drive.google.com/file/d/1vsIznJKZ3KoXmWopUdB2dTC0ysUkWWOI/preview",
    },
    {
      title: "Module 5 - Trading Psychology",
      video:
        "https://drive.google.com/file/d/1vsIznJKZ3KoXmWopUdB2dTC0ysUkWWOI/preview",
    },
  ];

  const [currentVideo, setCurrentVideo] = useState(lessons[0].video);

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
  setCurrentVideo(lessons[lessonIndex].video);
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

 <a
  href={`/pdf/module${currentLesson + 1}.pdf`}
  target="_blank"
  rel="noreferrer"
  className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-xl font-bold flex justify-center"
>
  📄 Download PDF Notes
</a>
</div>
      </div>
    </div>
  );
}