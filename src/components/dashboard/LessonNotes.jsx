import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaStickyNote, FaSave, FaCheck } from "react-icons/fa";

export default function LessonNotes({ lessonId }) {
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const user = auth.currentUser;

  // Fetch saved notes for this specific lesson
  useEffect(() => {
    const fetchNote = async () => {
      if (!user || lessonId === undefined) return;
      try {
        const docRef = doc(db, "notes", `${user.uid}_lesson_${lessonId}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNoteText(docSnap.data().content || "");
        } else {
          setNoteText("");
        }
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };
    fetchNote();
  }, [user, lessonId]);

  // Save notes to Firestore
  const handleSaveNote = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, "notes", `${user.uid}_lesson_${lessonId}`);
      await setDoc(docRef, {
        userId: user.uid,
        lessonId: lessonId,
        content: noteText,
        updatedAt: new Date()
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error("Error saving note:", err);
    }
    setSaving(false);
  };

  return (
    <div className="bg-[#060606] border border-yellow-500/30 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-lg font-black text-yellow-400 flex items-center gap-2">
          <FaStickyNote /> My Personal Lesson Notes
        </h3>
        <span className="text-[11px] text-zinc-400 bg-white/5 px-3 py-1 rounded-full">
          Day #{lessonId + 1}
        </span>
      </div>

      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Yahan apne trading notes, important formulas ya strategy points likhein..."
        className="w-full h-32 bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-yellow-400 resize-none font-light"
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-zinc-500">
          * Your notes are automatically linked to your account and saved securely.
        </p>
        <button
          onClick={handleSaveNote}
          disabled={saving}
          className="w-full sm:w-auto bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-extrabold text-xs hover:bg-yellow-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
        >
          {saving ? "Saving..." : savedSuccess ? <><FaCheck /> Saved!</> : <><FaSave /> Save Notes</>}
        </button>
      </div>
    </div>
  );
}