import { FaHistory, FaUserGraduate, FaBook } from "react-icons/fa";

export default function RecentActivity({
  students,
  modules,
}) {
  const recentModules = [...modules]
    .sort(
      (a, b) =>
        new Date(b.createdAt?.seconds * 1000 || 0) -
        new Date(a.createdAt?.seconds * 1000 || 0)
    )
    .slice(0, 3);

  const recentStudents = [...students]
    .sort(
      (a, b) =>
        new Date(b.purchasedAt || 0) -
        new Date(a.purchasedAt || 0)
    )
    .slice(0, 3);

  return (
    <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl sm:text-2xl font-black text-yellow-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        <FaHistory size={20} /> Recent Platform Activity
      </h2>

      <div className="space-y-4">
        {recentStudents.length === 0 && recentModules.length === 0 ? (
          <p className="text-zinc-500 text-xs font-light py-4 text-center">
            No recent activity recorded yet.
          </p>
        ) : null}

        {recentStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-start justify-between border-b border-zinc-900 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <FaUserGraduate size={14} />
              </div>
              <div>
                <p className="font-black text-white text-xs sm:text-sm tracking-tight">
                  {student.email}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-light">
                  Enrolled & Paid Course: <span className="text-emerald-400 font-bold">₹{student.course}</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest shrink-0">Student</span>
          </div>
        ))}

        {recentModules.map((module) => (
          <div
            key={module.id}
            className="flex items-start justify-between border-b border-zinc-900 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0 mt-0.5">
                <FaBook size={14} />
              </div>
              <div>
                <p className="font-black text-white text-xs sm:text-sm tracking-tight">
                  {module.title}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-light">
                  Published to <span className="text-yellow-400 font-bold">Day {module.day}</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest shrink-0">Module</span>
          </div>
        ))}
      </div>
    </div>
  );
}