import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopbar from "../components/dashboard/DashboardTopbar";
import ProfileSection from "../components/dashboard/ProfileSection";
import CertificateSection from "../components/dashboard/CertificateSection";
import LiveClassesSection from "../components/dashboard/LiveClassesSection";
import DashboardCards from "../components/dashboard/DashboardCards";
import DashboardStats from "../components/dashboard/DashboardStats";
import CoursePlayer from "../components/CoursePlayer";
import LessonNotes from "../components/dashboard/LessonNotes";
import AllNotesSection from "../components/dashboard/AllNotesSection";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [userTier, setUserTier] = useState(0); 
  const [hasMembership, setHasMembership] = useState(false);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState(0);
  const [lastLesson, setLastLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [modulesList, setModulesList] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); 
  const [selectedVideoDay, setSelectedVideoDay] = useState(null); 
  const [currentVideo, setCurrentVideo] = useState(null); 
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        // 1. Check Purchase Status & Tier
        const purchaseRef = doc(db, "purchases", currentUser.uid);
        const purchaseSnap = await getDoc(purchaseRef);

        let fetchedCompleted = [];
        if (purchaseSnap.exists()) {
          setHasPurchased(true);
          const purchaseData = purchaseSnap.data();
          
          const tier = purchaseData.course || purchaseData.amount || purchaseData.planAmount || purchaseData.tier || 9999;
          setUserTier(tier);

          const progressRef = doc(db, "progress", currentUser.uid);
          const progressSnap = await getDoc(progressRef);

          if (progressSnap.exists()) {
            const data = progressSnap.data();
            const savedLesson = data.currentLesson || 0;
            setLastLesson(savedLesson);
            fetchedCompleted = data.completedLessons || [];
            setCompletedLessons(fetchedCompleted);
          }
        } else {
          setHasPurchased(false);
          setUserTier(0);
        }

        // 2. Check VIP Membership Status
        const membershipRef = doc(db, "memberships", currentUser.uid);
        const membershipSnap = await getDoc(membershipRef);
        if (membershipSnap.exists() && membershipSnap.data().status === "active") {
          setHasMembership(true);
        }

        // 3. Fetch Admin Uploaded Modules
        try {
          const modulesSnapshot = await getDocs(collection(db, "modules"));
          let fetchedModules = modulesSnapshot.docs.map((docItem, index) => ({
            id: index,
            firebaseId: docItem.id,
            ...docItem.data(),
          }));

          fetchedModules.sort((a, b) => {
            const titleA = a.title || a.name || "";
            const titleB = b.title || b.name || "";
            return titleA.localeCompare(titleB, undefined, { numeric: true, sensitivity: 'base' });
          });

          fetchedModules = fetchedModules.map((mod, idx) => ({
            ...mod,
            id: idx,
          }));

          if (fetchedModules.length > 0) {
            setModulesList(fetchedModules);
            setProgress(Math.round((fetchedCompleted.length / fetchedModules.length) * 100) || 0);
          } else {
            setModulesList([
              { id: 0, title: "No Modules Uploaded Yet", videos: [], pdfs: [] }
            ]);
          }
        } catch (err) {
          console.error("Error fetching modules:", err);
        }

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCompleteLesson = async () => {
    if (!user || modulesList.length === 0) return;
    try {
      let updatedCompleted = [...completedLessons];
      if (!updatedCompleted.includes(currentLessonIndex)) {
        updatedCompleted.push(currentLessonIndex);
      }
      
      const nextLesson = Math.min(currentLessonIndex + 1, modulesList.length - 1);

      setCompletedLessons(updatedCompleted);
      setLastLesson(nextLesson);
      
      const newProgress = Math.round((updatedCompleted.length / modulesList.length) * 100);
      setProgress(newProgress);

      const progressRef = doc(db, "progress", user.uid);
      await setDoc(progressRef, {
        currentLesson: nextLesson,
        completedLessons: updatedCompleted,
        updatedAt: new Date()
      }, { merge: true });

    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-yellow-400 text-xl font-bold tracking-wider">
        Loading Dashboard...
      </div>
    );
  }

  const getDayVideos = (day) => {
    if (!day) return [];
    if (Array.isArray(day.videos) && day.videos.length > 0) return day.videos;
    const singleUrl = day.videoUrl || day.video || day.url;
    if (singleUrl) return [{ title: day.title || "Class Video", url: singleUrl }];
    return [];
  };

  const getDayPdfs = (day) => {
    if (!day) return [];
    if (Array.isArray(day.pdfs) && day.pdfs.length > 0) return day.pdfs;
    if (Array.isArray(day.notes) && day.notes.length > 0) return day.notes;
    const singlePdf = day.pdfUrl || day.pdf || day.notesUrl;
    if (singlePdf) return [{ title: "Study Notes PDF", url: singlePdf }];
    return [];
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-between selection:bg-yellow-400 selection:text-black">
      
      <Navbar />

      <div className="flex flex-1 pt-20 lg:flex-row">

        <DashboardSidebar
          active={active}
          setActive={(val) => {
            setActive(val);
            setSelectedDay(null);
            setSelectedVideoDay(null);
            setCurrentVideo(null);
          }}
          handleLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col min-w-0">

          <DashboardTopbar
            user={user}
            setSidebarOpen={setSidebarOpen}
            setActive={setActive}
          />

          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
            {active === "profile" ? (
              <ProfileSection 
                user={user} 
                progress={progress} 
                completedLessons={completedLessons} 
                modulesList={modulesList} 
              />
            ) : active === "certificates" ? (
              <CertificateSection progress={progress} />
            ) : active === "notes" ? (
              <AllNotesSection />
            ) : active === "live" ? (
              userTier >= 9999 ? (
                <LiveClassesSection />
              ) : (
                <div className="bg-[#060606] border border-yellow-500/35 rounded-3xl p-10 text-center max-w-xl mx-auto space-y-4 shadow-xl">
                  <div className="text-4xl">🔒</div>
                  <h2 className="text-2xl font-black text-yellow-400">Pro Mentorship Locked</h2>
                  <p className="text-zinc-400 text-xs">
                    Live classes and direct mentorship are available only with the <strong className="text-white">₹9999 Pro Mentorship</strong> plan. Please upgrade your plan to join live sessions.
                  </p>
                  <button
                    onClick={() => navigate("/courses")}
                    className="bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer"
                  >
                    Upgrade to ₹9999 Plan
                  </button>
                </div>
              )
            ) : (
              <div className="space-y-8">
                {hasPurchased ? (
                  <>
                    {active === "courses" && selectedDay === null && currentVideo === null && (
                      <div className="space-y-6">
                        <div className="bg-[#060606] border border-yellow-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-black text-yellow-400">📚 My Enrolled Course</h2>
                            <p className="text-zinc-400 text-sm font-light mt-1">
                              {userTier <= 999 
                                ? "You have access to PDF Notes & Cheat Sheets." 
                                : "Select any day below to open video classes and PDF notes."}
                            </p>
                          </div>
                          <button
                            onClick={() => setActive("dashboard")}
                            className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-300 transition-all cursor-pointer"
                          >
                            ← Dashboard
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {modulesList.map((mod, idx) => (
                            <div
                              key={mod.firebaseId || idx}
                              onClick={() => {
                                if (userTier >= 999) setSelectedDay(mod);
                              }}
                              className="group bg-[#060606] border border-yellow-500/20 hover:border-yellow-400 p-6 rounded-3xl cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-extrabold uppercase tracking-wider">
                                    Day {idx + 1}
                                  </span>
                                  {completedLessons.includes(idx) && (
                                    <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2.5 py-1 rounded-full">
                                      Completed ✓
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                                  {mod.title || mod.name || `Day ${idx + 1} Masterclass`}
                                </h3>
                                <p className="text-zinc-400 text-xs mt-2 line-clamp-2 font-light">
                                  {mod.description || "Click to view lectures and notes."}
                                </p>
                              </div>

                              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-yellow-400 font-bold">
                                <span>View Content →</span>
                                <span>
                                  {userTier >= 6999 ? `🎥 ${getDayVideos(mod).length} | ` : ""} 📄 {getDayPdfs(mod).length}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {active === "courses" && selectedDay !== null && currentVideo === null && (
                      <div className="space-y-8">
                        <div className="bg-[#060606] border border-yellow-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
                          <div>
                            <button
                              onClick={() => setSelectedDay(null)}
                              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20 mb-3 inline-block transition-all cursor-pointer"
                            >
                              ← Back to All Days
                            </button>
                            <h2 className="text-2xl font-black text-yellow-400">
                              {selectedDay.title || selectedDay.name || "Day Details"}
                            </h2>
                            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-light">
                              Access your course content below based on your active plan.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-extrabold text-yellow-400 flex items-center gap-2">
                            🎥 Video Classes ({userTier >= 6999 ? getDayVideos(selectedDay).length : "Locked"})
                          </h3>
                          {userTier >= 6999 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {getDayVideos(selectedDay).length > 0 ? (
                                getDayVideos(selectedDay).map((vid, vIdx) => (
                                  <div key={vIdx} className="bg-[#060606] border border-yellow-500/20 p-5 rounded-2xl flex items-center justify-between shadow-lg">
                                    <div className="pr-3">
                                      <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Video #{vIdx + 1}</span>
                                      <h4 className="text-sm font-bold text-white mt-0.5">{vid.title || `Class Video ${vIdx + 1}`}</h4>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setCurrentVideo(vid.url || vid);
                                        setCurrentVideoTitle(vid.title || `Video ${vIdx + 1}`);
                                        setCurrentLessonIndex(selectedDay.id || 0);
                                      }}
                                      className="bg-yellow-400 text-black px-4 py-2.5 rounded-xl font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer shrink-0"
                                    >
                                      ▶ Watch
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-zinc-500 text-xs italic">No videos uploaded for this day yet.</p>
                              )}
                            </div>
                          ) : (
                            <div className="bg-zinc-900 border border-yellow-500/20 p-6 rounded-2xl flex items-center justify-between">
                              <p className="text-zinc-400 text-xs">Video classes require the <strong className="text-yellow-400">₹6999 Masterclass</strong> or <strong className="text-yellow-400">₹9999 Mentorship</strong> plan.</p>
                              <button onClick={() => navigate("/courses")} className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-xs font-bold">Upgrade</button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 pt-4">
                          <h3 className="text-xl font-extrabold text-green-400 flex items-center gap-2">
                            📄 PDF Study Notes ({getDayPdfs(selectedDay).length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getDayPdfs(selectedDay).length > 0 ? (
                              getDayPdfs(selectedDay).map((pdfItem, pIdx) => (
                                <div key={pIdx} className="bg-[#060606] border border-green-500/20 p-5 rounded-2xl flex items-center justify-between shadow-lg">
                                  <div className="pr-3">
                                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">PDF Note #{pIdx + 1}</span>
                                    <h4 className="text-sm font-bold text-white mt-0.5">{pdfItem.title || `Study Material ${pIdx + 1}`}</h4>
                                  </div>
                                  <a
                                    href={pdfItem.url || pdfItem}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 text-black px-4 py-2.5 rounded-xl font-extrabold text-xs hover:bg-green-400 transition-all cursor-pointer block text-center shrink-0"
                                  >
                                    📥 Download
                                  </a>
                                </div>
                              ))
                            ) : (
                              <p className="text-zinc-500 text-xs italic">No PDF notes uploaded for this day yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {active === "courses" && currentVideo !== null && (
                      <div className="space-y-6">
                        <button
                          onClick={() => setCurrentVideo(null)}
                          className="text-xs font-bold text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 px-4 py-2 rounded-xl border border-yellow-400/20 transition-all cursor-pointer inline-block"
                        >
                          ← Back to Day Content
                        </button>

                        <div className="bg-[#060606] border border-yellow-500/20 px-6 py-4 rounded-2xl">
                          <h3 className="text-lg font-bold text-yellow-400">Playing: {currentVideoTitle}</h3>
                        </div>

                        <CoursePlayer
                          currentVideo={currentVideo}
                          currentLesson={currentLessonIndex}
                          completedLessons={completedLessons}
                          onComplete={handleCompleteLesson}
                        />

                        {/* Lesson Notes Section */}
                        <div className="mt-6">
                          <LessonNotes lessonId={currentLessonIndex} />
                        </div>
                      </div>
                    )}

                    {active === "videos" && selectedVideoDay === null && currentVideo === null && (
                      <div className="space-y-6">
                        <div className="bg-[#060606] border border-yellow-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-black text-yellow-400">🎥 Course Videos (Day Wise)</h2>
                            <p className="text-zinc-400 text-sm font-light mt-1">
                              {userTier >= 6999 ? "Select any day below to watch video lectures." : "Upgrade required to access videos."}
                            </p>
                          </div>
                          <button
                            onClick={() => setActive("dashboard")}
                            className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-300 transition-all cursor-pointer"
                          >
                            ← Dashboard
                          </button>
                        </div>

                        {userTier >= 6999 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modulesList.map((mod, idx) => {
                              const vids = getDayVideos(mod);
                              return (
                                <div
                                  key={mod.firebaseId || idx}
                                  onClick={() => {
                                    if (vids.length > 0) setSelectedVideoDay(mod);
                                  }}
                                  className="group bg-[#060606] border border-yellow-500/25 hover:border-yellow-400 p-6 rounded-3xl cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-4">
                                      <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-extrabold uppercase tracking-wider">
                                        Day {idx + 1}
                                      </span>
                                      <span className="text-yellow-400 font-bold text-xs">🎥 {vids.length} Videos</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                                      {mod.title || mod.name || `Day ${idx + 1} Videos`}
                                    </h3>
                                  </div>
                                  <div className="mt-6 pt-4 border-t border-white/10 text-xs text-yellow-400 font-bold">
                                    View Videos List →
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-[#060606] border border-yellow-500/30 rounded-3xl p-12 text-center space-y-4">
                            <div className="text-3xl">🔒</div>
                            <h3 className="text-xl font-bold text-white">Course Videos Locked</h3>
                            <p className="text-zinc-400 text-xs">Your current plan includes PDF Notes. Upgrade to ₹6999 Masterclass to unlock all video lectures.</p>
                            <button onClick={() => navigate("/courses")} className="bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-bold text-xs">Upgrade Plan</button>
                          </div>
                        )}
                      </div>
                    )}

                    {active === "videos" && selectedVideoDay !== null && currentVideo === null && (
                      <div className="space-y-6">
                        <div className="bg-[#060606] border border-yellow-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
                          <div>
                            <button
                              onClick={() => setSelectedVideoDay(null)}
                              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20 mb-3 inline-block transition-all cursor-pointer"
                            >
                              ← Back to All Days Videos
                            </button>
                            <h2 className="text-2xl font-black text-yellow-400">
                              {selectedVideoDay.title || selectedVideoDay.name || "Day Videos"}
                            </h2>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getDayVideos(selectedVideoDay).length > 0 ? (
                            getDayVideos(selectedVideoDay).map((vid, vIdx) => (
                              <div key={vIdx} className="bg-[#060606] border border-yellow-500/20 p-5 rounded-2xl flex items-center justify-between shadow-lg">
                                <div className="pr-3">
                                  <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Video #{vIdx + 1}</span>
                                  <h4 className="text-sm font-bold text-white mt-0.5">{vid.title || `Class Video ${vIdx + 1}`}</h4>
                                </div>
                                <button
                                  onClick={() => {
                                    setCurrentVideo(vid.url || vid);
                                    setCurrentVideoTitle(vid.title || `Video ${vIdx + 1}`);
                                    setCurrentLessonIndex(selectedVideoDay.id || 0);
                                  }}
                                  className="bg-yellow-400 text-black px-4 py-2.5 rounded-xl font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer shrink-0"
                                >
                                  ▶ Watch
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-zinc-500 text-xs italic">No videos uploaded for this day yet.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {active === "videos" && currentVideo !== null && (
                      <div className="space-y-6">
                        <button
                          onClick={() => setCurrentVideo(null)}
                          className="text-xs font-bold text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 px-4 py-2 rounded-xl border border-yellow-400/20 transition-all cursor-pointer inline-block"
                        >
                          ← Back to Videos List
                        </button>

                        <div className="bg-[#060606] border border-yellow-500/20 px-6 py-4 rounded-2xl">
                          <h3 className="text-lg font-bold text-yellow-400">Playing: {currentVideoTitle}</h3>
                        </div>

                        <CoursePlayer
                          currentVideo={currentVideo}
                          currentLesson={currentLessonIndex}
                          completedLessons={completedLessons}
                          onComplete={handleCompleteLesson}
                        />

                        {/* Lesson Notes Section */}
                        <div className="mt-6">
                          <LessonNotes lessonId={currentLessonIndex} />
                        </div>
                      </div>
                    )}

                    {active === "pdf" && (
                      <div className="space-y-6">
                        <div className="bg-[#060606] border border-yellow-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-black text-yellow-400">📄 PDF Study Notes (Day Wise)</h2>
                            <p className="text-zinc-400 text-sm font-light mt-1">
                              Browse all downloadable lecture notes and cheat sheets.
                            </p>
                          </div>
                          <button
                            onClick={() => setActive("dashboard")}
                            className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-300 transition-all cursor-pointer"
                          >
                            ← Dashboard
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {modulesList.map((mod, idx) => {
                            const pdfs = getDayPdfs(mod);
                            return (
                              <div
                                key={mod.firebaseId || idx}
                                className="bg-[#060606] border border-green-500/25 p-6 rounded-3xl shadow-xl flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-xs font-extrabold uppercase tracking-wider">
                                      Day {idx + 1}
                                    </span>
                                    <span className="text-green-400 font-bold text-xs">📄 {pdfs.length} PDFs</span>
                                  </div>
                                  <h3 className="text-lg font-bold text-white mb-3">
                                    {mod.title || mod.name || `Day ${idx + 1} Notes`}
                                  </h3>
                                </div>

                                <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                                  {pdfs.length > 0 ? (
                                    pdfs.map((pItem, pIdx) => (
                                      <a
                                        key={pIdx}
                                        href={pItem.url || pItem}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-green-500/10 border border-green-500/30 text-green-400 py-2.5 px-4 rounded-xl font-bold text-xs hover:bg-green-500 hover:text-black transition-all cursor-pointer flex items-center justify-between"
                                      >
                                        <span className="truncate pr-2">{pItem.title || `Download PDF ${pIdx + 1}`}</span>
                                        <span>📥</span>
                                      </a>
                                    ))
                                  ) : (
                                    <p className="text-zinc-500 text-xs italic">No PDF available</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {active === "dashboard" && (
                      <div className="space-y-8">
                        {/* Live Statistics Cards */}
                        <DashboardStats 
                          modulesList={modulesList} 
                          completedLessons={completedLessons} 
                          progress={progress} 
                        />

                        {/* Interactive Main Action Cards */}
                        <DashboardCards 
                          userTier={userTier} 
                          setActive={setActive} 
                          setSelectedDay={setSelectedDay} 
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-8 max-w-2xl mx-auto bg-[#060606] border border-red-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
                    <div className="h-16 w-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-2xl font-bold mb-6">
                      ❌
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      No Active Course Purchased
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base mt-3 font-light leading-relaxed">
                      Please enroll in a masterclass or membership plan to unlock your student dashboard features.
                    </p>
                    <button
                      onClick={() => navigate("/courses")}
                      className="mt-8 inline-files items-center gap-2 bg-yellow-400 text-black px-8 py-3.5 rounded-xl font-extrabold text-sm hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.25)] cursor-pointer"
                    >
                      💳 Explore & Buy Courses
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>

        </div>
      </div>

      <Footer />

    </div>
  );
}