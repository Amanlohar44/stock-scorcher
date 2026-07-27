import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaVideo, FaCalendarAlt, FaClock, FaExternalLinkAlt, FaBroadcastTower } from "react-icons/fa";

export default function LiveClassesSection() {
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "liveSessions"));
        const sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLiveSessions(sessions);
      } catch (error) {
        console.error("Error fetching live sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSessions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-[#060606] border border-yellow-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FaBroadcastTower size={12} className="animate-pulse" /> Live Mentorship
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Live Trading & <span className="text-yellow-400">Masterclasses</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-light mt-1 max-w-2xl">
            Join our live interactive market sessions, intraday Q&A webinars, and chart analysis classes with professional mentors.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
          <p className="text-yellow-400 text-xs font-bold tracking-wider uppercase animate-pulse">Loading Live Sessions...</p>
        </div>
      ) : liveSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveSessions.map((session) => (
            <div 
              key={session.id} 
              className="group bg-[#060606] border border-yellow-500/20 hover:border-yellow-400 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span> Live / Upcoming
                  </span>
                  <span className="text-zinc-400 text-xs flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <FaCalendarAlt className="text-yellow-400" /> {session.date || "Scheduled Soon"}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {session.title || "Live Market Analysis"}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-2 font-light">
                  {session.description || "Join the live interactive webinar session to discuss intraday setups, risk management, and trading psychology."}
                </p>

                {/* Time & Speaker */}
                <div className="my-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-xl border border-yellow-400/20 font-bold">
                    <FaClock /> {session.time || "10:00 AM IST"}
                  </span>
                  <span className="text-zinc-400 font-medium">
                    Speaker: <strong className="text-white">{session.speaker || "Stock Scorcher Expert"}</strong>
                  </span>
                </div>
              </div>

              {/* Join Button */}
              <a
                href={session.meetingUrl || session.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-yellow-400 text-black py-3.5 rounded-2xl font-extrabold text-xs hover:bg-yellow-300 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:scale-[1.02] cursor-pointer"
              >
                <FaVideo size={14} /> Join Live Session <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#060606] border border-yellow-500/20 rounded-3xl p-12 sm:p-16 text-center shadow-2xl max-w-xl mx-auto space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 text-2xl font-bold shadow-lg">
            📺
          </div>
          <h3 className="text-xl font-bold text-white">No Live Sessions Scheduled Right Now</h3>
          <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
            Check back later for upcoming mentorship webinars or explore your recorded video lectures in the dashboard.
          </p>
        </div>
      )}
    </div>
  );
}