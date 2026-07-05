import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
const [lastLesson, setLastLesson] = useState(0);
const totalLessons = 5;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        const purchaseRef = doc(db, "purchases", currentUser.uid);
        const purchaseSnap = await getDoc(purchaseRef);

       if (purchaseSnap.exists()) {
  setHasPurchased(true);

  const progressRef = doc(db, "progress", currentUser.uid);
  const progressSnap = await getDoc(progressRef);

  if (progressSnap.exists()) {
    const data = progressSnap.data();

    setLastLesson(data.currentLesson || 0);

    const completed = data.completedLessons || [];

    setProgress(
      Math.round((completed.length / totalLessons) * 100)
    );
  }

} else {
  setHasPurchased(false);
}
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged Out Successfully 👋");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-yellow-500">
        <h1 className="text-3xl font-bold text-yellow-400">
          Stock Scorcher
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-5xl font-bold text-yellow-400">
          Welcome 👋
        </h2>

        <p className="text-gray-400 mt-2">{user?.email}</p>

        {hasPurchased ? (
          <>
            <div className="grid md:grid-cols-3 gap-6 mt-10">

              {/* My Courses */}
              <div
                onClick={() => navigate("/courses")}
                className="bg-zinc-900 p-6 rounded-xl border border-yellow-500 cursor-pointer hover:scale-105 transition duration-300"
              >
                <h3 className="text-2xl font-bold text-yellow-400">
                  📚 My Courses
                </h3>
                <div
  onClick={() => navigate("/courses")}
  className="bg-zinc-900 p-6 rounded-xl border border-green-500 cursor-pointer hover:scale-105 transition duration-300"
>
  <h3 className="text-2xl font-bold text-green-400">
    ▶ Continue Learning
  </h3>

  <p className="text-gray-300 mt-2">
    Last Lesson: Module {lastLesson + 1}
  </p>

  <p className="text-yellow-400 font-bold mt-3">
    Progress: {progress}%
  </p>
</div>

                <p className="text-gray-300 mt-2">
                  View all your purchased courses.
                </p>
              </div>

              {/* Videos */}
              <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-500">
                <h3 className="text-2xl font-bold text-yellow-400">
                  🎥 Course Videos
                </h3>

                <p className="text-gray-300 mt-2">
                  Watch your premium lessons.
                </p>
              </div>

              {/* PDF */}
              <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-500">
                <h3 className="text-2xl font-bold text-yellow-400">
                  📄 PDF Notes
                </h3>

                <p className="text-gray-300 mt-2">
                  Download premium study notes.
                </p>
              </div>

            </div>
          </>
        ) : (
          <div className="mt-10 bg-red-900 border border-red-500 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold">
              ❌ You have not purchased any course
            </h2>

            <p className="text-gray-300 mt-4">
              Please purchase a course to unlock your dashboard.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300"
            >
              Buy Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}