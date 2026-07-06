import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [pdf, setPdf] = useState("");

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
          </button>

        </div>

      </div>
    </div>
  );
}