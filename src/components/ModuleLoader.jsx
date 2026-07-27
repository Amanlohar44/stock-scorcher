import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function ModuleLoader({
  setLessons,
  setCurrentVideo,
  setCurrentLesson,
}) {
  useEffect(() => {
    const loadModules = async () => {
      try {
        const snapshot = await getDocs(collection(db, "modules"));

        const modules = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by createdAt timestamp
        modules.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return aTime - bTime;
        });

        // Format each document as a Day
        const finalData = modules.map((item, index) => ({
          day: index + 1,
          lessons: [item],
        }));

        setLessons(finalData);

        // Do not auto-select any video on initial load
        setCurrentLesson(null);
        setCurrentVideo("");
      } catch (err) {
        console.error("Error loading course modules:", err);
      }
    };

    loadModules();
  }, [setLessons, setCurrentLesson, setCurrentVideo]);

  return null;
}