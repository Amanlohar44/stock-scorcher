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

        const moduleList = [];

        snapshot.forEach((doc) => {
          moduleList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        moduleList.sort((a, b) => a.title.localeCompare(b.title));

        setLessons(moduleList);

        if (moduleList.length > 0) {
          setCurrentLesson(0);
          setCurrentVideo(moduleList[0].video);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadModules();
  }, []);

  return null;
}