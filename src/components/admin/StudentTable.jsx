import { FaUserGraduate, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function StudentTable({
  students,
  search,
  setSearch,
}) {
  const filteredStudents = students.filter((student) =>
    student.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-yellow-400 uppercase tracking-wider flex items-center gap-2">
          <FaUserGraduate size={22} /> Enrolled Students ({students.length})
        </h2>
      </div>

      <div className="mb-6 relative">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
          <FaSearch size={16} />
        </span>
        <input
          type="text"
          placeholder="Search student by email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-yellow-400 outline-none transition-all shadow-inner"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left text-zinc-300">
          <thead className="bg-zinc-900 text-[10px] uppercase font-black text-yellow-400 tracking-wider">
            <tr>
              <th className="px-5 py-4">Student Email</th>
              <th className="px-5 py-4 text-center">Course Price</th>
              <th className="px-5 py-4 text-center">Payment Status</th>
              <th className="px-5 py-4 text-center">Payment ID</th>
              <th className="px-5 py-4 text-center">Enrollment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 font-medium">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-zinc-500 font-light">
                  No matching student records found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isPaid = student.paymentStatus === "paid";
                return (
                  <tr
                    key={student.id}
                    className="hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-5 py-4 font-bold text-white">
                      {student.email}
                    </td>

                    <td className="px-5 py-4 text-center font-bold text-emerald-400">
                      ₹{Number(student.course || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPaid
                            ? "bg-green-500/20 border border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                            : "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {isPaid ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                        {student.paymentStatus || "Pending"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center font-mono text-[11px] text-zinc-400">
                      {student.paymentId || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-center text-zinc-400">
                      {student.purchasedAt
                        ? new Date(student.purchasedAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}