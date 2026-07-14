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

        let modules = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // createdAt ke hisaab se sort
        modules.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return aTime - bTime;
        });

        // Har document = ek Day
        const finalData = modules.map((item, index) => ({
          day: index + 1,
          lessons: [item],
        }));

        setLessons(finalData);

        // Page load par koi video auto-select nahi hoga
setCurrentLesson(null);
setCurrentVideo("");
      } catch (err) {
        console.log(err);
      }
    };

    loadModules();
  }, [setLessons, setCurrentLesson, setCurrentVideo]);

  return null;
}