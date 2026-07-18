import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ProgressBar from "../components/ProgressBar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopbar from "../components/dashboard/DashboardTopbar";
import ProfileSection from "../components/dashboard/ProfileSection";
import CertificateSection from "../components/dashboard/CertificateSection";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState(0);
  const [lastLesson, setLastLesson] = useState(0);
  const [active, setActive] = useState("dashboard");
const [sidebarOpen, setSidebarOpen] = useState(false);

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
              Math.round(
                (completed.length / totalLessons) * 100
              )
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
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-black text-white flex lg:flex-row">

      <DashboardSidebar
  active={active}
  setActive={setActive}
  handleLogout={handleLogout}
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
/>

<div className="flex-1">

  <DashboardTopbar
  user={user}
  setSidebarOpen={setSidebarOpen}
/>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

      

        {active === "profile" ? (

  <ProfileSection user={user} />

) : active === "certificates" ? (

  <CertificateSection progress={progress} />

) : (

  <>
  


        {hasPurchased ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

        
                      {/* My Courses */}
            <div
              onClick={() => navigate("/courses")}
              className="bg-zinc-900 p-6 rounded-xl border border-yellow-500 cursor-pointer hover:scale-105 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-yellow-400">
                📚 My Courses
              </h3>
            

              <p className="text-gray-300 mt-3">
                View all your purchased courses.
              </p>
            
              </div>
            

          

            {/* Continue Learning */}
            <div
              onClick={() => navigate("/courses")}
              className="bg-zinc-900 p-6 rounded-xl border border-green-500 cursor-pointer hover:scale-105 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-green-400">
                ▶ Continue Learning
              </h3>

              <p className="text-gray-300 mt-3">
                Last Lesson: Module {lastLesson + 1}
              </p>

<p className="text-yellow-400 font-bold mt-2 mb-3">
  Progress: {progress}%
</p>

<ProgressBar progress={progress} />
            </div>

            {/* Course Videos */}
            <div
              onClick={() => navigate("/courses")}
              className="bg-zinc-900 p-6 rounded-xl border border-yellow-500 cursor-pointer hover:scale-105 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-yellow-400">
                🎥 Course Videos
              </h3>

              <p className="text-gray-300 mt-3">
                Watch your premium lessons.
              </p>
            </div>

            {/* PDF Notes */}
            <div
              onClick={() => navigate("/courses")}
              className="bg-zinc-900 p-6 rounded-xl border border-yellow-500 cursor-pointer hover:scale-105 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-yellow-400">
                📄 PDF Notes
              </h3>

              <p className="text-gray-300 mt-3">
                Download premium study notes.
              </p>
            </div>

          </div>

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
  💳 Buy Course
</button>

          </div>

                )}

      </>

    )}

  </div>

    </div>

  </div>

);
}