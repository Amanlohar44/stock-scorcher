import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [pdf, setPdf] = useState("");
  const [modules, setModules] = useState([]);
const loadModules = async () => {
  const snapshot = await getDocs(collection(db, "modules"));

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setModules(data);
};

useEffect(() => {
  loadModules();
}, []);

  const handleAddModule = async () => {
    if (!title || !video) {
      alert("Please fill Module Title and Video Link");
      return;
    }

    try {
      await addDoc(collection(db, "modules"), {
        title,
        video,
        pdf,
        createdAt: new Date(),
      });

      loadModules();

      alert("✅ Module Added Successfully");

      setTitle("");
      setVideo("");
      setPdf("");
    } catch (error) {
      console.log(error);
      alert("❌ Error adding module");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-10 w-full max-w-3xl">

        <h1 className="text-4xl font-bold text-yellow-400 mb-8">
          Admin Panel
        </h1>

        <div className="space-y-6">

          <input
            type="text"
            placeholder="Module Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-lg p-4"
          />

          <input
            type="text"
            placeholder="Google Drive Video Link"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-lg p-4"
          />

          <input
            type="text"
            placeholder="PDF Link"
            value={pdf}
            onChange={(e) => setPdf(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-lg p-4"
          />

          <button
            onClick={handleAddModule}
            className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300"
          >
            ➕ Add Module
            <hr className="border-zinc-700 my-8" />

<h2 className="text-2xl font-bold text-yellow-400 mb-5">
  All Modules
</h2>

<div className="space-y-4">
  {modules.map((module) => (
    <div
      key={module.id}
      className="bg-black border border-yellow-500 rounded-xl p-5 flex justify-between items-center"
    >
      <div>
        <h3 className="text-xl font-bold text-white">
          {module.title}
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          {module.video}
        </p>
      </div>

      <button
        onClick={async () => {
          if (!window.confirm("Delete this module?")) return;

          await deleteDoc(doc(db, "modules", module.id));

          loadModules();

          alert("✅ Module Deleted");
        }}
        className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-bold"
      >
        Delete
      </button>
    </div>
  ))}
</div>
          </button>

        </div>

      </div>
    </div>
  );
}