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

        const moduleList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Natural sorting (Module 1, Module 2, Module 10)
        moduleList.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        );

        setLessons(moduleList);

        if (moduleList.length > 0) {
          setCurrentLesson(0);
          setCurrentVideo(moduleList[0].video);
        }
      } catch (error) {
        console.error("Error loading modules:", error);
      }
    };

    loadModules();
  }, [setLessons, setCurrentVideo, setCurrentLesson]);

  return null;
}