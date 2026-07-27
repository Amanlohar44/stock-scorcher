import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaBookOpen, FaStickyNote } from "react-icons/fa";

export default function AllNotesSection() {
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAllNotes = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "notes"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => doc.data());
        
        // Sort by lessonId
        fetched.sort((a, b) => a.lessonId - b.lessonId);
        setNotesList(fetched);
      } catch (err) {
        console.error("Error fetching all notes:", err);
      }
      setLoading(false);
    };

    fetchAllNotes();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-[#060606] border border-yellow-500/20 rounded-3xl p-10 text-center text-yellow-400 font-bold">
        Loading Your Notes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#060606] border border-yellow-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-yellow-400 flex items-center gap-2">
            <FaBookOpen /> My Saved Notes Hub
          </h2>
          <p className="text-zinc-400 text-sm font-light mt-1">
            Yahan aapke sabhi lessons aur days ke likhe hue personal trading notes ek sath dikh rahe hain.
          </p>
        </div>
      </div>

      {notesList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notesList.map((note, idx) => (
            <div key={idx} className="bg-[#060606] border border-yellow-500/20 hover:border-yellow-400 p-6 rounded-3xl shadow-xl space-y-3 transition-all">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <FaStickyNote /> Day #{note.lessonId + 1}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {note.updatedAt?.toDate?.() ? new Date(note.updatedAt.toDate()).toLocaleDateString() : "Saved"}
                </span>
              </div>
              <p className="text-zinc-300 text-sm whitespace-pre-wrap font-light leading-relaxed bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#060606] border border-yellow-500/20 rounded-3xl p-12 text-center space-y-3">
          <div className="text-4xl">📝</div>
          <h3 className="text-lg font-bold text-white">No Notes Saved Yet</h3>
          <p className="text-zinc-400 text-xs">Jab aap video dekhte waqt notes likhkar save karenge, toh wo yahan show honge.</p>
        </div>
      )}
    </div>
  );
}